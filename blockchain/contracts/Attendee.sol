// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Attendees {
  struct Attendee {
    string firstName;
    string lastName;
    string nationalID;
    string email;
    string phone;
    address bcAddress;
  }

  mapping (address => Attendee) attendeesList;

  uint public attendeeCount;
  address public owner;

  modifier onlyOwner() {
    require(owner == msg.sender, "You are not the contract owner!");
    _;
  }

  modifier onlyAttendee(address _address) {
    require(
      attendeesList[_address].bcAddress == msg.sender,
      "You are not the attendee!"
    );
    _;
  }

  constructor() public {
    owner = msg.sender;
  }

  function isAttendee(address _address) internal view returns (bool) {
    if (
      // ! nationalID must be unique!
      bytes(attendeesList[_address].firstName).length != 0 &&
      bytes(attendeesList[_address].lastName).length != 0 &&
      bytes(attendeesList[_address].nationalID).length != 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  function createAttendee(
    string memory _firstName,
    string memory _lastName,
    string memory _nationalID,
    string memory _email,
    string memory _phone
  ) public {
    if (isAttendee(msg.sender)) revert("You can only attend once!");

    attendeesList[msg.sender] = Attendee({
      firstName: _firstName,
      lastName: _lastName,
      nationalID: _nationalID,
      email: _email,
      phone: _phone,
      bcAddress: msg.sender
    });

    attendeeCount += 1;
  }

  function getAttendeeDetails()
    public
    view
    onlyAttendee(msg.sender)
    returns (
      string memory firstName,
      string memory lastName,
      string memory nationalID,
      string memory email,
      string memory phone
    )
  {
    return (
      attendeesList[msg.sender].firstName,
      attendeesList[msg.sender].lastName,
      attendeesList[msg.sender].nationalID,
      attendeesList[msg.sender].email,
      attendeesList[msg.sender].phone
    );
  }

  function updateAttendeeDetails(
    string memory _firstName,
    string memory _lastName,
    string memory _nationalID,
    string memory _email,
    string memory _phone
  ) public onlyAttendee(msg.sender) {
    if (bytes(_firstName).length != 0)
      attendeesList[msg.sender].firstName = _firstName;

    if (bytes(_lastName).length != 0)
      attendeesList[msg.sender].lastName = _lastName;

    if (bytes(_nationalID).length != 0)
      attendeesList[msg.sender].nationalID = _nationalID;

    if (bytes(_email).length != 0)
      attendeesList[msg.sender].email = _email;

    if (bytes(_phone).length != 0)
      attendeesList[msg.sender].phone = _phone;
  }
}
