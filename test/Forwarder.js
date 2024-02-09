const hre = require("hardhat");
const { expect } = require("chai");
const { generateTree, getProof } = require("./helpers/tree");

const ids = [1, 2, 3, 4, 5];
let result = [12122, 212121, 21212, 212, 21];
const power = [2, 2, 2, 2, 5];
let timestamp = [1620000000, 1620000000, 1620000000, 1620000000, 1620000000];

const namesHash = [
  "0x1bbf634c3ad0a99dd58667a617f7773ccb7f37901afa8e9ea1e32212bddb83c9",
  "0x60f80af122a08d5feb55b4bc442814adfa75e095370d49d5657c23adf1efcf23",
  "0xf4f695ea9b25bb19437503d3494e8b744124bfef02c8221e6be4bce31a8ef3c0",
  "0xa6ace279d909674e37f74fbb3052afa3e05bfdf6ce343c254e31a0606a1928f9",
  "0x0f5e947b204a798dd86405ac2f21fed0d109e748bcd057b913eb87b6ffe07c3e",
];

const abiCoder = new hre.ethers.utils.AbiCoder();

const tree = generateTree(power, ids, namesHash, result, timestamp);
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

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
    await expect(ResultManager.deploy(ZERO_ADDRESS)).to.be.reverted
    resultManager = await ResultManager.deploy(signers[0].address);

    const Forwarder = await hre.ethers.getContractFactory("Forwarder");
    await expect(Forwarder.deploy(ZERO_ADDRESS)).to.be.reverted
    forwarder = await Forwarder.deploy(resultManager.address);

    // * Grant FORWARDER_ADMIN_ROLE to admin
    const FORWARDER_ADMIN_ROLE = await forwarder.FORWARDER_ADMIN_ROLE();
    await forwarder.grantRole(FORWARDER_ADMIN_ROLE, signers[0].address);

    const TransparentForwarder = await hre.ethers.getContractFactory(
      "TransparentForwarder"
    );
    await expect(TransparentForwarder.deploy(ZERO_ADDRESS)).to.be.reverted
    transparentForwarder = await TransparentForwarder.deploy(forwarder.address);

    // * Grant TRANSPARENT_FORWARDER_ADMIN_ROLE to admin
    const TRANSPARENT_FORWARDER_ADMIN_ROLE =
      await transparentForwarder.TRANSPARENT_FORWARDER_ADMIN_ROLE();
    await transparentForwarder.grantRole(
      TRANSPARENT_FORWARDER_ADMIN_ROLE,
      signers[0].address
    );

    const Staking = await hre.ethers.getContractFactory("Staking");
    staking = await Staking.deploy();

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
      await expect(
        forwarder.setResultManager(ZERO_ADDRESS)
      ).to.be.reverted;
    });

    it("Only Admin should be able to update forwarder and staking addresss in TF", async () => {
      await expect(
        transparentForwarder.connect(signers[1]).setForwarder(forwarder.address)
      ).to.be.reverted;

      await expect(
        transparentForwarder.connect(signers[1]).setStaking(staking.address)
      ).to.be.reverted;

      await expect(
        transparentForwarder.setForwarder(ZERO_ADDRESS)
      ).to.be.reverted;

      await expect(
        transparentForwarder.setStaking(ZERO_ADDRESS)
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

    it("client should not be able to getResult or validateResult if selectors are not set", async () => {
      await expect(forwarder.setResultManager(resultManager.address)).to.be.not
        .reverted;

        await expect(client.getResult(namesHash[0])).to.be.revertedWithCustomError(
          forwarder,
          "NoSelectorPresent"
        );
      const [proof, resultDecoded, signature] = await getProof(
        tree,
        3,
        signers[0]
      );
      const combinedData = hre.ethers.utils.defaultAbiCoder.encode(
        [
          "bytes32",
          "bytes32[]",
          "tuple(int8, uint16, bytes32, uint256, uint256)",
          "bytes",
        ], // The types in order
        [tree.root, proof, resultDecoded, signature] // The data in the same order
      );
      await expect(client.updateResult(combinedData)).to.be.revertedWithCustomError(
        forwarder,
        "NoSelectorPresent"
      );
      await expect(client.validateResult(combinedData)).to.be.revertedWithCustomError(
        forwarder,
        "NoSelectorPresent"
      );
    });

    it("only FORWARDER_ADMIN_ROLE should be able to update selector setters", async () => {
      const FORWARDER_ADMIN_ROLE = await forwarder.FORWARDER_ADMIN_ROLE();
      await forwarder.revokeRole(FORWARDER_ADMIN_ROLE, signers[0].address);
      await expect(forwarder.setResultGetterSelector("0x98d2a0f3")).to.be
        .reverted;
      await expect(forwarder.setUpdateSelector("0x2d444fd5")).to.be.reverted;
      await expect(forwarder.setValidateSelector("0x41417a9d")).to.be.reverted;

      await forwarder.grantRole(FORWARDER_ADMIN_ROLE, signers[0].address);
      await expect(forwarder.setResultGetterSelector("0xadd4c784")).to.be.not
        .reverted;
      await expect(forwarder.setUpdateSelector("0x2d444fd5")).to.be.not
        .reverted;
      await expect(forwarder.setValidateSelector("0x41417a9d")).to.be.not
        .reverted;
    });

    it("Forwarder should return required result", async () => {
      const FORWARDER_ROLE = await resultManager.FORWARDER_ROLE();
      await resultManager.grantRole(FORWARDER_ROLE, signers[0].address);
      const [proof, resultDecoded, signature] = await getProof(
        tree,
        1,
        signers[0]
      );

      // * update result via directly resultManager
      expect(
        await resultManager.updateResult(
          tree.root,
          proof,
          resultDecoded,
          signature
        )
      ).to.be.not.reverted;

      const Client = await hre.ethers.getContractFactory("Client");
      const forwarderInterface = Client.attach(transparentForwarder.address);
      const result = await forwarderInterface.getResult(resultDecoded[2]);
    });

    it("update result via client", async () => {
      const TRANSPARENT_FORWARDER_ROLE =
        await forwarder.TRANSPARENT_FORWARDER_ROLE();
      await forwarder.grantRole(TRANSPARENT_FORWARDER_ROLE, signers[0].address);
      const [proof, resultDecoded, signature] = await getProof(
        tree,
        3,
        signers[0]
      );
      const combinedData = hre.ethers.utils.defaultAbiCoder.encode(
        [
          "bytes32",
          "bytes32[]",
          "tuple(int8, uint16, bytes32, uint256, uint256)",
          "bytes",
        ], // The types in order
        [tree.root, proof, resultDecoded, signature] // The data in the same order
      );

      expect(await client.updateResult(combinedData)).to.be.not.reverted;
      const lastResult = await client.lastResult();
      const lastPower = await client.lastPower();
      const lastTimestamp = await client.lastTimestamp();

      expect(lastResult).to.be.equal(resultDecoded[3]);
      expect(lastPower).to.be.equal(resultDecoded[0]);
      expect(lastTimestamp).to.be.equal(resultDecoded[4]);

      await client.getResult(namesHash[2])
      expect(await client.lastResult()).to.be.equal(lastResult);
      expect(await client.lastPower()).to.be.equal(lastPower);
      expect(await client.lastTimestamp()).to.be.equal(lastTimestamp);
    });

    it("update result via client should revert for invalid signature", async () => {
      const [proof, resultDecoded, signature] = await getProof(
        tree,
        2,
        signers[1]
      );
      const combinedData = hre.ethers.utils.defaultAbiCoder.encode(
        [
          "bytes32",
          "bytes32[]",
          "tuple(int8, uint16, bytes32, uint256, uint256)",
          "bytes",
        ], // The types in order
        [tree.root, proof, resultDecoded, signature] // The data in the same order
      );

      await expect(client.updateResult(combinedData)).to.be.revertedWithCustomError(
        resultManager,
        "InvalidSignature"
      );
    });

    it("update result via client should revert for invalid merkle proof", async () => {
      const [, resultDecoded_4, signature_4] = await getProof(
        tree,
        4,
        signers[0]
      );
      const [proof_5, , ] = await getProof(
        tree,
        5,
        signers[0]
      );
      const combinedData = hre.ethers.utils.defaultAbiCoder.encode(
        [
          "bytes32",
          "bytes32[]",
          "tuple(int8, uint16, bytes32, uint256, uint256)",
          "bytes",
        ], // The types in order
        [tree.root, proof_5, resultDecoded_4, signature_4] // The data in the same order
      );
      await expect(client.updateResult(combinedData)).to.be.revertedWithCustomError(
        resultManager,
        "InvalidMerkleProof"
      );
    });

    it("validate should return true for valid signature", async () => {
      const [proof, resultDecoded, signature] = await getProof(
        tree,
        1,
        signers[0]
      );

      const combinedData = hre.ethers.utils.defaultAbiCoder.encode(
        [
          "bytes32",
          "bytes32[]",
          "tuple(int8, uint16, bytes32, uint256, uint256)",
          "bytes",
        ], // The types in order
        [tree.root, proof, resultDecoded, signature]
      ); 
      
      await client.validateResult(combinedData)
      expect(
        await client.isResultValid()
      ).to.be.true;
    });

    it("validate should return false for invalid signature", async () => {
      const [proof, resultDecoded, signature] = await getProof(
        tree,
        1,
        signers[1]
      );

      const combinedData = hre.ethers.utils.defaultAbiCoder.encode(
        [
          "bytes32",
          "bytes32[]",
          "tuple(int8, uint16, bytes32, uint256, uint256)",
          "bytes",
        ], // The types in order
        [tree.root, proof, resultDecoded, signature]
      ); 
      
      await client.validateResult(combinedData)
      expect(
        await client.isResultValid()
      ).to.be.false;
    });

    it("validate should return false for invalid merkle proof", async () => {
      const [, resultDecoded_4, signature_4] = await getProof(
        tree,
        4,
        signers[0]
      );
      const [proof_5, , ] = await getProof(
        tree,
        5,
        signers[0]
      );
      const combinedData = hre.ethers.utils.defaultAbiCoder.encode(
        [
          "bytes32",
          "bytes32[]",
          "tuple(int8, uint16, bytes32, uint256, uint256)",
          "bytes",
        ], // The types in order
        [tree.root, proof_5, resultDecoded_4, signature_4]
      ); 
      
      await client.validateResult(combinedData)
      expect(
        await client.isResultValid()
      ).to.be.false;
    });

    it("client should be able to update result if timestamp is greater than previous result", async () => {
      let timestampUpdated = [1620000001, 1620000000, 1620000000, 1620000000, 1620000000];
      let resultUpdated = [12123, 212121, 21212, 212, 21];
      let tree_2 = generateTree(power, ids, namesHash, resultUpdated, timestampUpdated);
      const [updatedProof, updatedResultDecoded, updatedSignature] = await getProof(
        tree_2,
        1,
        signers[0]
      );

      const updatedCombinedData = hre.ethers.utils.defaultAbiCoder.encode(
        [
          "bytes32",
          "bytes32[]",
          "tuple(int8, uint16, bytes32, uint256, uint256)",
          "bytes",
        ], // The types in order
        [tree_2.root, updatedProof, updatedResultDecoded, updatedSignature]
      ); 
  
      await client.getResult(updatedResultDecoded[2]);
      let clientResultBeforeUpdation = await client.lastResult();
      let clientTimestampBeforeUpdation = await client.lastTimestamp();
      
      expect(await client.updateResult(updatedCombinedData)).to.be.not.reverted;
      let clientResultAfterUpdation = await client.lastResult();
      let clientTimestampAfterUpdation = await client.lastTimestamp();

      expect(clientResultBeforeUpdation).to.be.lessThan(clientResultAfterUpdation);
      expect(clientTimestampBeforeUpdation).to.be.lessThan(clientTimestampAfterUpdation);

      const [staleProof, staleResultDecoded, staleSignature] = await getProof(
        tree,
        1,
        signers[0]
      );

      const staleCombinedData = hre.ethers.utils.defaultAbiCoder.encode(
        [
          "bytes32",
          "bytes32[]",
          "tuple(int8, uint16, bytes32, uint256, uint256)",
          "bytes",
        ],
        [tree.root, staleProof, staleResultDecoded, staleSignature]
      );

      expect(await client.updateResult(staleCombinedData)).to.be.not.reverted;
      let clientResultAfterStaleUpdation = await client.lastResult();
      let clientTimestampAfterStaleUpdation = await client.lastTimestamp();

      expect(clientResultAfterUpdation).to.be.equal(clientResultAfterStaleUpdation);
      expect(clientTimestampAfterUpdation).to.be.equal(clientTimestampAfterStaleUpdation);

    });
        

    it("Account should be able to access if whitelist mode is disabled", async () => {
      await staking.disableWhitelist();
      await expect(client.getResult(namesHash[0])).to.be.not.reverted;
    });

    it("Non whitelisted account should not be able to getResult", async () => {
      await staking.enableWhitelist();
      await expect(client.getResult(namesHash[0])).to.be.revertedWith(
        "Not whitelisted"
      );
    });

    it("Caller should have TRANSPARENT_FORWARDER_ROLE role to update, validate or get Result", async () => {
      const [proof, resultDecoded, signature] = await getProof(
        tree,
        1,
        signers[0]
      );

      const combinedData = hre.ethers.utils.defaultAbiCoder.encode(
        [
          "bytes32",
          "bytes32[]",
          "tuple(int8, uint16, bytes32, uint256, uint256)",
          "bytes",
        ], // The types in order
        [tree.root, proof, resultDecoded, signature]
      ); 

      await expect(
        forwarder.connect(signers[1]).validateResult(combinedData)
      ).to.be.reverted
      
      await expect(
        forwarder.connect(signers[1]).updateAndGetResult(combinedData)
      ).to.be.reverted
      
      await expect(
        forwarder.connect(signers[1]).getResult(namesHash[0])
      ).to.be.reverted;
    });

    it("staking.isWhitelisted() should be only called my address with TRANSPARENT_FORWARDER_ROLE", async () => {
      await expect(
        staking.connect(signers[1]).isWhitelisted(signers[0].address)
      ).to.be.reverted;
    });

    it("Client should be able to transfer ether in getResult", async () => {
      const transferAmount = hre.ethers.utils.parseEther("1");
      const WHITELISTED_ROLE = await staking.WHITELISTED_ROLE();
      await staking.grantRole(WHITELISTED_ROLE, client.address);
      const [proof, resultDecoded, signature] = await getProof(
        tree,
        3,
        signers[0]
      );
      const combinedData = hre.ethers.utils.defaultAbiCoder.encode(
        [
          "bytes32",
          "bytes32[]",
          "tuple(int8, uint16, bytes32, uint256, uint256)",
          "bytes",
        ], // The types in order
        [tree.root, proof, resultDecoded, signature] // The data in the same order
      );
      await client.updateResult(combinedData, {
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
      const [proof, resultDecoded, signature] = await getProof(
        tree,
        1,
        signers[0]
      );

      const combinedData = hre.ethers.utils.defaultAbiCoder.encode(
        [
          "bytes32",
          "bytes32[]",
          "tuple(int8, uint16, bytes32, uint256, uint256)",
          "bytes",
        ], // The types in order
        [tree.root, proof, resultDecoded, signature]
      ); 

      await expect(client.getResult(namesHash[0])).to.be.revertedWith(
        "Pausable: paused"
      );

      await expect(client.validateResult(combinedData)).to.be.revertedWith(
        "Pausable: paused"
      );

      await expect(client.updateResult(namesHash[0])).to.be.revertedWith(
        "Pausable: paused"
      );

      // * unpause and fetch result from client
      await forwarder.connect(signers[0]).unpause();
      await expect(client.getResult(namesHash[0])).to.be.not.reverted;
    });

    it("client should revert if the result is zero", async () => {
      await expect(
        client.getResult(namesHash[4])
      ).to.be.revertedWithCustomError(
        resultManager,
        "ZeroResult"
        );
    });
  });
});
