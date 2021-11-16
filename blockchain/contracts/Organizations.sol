// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Users.sol";

contract Organizations is AccessControl {
  struct Organization {
    string name;
    string registrationId;
    string email;
    string phone;
    address[] admins;
    address organizationOwner;
  }

  mapping(address => Organization) private organizationsList;

  bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  uint public organizationCount;

  modifier onlyOrganization(address _address) {
    require(
      organizationsList[_address].organizationOwner == msg.sender,
      "You are not the owner of the organization!"
    );
    _;
  }

  function isOrganization(address _address) public view returns (bool) {
    if (
      bytes(organizationsList[_address].name).length != 0 &&
      bytes(organizationsList[_address].registrationId).length != 0 &&
      bytes(organizationsList[_address].email).length != 0 &&
      bytes(organizationsList[_address].phone).length != 0 &&
      organizationsList[_address].organizationOwner != address(0)
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
    // if (isUser(msg.sender)) revert("You have to create a user profile first!");
    if (isOrganization(msg.sender)) revert("You can only attend once!");

    organizationsList[msg.sender] = Organization({
      name: _name,
      registrationId: _registrationId,
      email: _email,
      phone: _phone,
      admins: _admins,
      organizationOwner: msg.sender
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
      string memory phone,
      address[] memory admins
    )
  {
    return (
      organizationsList[msg.sender].name,
      organizationsList[msg.sender].registrationId,
      organizationsList[msg.sender].email,
      organizationsList[msg.sender].phone,
      organizationsList[msg.sender].admins
    );
  }

  function updateOrganizationDetails(
    string memory _name,
    string memory _registrationId,
    string memory _email,
    string memory _phone
  ) public onlyOrganization(msg.sender) {
    if (bytes(_name).length != 0) organizationsList[msg.sender].name = _name;

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
