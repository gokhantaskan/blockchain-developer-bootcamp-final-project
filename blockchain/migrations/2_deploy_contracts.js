var Users = artifacts.require("Users");
var OrganizationFactory = artifacts.require("OrganizationFactory");

module.exports = async function (deployer) {
  await deployer.deploy(OrganizationFactory);
  let a = await OrganizationFactory.deployed();

  // console.log("Organization Factory Contract", a);
  deployer.deploy(Users, a.address);
};