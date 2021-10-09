var Attendee = artifacts.require("./Attendee.sol");

module.exports = function (deployer) {
  deployer.deploy(Attendee);
};