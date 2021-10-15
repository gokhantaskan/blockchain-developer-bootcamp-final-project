var Storage = artifacts.require("./Storage.sol");
var Attendees = artifacts.require("./Attendees.sol");

module.exports = function (deployer) {
  deployer.deploy(Storage);
  deployer.deploy(Attendees);
};