// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Users {
  struct User {
    string firstName;
    string lastName;
    string nationalId;
    string email;
    string phone;
    address bcAddress;
  }

  mapping(address => User) usersList;

  uint public userCount;

  modifier onlyUser(address _address) {
    require(
      usersList[_address].bcAddress == msg.sender,
      "You have not attended yet!"
    );
    _;
  }

  // modifier isUser(address _address) {
  //   require(
  //     // TODO: nationalId must be unique!
  //     bytes(usersList[_address].firstName).length == 0 &&
  //       bytes(usersList[_address].lastName).length == 0 &&
  //       bytes(usersList[_address].nationalId).length == 0,
  //     "You have already attended!"
  //   );
  //   _;
  // }

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
    string memory _phone /* isUser(msg.sender) */
  ) public {
    if (isUser(msg.sender)) revert("You can only attend once!");

    usersList[msg.sender] = User({
      firstName: _firstName,
      lastName: _lastName,
      nationalId: _nationalId,
      email: _email,
      phone: _phone,
      bcAddress: msg.sender
    });

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
      string memory phone
    )
  {
    return (
      usersList[msg.sender].firstName,
      usersList[msg.sender].lastName,
      usersList[msg.sender].nationalId,
      usersList[msg.sender].email,
      usersList[msg.sender].phone
    );
  }

  function updateUserDetails(
    string memory _firstName,
    string memory _lastName,
    string memory _nationalId,
    string memory _email,
    string memory _phone
  ) public onlyUser(msg.sender) {
    usersList[msg.sender].firstName = _firstName;
    usersList[msg.sender].lastName = _lastName;
    usersList[msg.sender].nationalId = _nationalId;
    usersList[msg.sender].email = _email;
    usersList[msg.sender].phone = _phone;
  }

  function removeUser() public onlyUser(msg.sender) {
    delete usersList[msg.sender];
    userCount -= 1;
  }
}
