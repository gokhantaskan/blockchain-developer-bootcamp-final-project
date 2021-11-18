const Users = artifacts.require("Users");

let BN = web3.utils.BN;
let { catchRevert } = require("./exceptionsHelpers.js");
// const { items: ItemStruct, isDefined, isPayable, isType } = require("./ast-helper");

const emptyMock = {
  firstName: "",
  lastName: "",
  nationalId: "",
  email: "",
  phone: "",
  gender: 0,
};

const mockUser1 = {
  firstName: "Gökhan",
  lastName: "Taşkan",
  nationalId: "12345",
  email: "gokhan@gmail.com",
  phone: "+905420000000",
  gender: 0,
};

const mockUser2 = {
  firstName: "Yasemin",
  lastName: "Taşkan",
  nationalId: "12345",
  email: "",
  phone: "",
  gender: 1,
};

const bnToString = (arg) => {
  arg.toString(10);
};

contract("Users", accounts => {
  beforeEach(async () => {
    instance = await Users.new();
  });

  describe("Basic Functionality", () => {
    it("should have 0 users when it is deployed", async () => {
      const userCount = await instance.userCount.call({ from: accounts[0] });

      assert.equal(userCount.toNumber(), 0);
    });

    it("should revert if the required fields are not set", async () => {
      const copy = { ...emptyMock };

      instance.createUser(
        copy.firstName,
        copy.lastName,
        copy.nationalId,
        copy.email,
        copy.phone,
        copy.gender,
        { from: accounts[0] }
      ).catch(err => console.log(err.reason));

      copy.firstName = "Gökhan";

      instance.createUser(
        copy.firstName,
        copy.lastName,
        copy.nationalId,
        copy.email,
        copy.phone,
        copy.gender,
        { from: accounts[0] }
      ).catch(err => console.log(err.reason));

      copy.lastName = "Taşkan";

      instance.createUser(
        copy.firstName,
        copy.lastName,
        copy.nationalId,
        copy.email,
        copy.phone,
        copy.gender,
        { from: accounts[0] }
      ).catch(err => console.log(err.reason));
    });

    it("should create a basic profile", async () => {
      await instance.createUser(
        mockUser1.firstName,
        mockUser1.lastName,
        mockUser1.nationalId,
        mockUser1.email,
        mockUser1.phone,
        mockUser1.gender,
        { from: accounts[0] }
      );

      const user1 = await instance.getUserDetails.call({ from: accounts[0] });

      assert.equal(
        user1[0],
        mockUser1.firstName,
        "the firstName of the last added item does not match the expected value",
      );

      assert.equal(
        user1[1],
        mockUser1.lastName,
        "the lastName of the last added item does not match the expected value",
      );

      assert.equal(
        user1[2],
        mockUser1.nationalId,
        "the nationalId of the last added item does not match the expected value",
      );

      assert.equal(
        user1[3],
        mockUser1.email,
        "the email of the last added item does not match the expected value",
      );

      assert.equal(
        user1[4],
        mockUser1.phone,
        "the phone of the last added item does not match the expected value",
      );

      assert.equal(
        user1[5],
        Users.Gender.Male,
        "the gender of the last added item does not match the expected value",
      );

      // const tx2 = await instance.createUser(
      //   mockUser2.firstName,
      //   mockUser2.lastName,
      //   mockUser2.nationalId,
      //   mockUser2.email,
      //   mockUser2.phone,
      //   mockUser2.gender,
      //   { from: accounts[1] }
      // );

      // const user2 = await instance.getUserDetails.call({ from: accounts[1] });

      // console.log(user2);

      // assert.equal(userCount.toNumber(), 0);
    });
  });
});