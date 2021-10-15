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

  mapping(address => Attendee) attendeesList;

  uint public attendeeCount;
  address public owner;

  modifier onlyOwner() {
    require(owner == msg.sender, "You are not the contract owner!");
    _;
  }

  modifier onlyAttendee(address _address) {
    require(
      attendeesList[_address].bcAddress == msg.sender,
      "You must be an attendee!"
    );
    _;
  }

  constructor() public {
    owner = msg.sender;
  }

  function isAttendee(address _address) public view returns (bool) {
    if (
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
    string memory firstName,
    string memory lastName,
    string memory nationalID,
    string memory email,
    string memory phone
  ) public {
    if (isAttendee(msg.sender)) revert("You can only attend once!");

    attendeesList[msg.sender].firstName = firstName;
    attendeesList[msg.sender].lastName = lastName;
    attendeesList[msg.sender].nationalID = nationalID;
    attendeesList[msg.sender].email = email;
    attendeesList[msg.sender].phone = phone;
    attendeesList[msg.sender].bcAddress = msg.sender;

    attendeeCount += 1;
  }

  function getAttendee()
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
}
