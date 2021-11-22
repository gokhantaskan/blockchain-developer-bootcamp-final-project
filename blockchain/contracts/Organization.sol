// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// TODO: It will be the factory (or abstract?) contract
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Organization is Ownable, AccessControl {
  string private name;
  string private registrationId;
  string private email;
  string private phone;
  address[] private admins;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  event LogOrganizationCreated(
    address indexed addr,
    string name,
    string registrationId,
    string email,
    string phone,
    address[] admins
  );

  constructor(
    string memory _name,
    string memory _registrationId,
    string memory _email,
    string memory _phone,
    address[] memory _admins
  ) {
    if (
      (bytes(_name).length != 0) &&
      (bytes(_registrationId).length != 0) &&
      (bytes(_email).length != 0) &&
      (bytes(_phone).length != 0)
    ) {
      name = _name;
      registrationId = _registrationId;
      email = _email;
      phone = _phone;
      admins = _admins;

      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

      for (uint i = 0; i < admins.length; i++) {
        _setupRole(ADMIN_ROLE, _admins[i]);
      }

      emit LogOrganizationCreated(
        address(this),
        _name,
        _registrationId,
        _email,
        _phone,
        _admins
      );
    } else {
      revert("Fill all the fields!");
    }
  }

  function getOrganizationDetails()
    public
    view
    returns (
      string memory,
      string memory,
      string memory,
      string memory
    )
  {
    return (name, registrationId, email, phone);
  }

  function getOrganizationAdmins() public view returns (address[] memory) {
    return admins;
  }

  function updateOrganizationDetails(
    string memory _name,
    string memory _registrationId,
    string memory _email,
    string memory _phone
  ) public onlyRole(ADMIN_ROLE) {
    if (bytes(_name).length != 0) name = _name;
    if (bytes(_registrationId).length != 0) registrationId = _registrationId;
    if (bytes(_email).length != 0) email = _email;
    if (bytes(_phone).length != 0) phone = _phone;
  }

  function updateOrganizationAdmins(address[] memory _admins) public onlyOwner {
    admins = _admins;

    for (uint i = 0; i < _admins.length; i++) {
      _setupRole(ADMIN_ROLE, _admins[i]);
    }
  }

  // TODO: Destroy the contract
}
