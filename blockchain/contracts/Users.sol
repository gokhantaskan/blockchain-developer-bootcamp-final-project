// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

/// @title Users Contract
/// @author Gokhan Taskan
/// @notice You can use this contract to create, update and delete a user profile

import "./Organization.sol";

contract Users {
  struct User {
    string firstName;
    string lastName;
    string nationalId;
    string email;
    string phone;
    Gender gender;
  }

  enum Gender {
    Male,
    Female,
    Transgender
  }

  mapping(address => User) private users;
  mapping(address => Organization[]) public organizations;
  mapping(bytes32 => address) private nationalIds;
  mapping(bytes32 => address) private emails;
  mapping(bytes32 => address) private phones;

  uint public userCount;

  event LogUserCreated(
    address indexed addr,
    bytes32 firstName,
    bytes32 lastName,
    bytes32 nationalId,
    bytes32 email,
    bytes32 phone
  );
  event LogUserUpdated(address indexed addr, bytes32 email, bytes32 phone);
  event LogUserDeleted(address indexed addr);

  function stringToBytes32(string memory str) internal pure returns (bytes32) {
    return (keccak256(abi.encodePacked(str)));
  }

  // ! USER FUNCTIONS START

  /// @notice Checks if the given address is bound to a user, can be used in the front-end applications
  /// @param _address The address to check
  /// @return bool - true or false
  function isUser(address _address) public view returns (bool) {
    if (
      bytes(users[_address].firstName).length != 0 &&
      bytes(users[_address].lastName).length != 0 &&
      bytes(users[_address].nationalId).length != 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  function createUser(
    string memory _firstName,
    string memory _lastName,
    string memory _nationalId,
    string memory _email,
    string memory _phone,
    Gender _gender
  ) public {
    if (isUser(msg.sender)) revert("You can only attend once!");

    // Check required fields
    if (bytes(_firstName).length == 0) revert("First name is required!");
    if (bytes(_lastName).length == 0) revert("Last name is required!");
    if (bytes(_nationalId).length == 0) revert("National ID is required!");

    // Check uniqueness
    if (nationalIds[stringToBytes32(_nationalId)] != address(0))
      revert("This ID is used before!");

    if (emails[stringToBytes32(_email)] != address(0))
      revert("This e-mail is used before!");

    if (phones[stringToBytes32(_phone)] != address(0))
      revert("This phone is used before!");

    User memory user = User({
      firstName: _firstName,
      lastName: _lastName,
      nationalId: _nationalId,
      email: _email,
      phone: _phone,
      gender: _gender
    });

    if (bytes(_nationalId).length != 0)
      nationalIds[stringToBytes32(_nationalId)] = msg.sender;

    if (bytes(_email).length != 0) emails[stringToBytes32(_email)] = msg.sender;
    if (bytes(_phone).length != 0) phones[stringToBytes32(_phone)] = msg.sender;

    users[msg.sender] = user;
    userCount += 1;

    emit LogUserCreated(
      msg.sender,
      stringToBytes32(_firstName),
      stringToBytes32(_lastName),
      stringToBytes32(_nationalId),
      stringToBytes32(_email),
      stringToBytes32(_phone)
    );
  }

  function readUser()
    public
    view
    returns (
      string memory firstName,
      string memory lastName,
      string memory nationalId,
      string memory email,
      string memory phone,
      Gender gender
    )
  {
    return (
      users[msg.sender].firstName,
      users[msg.sender].lastName,
      users[msg.sender].nationalId,
      users[msg.sender].email,
      users[msg.sender].phone,
      users[msg.sender].gender
    );
  }

  function updateUser(string memory _email, string memory _phone) public {
    string memory currentEmail = users[msg.sender].email;
    string memory currentPhone = users[msg.sender].phone;

    if (
      emails[stringToBytes32(_email)] != address(0) &&
      emails[stringToBytes32(_email)] != msg.sender
    ) {
      revert("This e-mail is used before!");
    }

    if (
      phones[stringToBytes32(_phone)] != address(0) &&
      phones[stringToBytes32(_phone)] != msg.sender
    ) {
      revert("This phone is used before!");
    }

    users[msg.sender].email = _email;
    users[msg.sender].phone = _phone;

    emails[stringToBytes32(currentEmail)] = address(0);
    phones[stringToBytes32(currentPhone)] = address(0);

    if (bytes(_email).length != 0) emails[stringToBytes32(_email)] = msg.sender;
    if (bytes(_phone).length != 0) phones[stringToBytes32(_phone)] = msg.sender;

    emit LogUserUpdated(
      msg.sender,
      stringToBytes32(_email),
      stringToBytes32(_phone)
    );
  }

  function deleteUser() public {
    string memory nationalId = users[msg.sender].nationalId;
    string memory email = users[msg.sender].email;
    string memory phone = users[msg.sender].phone;

    nationalIds[stringToBytes32(nationalId)] = address(0);
    emails[stringToBytes32(email)] = address(0);
    phones[stringToBytes32(phone)] = address(0);

    delete users[msg.sender];

    userCount -= 1;

    emit LogUserDeleted(msg.sender);
  }

  // ! USER FUNCTIONS END

  // ! ORGANIZATON FUNCTIONS START
  function createOrganization(
    string memory _name,
    string memory _registrationId,
    string memory _email,
    string memory _phone,
    address[] memory _admins
  ) public {
    if (!isUser(msg.sender)) revert("You need to be a user first!");

    Organization o = new Organization(
      _name,
      _registrationId,
      _email,
      _phone,
      _admins,
      msg.sender
    );

    organizations[msg.sender].push(o);

    for (uint i; i < _admins.length; i++) {
      organizations[_admins[i]].push(o);
    }
  }
}
