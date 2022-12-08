const hre = require("hardhat");
const { expect } = require("chai");

const ids = [1, 2, 3, 4, 5];
const result = [12122, 212121, 21212, 212, 21];
const power = [2, 2, 2, 2, 5];

const namesHash = [
  "0x1bbf634c3ad0a99dd58667a617f7773ccb7f37901afa8e9ea1e32212bddb83c9",
  "0x60f80af122a08d5feb55b4bc442814adfa75e095370d49d5657c23adf1efcf23",
  "0xf4f695ea9b25bb19437503d3494e8b744124bfef02c8221e6be4bce31a8ef3c0",
  "0xa6ace279d909674e37f74fbb3052afa3e05bfdf6ce343c254e31a0606a1928f9",
  "0x0f5e947b204a798dd86405ac2f21fed0d109e748bcd057b913eb87b6ffe07c3e",
];

const abiCoder = new hre.ethers.utils.AbiCoder();

const getValues = () => {
  let values = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    values.push({
      power: power[i],
      collectionId: id,
      name: namesHash[i],
      value: result[i],
    });
  }
  return values;
};

const getMessage = (epoch) => {
  const timestampBN = hre.ethers.BigNumber.from("1231231");
  const values = getValues();
  const message = abiCoder.encode(
    [
      "uint32",
      "uint256",
      "tuple[](int8 power, uint16 collectionId, bytes32 name, uint256 value)",
    ],
    [epoch, timestampBN, values]
  );
  return message;
};

const getSignature = async (message, signer) => {
  const messageHash = hre.ethers.utils.arrayify(
    hre.ethers.utils.keccak256(message)
  );

  const signature = await signer.signMessage(messageHash);
  return signature;
};

const getBlock = async (signer, epoch) => {
  const message = getMessage(epoch);
  const signature = await getSignature(message, signer);
  return {
    signature,
    message,
  };
};

describe("Forwarder tests", () => {
  let resultManager;
  let signers;
  let epoch;
  let forwarder;
  let transparentForwarder;
  let client;
  let transparentForwarderAsForwarder;
  let staking;

  before(async () => {
    signers = await hre.ethers.getSigners();

    const ResultManager = await hre.ethers.getContractFactory("ResultManager");
    resultManager = await ResultManager.deploy(signers[0].address);

    const Forwarder = await hre.ethers.getContractFactory("Forwarder");
    forwarder = await Forwarder.deploy(resultManager.address);

    const TransparentForwarder = await hre.ethers.getContractFactory(
      "TransparentForwarder"
    );
    transparentForwarder = await TransparentForwarder.deploy(forwarder.address);

    const Staking = await hre.ethers.getContractFactory("Staking");
    staking = await Staking.deploy(transparentForwarder.address);

    // * Update staking address in transparentForwarder contract
    await transparentForwarder.setStaking(staking.address);

    transparentForwarderAsForwarder = Forwarder.attach(
      transparentForwarder.address
    );

    // * setting transparentForwarder address in forwarder
    await forwarder.setTransparentForwarder(transparentForwarder.address);

    // * set the forwarder address in resultManager
    await resultManager.updateForwarder(forwarder.address);

    // * Deploy client
    const Client = await hre.ethers.getContractFactory("Client");
    client = await Client.deploy(transparentForwarder.address);

    epoch = 1;
  });

  describe("Forwarder tests", async () => {
    it("Deployer should have DEFAULT_ADMIN_ROLE", async () => {
      const admin = signers[0].address;
      const DEFAULT_ADMIN_ROLE = await forwarder.DEFAULT_ADMIN_ROLE();
      const hasAdminRole = await forwarder.hasRole(DEFAULT_ADMIN_ROLE, admin);
      const hasAdminRoleInTF = await transparentForwarder.hasRole(
        DEFAULT_ADMIN_ROLE,
        admin
      );
      expect(hasAdminRole).to.be.true;
      expect(hasAdminRoleInTF).to.be.true;
    });

    it("Only Admin should be able to update result manager address", async () => {
      await expect(
        forwarder.connect(signers[1]).setResultManager(resultManager.address)
      ).to.be.reverted;
    });

    it("Only Admin should be able to update forwarder address in TF", async () => {
      await expect(
        transparentForwarder.connect(signers[1]).setForwarder(forwarder.address)
      ).to.be.reverted;
    });

    it("setting resultManager address for non contract address should revert", async () => {
      await expect(
        forwarder.setResultManager(signers[1].address)
      ).to.be.rejectedWith("Not a contract address");

      await expect(forwarder.setResultManager(resultManager.address)).to.be.not
        .reverted;
    });

    it("getResult call should revert for unassigned collection payload", async () => {
      // * Whitlist client address

      await expect(client.getResult(namesHash[2])).to.be.rejectedWith(
        "Invalid collection name"
      );
    });

    it("Forwarder should return required result", async () => {
      const block = await getBlock(signers[0], epoch);

      await resultManager.setBlock(block);

      const funcSignatureHash = "0xadd4c784";
      const payload = hre.ethers.utils.hexConcat([
        funcSignatureHash,
        namesHash[0],
      ]);

      await forwarder.setCollectionPayload(namesHash[0], payload);

      expect(await client.getResult(namesHash[0])).to.be.not.reverted;
      const clientResult = await client.lastResult();
      const clientPower = await client.lastPower();
      expect(result[0]).to.be.equal(clientResult);
      expect(power[0]).to.be.equal(clientPower);
    });

    it("Account should be able to access if whitelist mode is disabled", async () => {
      await staking.disableWhitelist();
      await expect(client.getResult(namesHash[0])).to.be.not.reverted;
    });

    it("Non whitelisted account should not be able to getResult", async () => {
      await staking.enableWhitelist();
      await expect(
        transparentForwarderAsForwarder.getResult(namesHash[0])
      ).to.be.revertedWith("Not whitelisted");
    });

    it("Caller should be transparent Forwarder contract to getResult", async () => {
      await expect(
        forwarder.connect(signers[1]).getResult(namesHash[0])
      ).to.be.revertedWith("Invalid caller");
    });

    it("staking.isWhitelisted() should be only called my TF", async () => {
      await expect(
        staking.isWhitelisted(signers[0].address)
      ).to.be.revertedWith("Staking: Invalid caller");
    });

    it("Client should be able to transfer ether in getResult", async () => {
      const transferAmount = hre.ethers.utils.parseEther("1");
      await staking.setPermission(client.address);
      await client.getResult(namesHash[0], {
        value: transferAmount,
      });

      const stakingBalance = await hre.ethers.provider.getBalance(
        staking.address
      );

      expect(stakingBalance).to.be.equal(transferAmount);
    });

    it("Admin should be withdraw funds from staking contract", async () => {
      // * Non admin should not be allowed to withdraw
      await expect(staking.connect(signers[1]).withdraw()).to.be.reverted;

      const previousBalance = await hre.ethers.provider.getBalance(
        signers[0].address
      );
      await expect(staking.connect(signers[0]).withdraw()).to.be.not.reverted;
      const currentBalance = await hre.ethers.provider.getBalance(
        signers[0].address
      );

      expect(currentBalance).to.be.greaterThan(previousBalance);
    });
  });
});
