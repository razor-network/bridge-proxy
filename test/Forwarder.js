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
  const tokenName = "Token";
  const tokenSymbol = "TKN";
  const mintAmount = ethers.utils.parseEther("10000000");
  let resultManager;
  let signers;
  let epoch;
  let forwarder;
  let transparentForwarder;
  let client;
  let transparentForwarderAsForwarder;
  let token;
  let staking;

  before(async () => {
    signers = await hre.ethers.getSigners();

    const ResultManager = await hre.ethers.getContractFactory("ResultManager");
    resultManager = await ResultManager.deploy(signers[0].address);

    const Forwarder = await hre.ethers.getContractFactory("Forwarder");
    forwarder = await Forwarder.deploy(resultManager.address);

    // * Grant FORWARDER_ADMIN_ROLE to admin
    const FORWARDER_ADMIN_ROLE = await forwarder.FORWARDER_ADMIN_ROLE();
    await forwarder.grantRole(FORWARDER_ADMIN_ROLE, signers[0].address);

    const TransparentForwarder = await hre.ethers.getContractFactory(
      "TransparentForwarder"
    );
    transparentForwarder = await TransparentForwarder.deploy(forwarder.address);

    // * Grant TRANSPARENT_FORWARDER_ADMIN_ROLE to admin
    const TRANSPARENT_FORWARDER_ADMIN_ROLE =
      await transparentForwarder.TRANSPARENT_FORWARDER_ADMIN_ROLE();
    await transparentForwarder.grantRole(
      TRANSPARENT_FORWARDER_ADMIN_ROLE,
      signers[0].address
    );

    const Token = await hre.ethers.getContractFactory("Token");
    token = await Token.deploy(tokenName, tokenSymbol, mintAmount);

    const Staking = await hre.ethers.getContractFactory("Staking");
    staking = await Staking.deploy(token.address);

    // * Grant STAKING_ADMIN_ROLE and ESCAPE_HATCH_ROLE to admin
    const STAKING_ADMIN_ROLE = await staking.STAKING_ADMIN_ROLE();
    await staking.grantRole(STAKING_ADMIN_ROLE, signers[0].address);

    const ESCAPE_HATCH_ROLE = await staking.ESCAPE_HATCH_ROLE();
    await staking.grantRole(ESCAPE_HATCH_ROLE, signers[0].address);

    const TRANSPARENT_FORWARDER_ROLE =
      await forwarder.TRANSPARENT_FORWARDER_ROLE();
    await staking.grantRole(
      TRANSPARENT_FORWARDER_ROLE,
      transparentForwarder.address
    );

    // * Update staking address in transparentForwarder contract
    await transparentForwarder.setStaking(staking.address);

    transparentForwarderAsForwarder = Forwarder.attach(
      transparentForwarder.address
    );

    // * setting transparentForwarder address in forwarder
    await forwarder.grantRole(
      TRANSPARENT_FORWARDER_ROLE,
      transparentForwarder.address
    );

    const FORWARDER_ROLE = await resultManager.FORWARDER_ROLE();
    // * set the forwarder address in resultManager
    await resultManager.grantRole(FORWARDER_ROLE, forwarder.address);

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

    it("only admin should be able to grant and revoke required role", async () => {
      const FORWARDER_ADMIN_ROLE = await forwarder.FORWARDER_ADMIN_ROLE();

      expect(
        forwarder
          .connect(signers[1])
          .grantRole(FORWARDER_ADMIN_ROLE, signers[2].address)
      ).to.be.reverted;

      await expect(
        forwarder.grantRole(FORWARDER_ADMIN_ROLE, signers[1].address)
      ).to.be.not.reverted;

      await expect(
        forwarder.revokeRole(FORWARDER_ADMIN_ROLE, signers[1].address)
      ).to.be.not.reverted;
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

    it("Caller should have TRANSPARENT_FORWARDER_ROLE role to getResult", async () => {
      await expect(forwarder.connect(signers[1]).getResult(namesHash[0])).to.be
        .reverted;
    });

    it("staking.isWhitelisted() should be only called my address with TRANSPARENT_FORWARDER_ROLE", async () => {
      await expect(
        staking.connect(signers[1]).isWhitelisted(signers[0].address)
      ).to.be.reverted;
    });

    it("Client should be able to transfer ether in getResult", async () => {
      const transferAmount = hre.ethers.utils.parseEther("1");
      const minStake = await staking.minStake();

      await token.approve(staking.address, minStake);
      await expect(staking.stake(client.address, minStake)).to.be.not.reverted;

      await client.getResult(namesHash[0], {
        value: transferAmount,
      });

      const stakingBalance = await hre.ethers.provider.getBalance(
        staking.address
      );

      expect(stakingBalance).to.be.equal(transferAmount);
    });

    it("Client shouldn't be allowed to getResult if stake is less than minStake", async () => {
      const minStake = await staking.minStake();

      // * unstake
      await expect(staking.unstake(client.address, minStake)).to.be.not
        .reverted;

      await expect(client.getResult(namesHash[0])).to.be.revertedWith(
        "Not whitelisted"
      );
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

    it("Transferring funds accidentally to TF and Staking should revert", async () => {
      await staking.disableWhitelist();
      await expect(
        signers[0].sendTransaction({
          to: transparentForwarder.address,
          value: hre.ethers.utils.parseEther("1.0"),
        })
      ).to.be.reverted;

      await expect(
        signers[0].sendTransaction({
          to: staking.address,
          value: hre.ethers.utils.parseEther("1.0"),
        })
      ).to.be.reverted;
    });

    it("Only accounts having PAUSE_ROLE can pause/unpause forwarder contract", async () => {
      await expect(forwarder.connect(signers[1]).pause()).to.be.reverted;
      await expect(forwarder.connect(signers[1]).unpause()).to.be.reverted;
      const PAUSE_ROLE = await forwarder.PAUSE_ROLE();

      // * grant PAUSE_ROLE
      await forwarder.grantRole(PAUSE_ROLE, signers[0].address);
      await expect(forwarder.connect(signers[0]).pause()).not.to.be.reverted;
      await expect(forwarder.connect(signers[0]).unpause()).not.to.be.reverted;
    });

    it("Client should not be able to fetch result if forwarder contract is paused", async () => {
      await forwarder.connect(signers[0]).pause();
      await expect(client.getResult(namesHash[0])).to.be.revertedWith(
        "Pausable: paused"
      );

      // * unpause and fetch result from client
      await forwarder.connect(signers[0]).unpause();
      await expect(client.getResult(namesHash[0])).to.be.not.reverted;
    });
  });
});
