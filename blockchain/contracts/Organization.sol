// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Organizations {
  struct Organization {
    string name;
    string registrationId;
    string email;
    string phone;
    address[] admins;
    address ownerAddress;
  }

  mapping(address => Organization) organizationsList;

  uint public organizationCount;

  modifier onlyOrganization(address _address) {
    require(
      organizationsList[_address].ownerAddress == msg.sender,
      "You are not an organization!"
    );
    _;
  }

  // modifier isOrganization(address _address) {
  //   require(
  //     // TODO: registrationId must be unique!
  //     bytes(organizationsList[_address].name).length == 0 &&
  //       bytes(organizationsList[_address].lastName).length == 0 &&
  //       bytes(organizationsList[_address].registrationId).length == 0,
  //     "You have already attended!"
  //   );
  //   _;
  // }

  function isOrganization(address _address) public view returns (bool) {
    if (
      // TODO: registrationId must be unique!
      bytes(organizationsList[_address].name).length != 0 &&
      bytes(organizationsList[_address].registrationId).length != 0 &&
      organizationsList[_address].ownerAddress != address(0)
    ) {
      return true;
    } else {
      return false;
    }
  }

  function createOrganization(
    string memory _name,
    string memory _registrationId,
    string memory _email,
    string memory _phone,
    address[] memory _admins
  ) public {
    if (isOrganization(msg.sender)) revert("You have already created an organization!");

    organizationsList[msg.sender] = Organization({
      name: _name,
      registrationId: _registrationId,
      email: _email,
      phone: _phone,
      admins: _admins,
      ownerAddress: msg.sender
    });

    organizationCount += 1;
  }

  function getOrganizationDetails()
    public
    view
    onlyOrganization(msg.sender)
    returns (
      string memory name,
      string memory registrationId,
      string memory email,
      string memory phone
    )
  {
    return (
      organizationsList[msg.sender].name,
      organizationsList[msg.sender].registrationId,
      organizationsList[msg.sender].email,
      organizationsList[msg.sender].phone
    );
  }

  function updateOrganizationDetails(
    string memory _name,
    string memory _registrationId,
    string memory _email,
    string memory _phone
  ) public onlyOrganization(msg.sender) {
    if (bytes(_name).length != 0)
      organizationsList[msg.sender].name = _name;

    if (bytes(_registrationId).length != 0)
      organizationsList[msg.sender].registrationId = _registrationId;

    organizationsList[msg.sender].email = _email;
    organizationsList[msg.sender].phone = _phone;
  }

  function removeOrganization() public onlyOrganization(msg.sender) {
    delete organizationsList[msg.sender];
    organizationCount -= 1;
  }
}
