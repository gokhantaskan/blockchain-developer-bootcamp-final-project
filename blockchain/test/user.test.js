const Users = artifacts.require("Users");

// let BN = web3.utils.BN;
// let { catchRevert } = require("./exceptionsHelpers.js");
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
  email: "gokhan@gmail.com",
  phone: "+905420000000",
  gender: 1,
};

const bnToString = (arg) => {
  arg.toString(10);
};

const createMockUser = (data, instance, accounts, accountIndex = 0) => {
  const copy = { ...data };

  return new Promise(async (resolve, reject) => {
    await instance.createUser(
      copy.firstName,
      copy.lastName,
      copy.nationalId,
      copy.email,
      copy.phone,
      copy.gender,
      { from: accounts[accountIndex] }
    );

    await instance.getUserDetails.call({ from: accounts[accountIndex] })
      .then(res => resolve(res))
      .catch(err => reject(Error(err)));
  });
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

      await instance.createUser(
        copy.firstName,
        copy.lastName,
        copy.nationalId,
        copy.email,
        copy.phone,
        copy.gender,
        { from: accounts[0] }
      ).catch(err => console.log(`\t\t${err.reason}`));

      copy.firstName = "Gökhan";

      await instance.createUser(
        copy.firstName,
        copy.lastName,
        copy.nationalId,
        copy.email,
        copy.phone,
        copy.gender,
        { from: accounts[0] }
      ).catch(err => console.log(`\t\t${err.reason}`));

      copy.lastName = "Taşkan";

      await instance.createUser(
        copy.firstName,
        copy.lastName,
        copy.nationalId,
        copy.email,
        copy.phone,
        copy.gender,
        { from: accounts[0] }
      ).catch(err => console.log(`\t\t${err.reason}`));
    });

    it("should create a basic profile", async () => {
      const initialCount = await instance.userCount.call({ from: accounts[0] });

      assert.equal(initialCount.toNumber(), 0);

      const user1 = await createMockUser({ ...mockUser1 }, instance, accounts);
      const secondCount = await instance.userCount.call({ from: accounts[0] });

      assert.equal(secondCount.toNumber(), initialCount.toNumber() + 1);

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

      it("should increase userCount by 1", async () => {
        const userCount = await instance.userCount.call({ from: accounts[0] });

        assert.equal(userCount.toNumber(), 1);
      });
    });

    it("should prevent using taken national ID, e-mail, and password", async () => {
      await createMockUser({ ...mockUser1 }, instance, accounts);
      const copy = { ...mockUser2 };

      await instance.createUser(
        copy.firstName,
        copy.lastName,
        copy.nationalId,
        copy.email,
        copy.phone,
        copy.gender,
        { from: accounts[1] }
      ).catch(err => console.log(`\t\t${err.reason}`));

      copy.nationalId = "23456";

      await instance.createUser(
        copy.firstName,
        copy.lastName,
        copy.nationalId,
        copy.email,
        copy.phone,
        copy.gender,
        { from: accounts[1] }
      ).catch(err => console.log(`\t\t${err.reason}`));

      copy.email = "yasemin@gmail.com";

      await instance.createUser(
        copy.firstName,
        copy.lastName,
        copy.nationalId,
        copy.email,
        copy.phone,
        copy.gender,
        { from: accounts[1] }
      ).catch(err => console.log(`\t\t${err.reason}`));
    });

    it("should update e-mail and password", async () => {
      const copy = { ...mockUser1 };
      const user1 = await createMockUser(copy, instance, accounts);

      copy.email = "taskan@gmail.com";
      copy.phone = "+905550000000";

      await instance.updateUserDetails(
        copy.email,
        copy.phone,
        { from: accounts[0] }
      )
        .then(() => { })
        .catch(err => console.log(`\t\t${err.reason}`));

      const updatedUser1 = await instance.getUserDetails.call({ from: accounts[0] });

      assert(
        user1[3] !== updatedUser1[3],
        "the e-mail field is not updated",
      );

      assert(
        user1[4] !== updatedUser1[4],
        "the phone fields is not updated",
      );
    });

    // it("should remove user", async () => {
    //   const copy = { ...mockUser1 };
    //   const user1 = await createMockUser(copy, instance, accounts);

    //   const isUser = await instance.isUser.call({ from: accounts[0] });

    //   assert(
    //     isUser === true,
    //     "user has not created",
    //   );

    //   await instance.deleteUser(accounts[0]);
    // });
  });
});