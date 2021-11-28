// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// TODO: It will be the factory (or abstract?) contract
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Organization is AccessControl {
  string private name;
  string private registrationId;
  string private email;
  string private phone;
  address[] private admins;
  address public owner;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  event LogOrganizationCreated(
    address indexed contractAddress,
    string name,
    string registrationId,
    string email,
    string phone,
    address[] admins,
    address owner
  );

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner(address _owner) {
    require(owner == _owner, "Ownable: caller is not the owner");
    _;
  }

  constructor(
    string memory _name,
    string memory _registrationId,
    string memory _email,
    string memory _phone,
    address[] memory _admins,
    address _owner
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
      owner = _owner;

      _setupRole(DEFAULT_ADMIN_ROLE, _owner);
      _setupRole(ADMIN_ROLE, _owner);

      for (uint i = 0; i < admins.length; i++) {
        _setupRole(ADMIN_ROLE, _admins[i]);
      }

      emit LogOrganizationCreated(
        address(this),
        _name,
        _registrationId,
        _email,
        _phone,
        _admins,
        _owner
      );
    } else {
      revert("Missing one or more requirements!");
    }
  }

  function readOrganization()
    public
    view
    returns (
      string memory _name,
      string memory _registrationId,
      string memory _email,
      string memory _phone,
      address[] memory _admins,
      address _owner
    )
  {
    return (name, registrationId, email, phone, admins, owner);
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

  function grantAdmin(address[] memory _admins) public onlyOwner(msg.sender) {
    for (uint i = 0; i < _admins.length; i++) {
      grantRole(ADMIN_ROLE, _admins[i]);
    }
  }

  function revokeAdmins(address[] memory _admins) public onlyOwner(msg.sender) {
    for (uint i = 0; i < _admins.length; i++) {
      revokeRole(ADMIN_ROLE, _admins[i]);
    }
  }

  // TODO: Destroy the contract
  function deleteOrganization() internal onlyOwner(msg.sender) {}
}
