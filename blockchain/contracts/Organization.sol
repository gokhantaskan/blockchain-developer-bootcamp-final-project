// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// TODO: It will be the factory contract
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Organizations is Ownable, AccessControl {
  string public name;
  string public registrationId;
  string public email;
  string public phone;
  address[] public admins;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  event Log(address owner);

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
      string memory,
      address[] memory
    )
  {
    return (name, registrationId, email, phone, admins);
  }

  function updateOrganizationDetails(
    string memory _name,
    string memory _registrationId,
    string memory _email,
    string memory _phone
  ) public onlyOwner {
    require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin!");

    if (bytes(_name).length != 0) name = _name;
    if (bytes(_registrationId).length != 0) registrationId = _registrationId;
    if (bytes(_email).length != 0) email = _email;
    if (bytes(_phone).length != 0) phone = _phone;
  }

  function updateOrganizationAdmins(address[] memory _admins) public onlyOwner {
    require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin!");

    admins = _admins;
  }

  // TODO: Destruct the contract
}
