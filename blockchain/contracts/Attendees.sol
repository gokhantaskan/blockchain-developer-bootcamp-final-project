// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Attendees {
  struct Attendee {
    string firstName;
    string lastName;
    string nationalId;
    string email;
    string phone;
    address bcAddress;
  }

  mapping(address => Attendee) attendeesList;

  uint public attendeeCount;

  modifier onlyAttendee(address _address) {
    require(
      attendeesList[_address].bcAddress == msg.sender,
      "You have not attended yet!"
    );
    _;
  }

  // modifier isAttendee(address _address) {
  //   require(
  //     // TODO: nationalId must be unique!
  //     bytes(attendeesList[_address].firstName).length == 0 &&
  //       bytes(attendeesList[_address].lastName).length == 0 &&
  //       bytes(attendeesList[_address].nationalId).length == 0,
  //     "You have already attended!"
  //   );
  //   _;
  // }

  function isAttendee(address _address)
    public
    view
    returns (bool)
  {
    if (
      // TODO: nationalId must be unique!
      bytes(attendeesList[_address].firstName).length != 0 &&
      bytes(attendeesList[_address].lastName).length != 0 &&
      bytes(attendeesList[_address].nationalId).length != 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  function createAttendee(
    string memory _firstName,
    string memory _lastName,
    string memory _nationalId,
    string memory _email,
    string memory _phone
  ) public /* isAttendee(msg.sender) */ {
    if (isAttendee(msg.sender))
      revert("You can only attend once!");

    attendeesList[msg.sender] = Attendee({
      firstName: _firstName,
      lastName: _lastName,
      nationalId: _nationalId,
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
      string memory nationalId,
      string memory email,
      string memory phone
    )
  {
    return (
      attendeesList[msg.sender].firstName,
      attendeesList[msg.sender].lastName,
      attendeesList[msg.sender].nationalId,
      attendeesList[msg.sender].email,
      attendeesList[msg.sender].phone
    );
  }

  function updateAttendeeDetails(
    string memory _firstName,
    string memory _lastName,
    string memory _nationalId,
    string memory _email,
    string memory _phone
  ) public onlyAttendee(msg.sender) {
    if (bytes(_firstName).length != 0)
      attendeesList[msg.sender].firstName = _firstName;

    if (bytes(_lastName).length != 0)
      attendeesList[msg.sender].lastName = _lastName;

    if (bytes(_nationalId).length != 0)
      attendeesList[msg.sender].nationalId = _nationalId;

    if (bytes(_email).length != 0)
      attendeesList[msg.sender].email = _email;

    if (bytes(_phone).length != 0)
      attendeesList[msg.sender].phone = _phone;
  }

  function removeAttendee() public onlyAttendee(msg.sender) {
    delete attendeesList[msg.sender];
    attendeeCount -= 1;
  }
}
