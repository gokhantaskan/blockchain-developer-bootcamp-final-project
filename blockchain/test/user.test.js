const Users = artifacts.require("Users");

let BN = web3.utils.BN;
// let { catchRevert } = require("./exceptionsHelpers.js");
// const { items: ItemStruct, isDefined, isPayable, isType } = require("./ast-helper");

contract("Users", accounts => {
  it("should have 0 users when it is deployed", async () => {
    const instance = await Users.deployed();
    const userCount = await instance.userCount.call({ from: accounts[0] });
    console.log(userCount);

    assert.equal(userCount.toNumber(), 0);
  });
});