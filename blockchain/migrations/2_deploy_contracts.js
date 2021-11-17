var Users = artifacts.require("./Users.sol");
// var Organization = artifacts.require("./Organization.sol");

module.exports = function (deployer) {
  deployer.deploy(Users);
  // deployer.deploy(Organizations);
};