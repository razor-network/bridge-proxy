const { ethers } = require("hardhat");
const { expect } = require("chai");

const clientAddresses = [
  "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
  "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
  "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
  "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
];

describe("Staking tests", () => {
  const tokenName = "Token";
  const tokenSymbol = "TKN";
  const mintAmount = ethers.utils.parseEther("10000000");
  const defaultMinStake = ethers.utils.parseEther("1000000");
  let signers;

  let staking;
  let token;

  before(async () => {
    signers = await hre.ethers.getSigners();

    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy();
    await staking.deployed();
  });

  it("Deployment tests", async () => {

    // * deployer should have default admin role
    const DEFAULT_ADMIN_ROLE = await staking.DEFAULT_ADMIN_ROLE();
    expect(await staking.hasRole(DEFAULT_ADMIN_ROLE, signers[0].address)).to.be
      .true;
  });

  it("Only STAKING_ADMIN_ROLE can enable/disable whitelisting", async () => {
    const STAKING_ADMIN_ROLE = await staking.STAKING_ADMIN_ROLE();

    // * cannot enable/disable whitelisting
    await expect(staking.connect(signers[1]).enableWhitelist()).to.be.reverted;
    await expect(staking.connect(signers[1]).disableWhitelist()).to.be.reverted;

    await staking.grantRole(STAKING_ADMIN_ROLE, signers[1].address);

    await expect(staking.connect(signers[1]).enableWhitelist()).to.be.not
      .reverted;
    expect(await staking.isWhitelistEnabled()).to.be.true;
    await expect(staking.connect(signers[1]).disableWhitelist()).to.be.not
      .reverted;
    expect(await staking.isWhitelistEnabled()).to.be.false;
    await staking.revokeRole(STAKING_ADMIN_ROLE, signers[1].address);
  });

});
