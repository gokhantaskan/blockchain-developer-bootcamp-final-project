// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Organization.sol";

contract OrganizationFactory is Ownable, AccessControl {
  Organization[] public organizationAddresses;
  uint public organizationsCount;

  mapping(address => Organization[]) private organizations;

  event LogOrganizationAdded(Organization o);

  function createOrganization(
    string memory _name,
    string memory _registrationId,
    string memory _email,
    string memory _phone,
    address[] memory _admins,
    address _owner
  ) external {
    Organization o = new Organization(
      _name,
      _registrationId,
      _email,
      _phone,
      _admins,
      _owner
    );

    organizationAddresses.push(o);

    // Add fucntion caller
    organizations[msg.sender].push(o);

    // Add admins
    for (uint i; i < _admins.length; i++) {
      organizations[_admins[i]].push(o);
    }

    organizationsCount = organizationAddresses.length + 1;
    emit LogOrganizationAdded(o);
  }

  function getOrganizations() external view returns (Organization[] memory) {
    return organizations[msg.sender];
  }
}
