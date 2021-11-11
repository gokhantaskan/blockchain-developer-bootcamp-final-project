// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Users {
  enum Gender {
    Male,
    Female,
    Transgender
  }

  struct User {
    address ownerAddress;
    string firstName;
    string lastName;
    string nationalId;
    string email;
    string phone;
    Gender gender;
  }

  mapping(address => User) usersList;

  uint public userCount;

  modifier onlyUser(address _address) {
    require(
      usersList[_address].ownerAddress == msg.sender,
      "You have not attended yet!"
    );
    _;
  }

  function isUser(address _address) public view returns (bool) {
    if (
      // TODO: nationalId must be unique!
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

    User memory user = User({
      firstName: _firstName,
      lastName: _lastName,
      nationalId: _nationalId,
      email: _email,
      phone: _phone,
      gender: _gender,
      ownerAddress: msg.sender
    });

    usersList[msg.sender] = user;

    userCount += 1;
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

  function updateUserDetails(
    string memory _firstName,
    string memory _lastName,
    string memory _nationalId,
    string memory _email,
    string memory _phone,
    Gender _gender
  ) public onlyUser(msg.sender) {
    if (bytes(_firstName).length != 0)
      usersList[msg.sender].firstName = _firstName;

    if (bytes(_lastName).length != 0)
      usersList[msg.sender].lastName = _lastName;

    if (bytes(_nationalId).length != 0)
      usersList[msg.sender].nationalId = _nationalId;

    usersList[msg.sender].email = _email;
    usersList[msg.sender].phone = _phone;
    usersList[msg.sender].gender = _gender;
  }

  function removeUser() public onlyUser(msg.sender) {
    delete usersList[msg.sender];
    userCount -= 1;
  }
}
