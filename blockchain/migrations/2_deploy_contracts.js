var Users = artifacts.require("./Users.sol");
// var Organizations = artifacts.require("./Organizations.sol");

module.exports = function (deployer) {
  deployer.deploy(Users);
  // deployer.deploy(Organizations);
};