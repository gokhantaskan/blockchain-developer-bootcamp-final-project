// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

/// @title Users Contract
/// @author Gokhan Taskan
/// @notice You can use this contract to create, update and delete a user profile
contract Users {
  struct User {
    address ownerAddress;
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

  mapping(address => User) private usersList;
  mapping(string => address) private ids;
  mapping(string => address) public emails;
  mapping(string => address) public phones;

  uint public userCount;

  event LogUserCreated(
    address addr,
    string firstName,
    string lastName,
    string id,
    string email,
    string phone
  );
  event LogUserUpdated(address addr, string email, string phone);
  event LogUserDeleted(address addr);

  modifier onlyUser(address _address) {
    require(
      usersList[_address].ownerAddress == msg.sender,
      "You have not attended yet!"
    );
    _;
  }

  /// @notice Checks if the given address is bound to a user, can be used in the front-end applications
  /// @param _address The address to check
  /// @return bool - true or false
  function isUser(address _address) public view returns (bool) {
    if (
      bytes(usersList[_address].firstName).length != 0 &&
      bytes(usersList[_address].lastName).length != 0 &&
      bytes(usersList[_address].nationalId).length != 0
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
    if (ids[_nationalId] != address(0)) revert("This ID is used before!");
    if (emails[_email] != address(0)) revert("This e-mail is used before!");
    if (phones[_phone] != address(0)) revert("This phone is used before!");

    User memory user = User({
      firstName: _firstName,
      lastName: _lastName,
      nationalId: _nationalId,
      email: _email,
      phone: _phone,
      gender: _gender,
      ownerAddress: msg.sender
    });

    if (bytes(_nationalId).length != 0) ids[_nationalId] = msg.sender;
    if (bytes(_email).length != 0) emails[_email] = msg.sender;
    if (bytes(_phone).length != 0) phones[_phone] = msg.sender;

    usersList[msg.sender] = user;
    userCount += 1;

    emit LogUserCreated(
      msg.sender,
      _firstName,
      _lastName,
      _nationalId,
      _email,
      _phone
    );
  }

  function getUserDetails()
    public
    view
    onlyUser(msg.sender)
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
      usersList[msg.sender].firstName,
      usersList[msg.sender].lastName,
      usersList[msg.sender].nationalId,
      usersList[msg.sender].email,
      usersList[msg.sender].phone,
      usersList[msg.sender].gender
    );
  }

  function updateUserDetails(string memory _email, string memory _phone)
    public
    onlyUser(msg.sender)
  {
    string memory currentEmail = usersList[msg.sender].email;
    string memory currentPhone = usersList[msg.sender].phone;

    if (emails[_email] != address(0) && emails[_email] != msg.sender)
      revert("This e-mail is used before!");

    if (phones[_phone] != address(0) && phones[_phone] != msg.sender)
      revert("This phone is used before!");

    usersList[msg.sender].email = _email;
    usersList[msg.sender].phone = _phone;

    emails[currentEmail] = address(0);
    phones[currentPhone] = address(0);
    if (bytes(_email).length != 0) emails[_email] = msg.sender;
    if (bytes(_phone).length != 0) phones[_phone] = msg.sender;
    // if (bytes(abi.encodePacked(ids[_email])).length != 0) emails[_email] = msg.sender;
    // if (bytes(abi.encodePacked(ids[_phone])).length != 0) phones[_phone] = msg.sender;

    emit LogUserUpdated(msg.sender, _email, _phone);
  }

  function removeUser() public onlyUser(msg.sender) {
    string memory id = usersList[msg.sender].nationalId;
    string memory email = usersList[msg.sender].email;
    string memory phone = usersList[msg.sender].phone;

    ids[id] = address(0);
    emails[email] = address(0);
    phones[phone] = address(0);

    delete usersList[msg.sender];

    userCount -= 1;

    emit LogUserDeleted(msg.sender);
  }
}
