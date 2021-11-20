// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IOrganization {
  event Log(address owner);

  function getOrganizationDetails()
    external
    view
    returns (
      string memory,
      string memory,
      string memory,
      string memory,
      address[] memory
    );

  function updateOrganizationDetails(
    string memory _name,
    string memory _registrationId,
    string memory _email,
    string memory _phone
  ) external;

  function updateOrganizationAdmins(address[] memory _admins) external;

  // TODO: Destroy the contract
}
