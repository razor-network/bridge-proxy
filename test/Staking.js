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

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(tokenName, tokenSymbol, mintAmount);
    await token.deployed();

    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(token.address);
    await staking.deployed();
  });

  it("Deployment tests", async () => {
    const name = await token.name();
    expect(name).to.be.equal(tokenName);

    const symbol = await token.symbol();
    expect(symbol).to.be.equal(symbol);

    // * deployer should have default admin role
    const DEFAULT_ADMIN_ROLE = await staking.DEFAULT_ADMIN_ROLE();
    expect(await staking.hasRole(DEFAULT_ADMIN_ROLE, signers[0].address)).to.be
      .true;

    // * token address should be set correctly
    const tokenAddress = await staking.token();
    expect(tokenAddress).to.be.equal(token.address);
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

  it("Only STAKING_ADMIN_ROLE can update token address", async () => {
    const STAKING_ADMIN_ROLE = await staking.STAKING_ADMIN_ROLE();
    let newTokenAddress = signers[1].address;

    await expect(
      staking.connect(signers[1]).updateTokenAddress(newTokenAddress)
    ).to.be.reverted;

    await staking.grantRole(STAKING_ADMIN_ROLE, signers[1].address);
    await expect(
      staking.connect(signers[1]).updateTokenAddress(newTokenAddress)
    ).to.be.not.reverted;
    expect(await staking.token()).to.be.equal(newTokenAddress);

    // * change to default token address
    await expect(staking.connect(signers[1]).updateTokenAddress(token.address))
      .to.be.not.reverted;

    await staking.revokeRole(STAKING_ADMIN_ROLE, signers[1].address);
  });

  it("Only STAKING_ADMIN_ROLE can update minStake", async () => {
    const STAKING_ADMIN_ROLE = await staking.STAKING_ADMIN_ROLE();
    let newMinStake = ethers.utils.parseEther("100");

    await expect(staking.connect(signers[1]).updateMinStake(newMinStake)).to.be
      .reverted;

    await staking.grantRole(STAKING_ADMIN_ROLE, signers[1].address);
    await expect(staking.connect(signers[1]).updateMinStake(newMinStake)).to.be
      .not.reverted;
    expect(await staking.minStake()).to.be.equal(newMinStake);

    // * back to defaultMinStake
    await expect(staking.connect(signers[1]).updateMinStake(defaultMinStake)).to
      .be.not.reverted;

    await staking.revokeRole(STAKING_ADMIN_ROLE, signers[1].address);
  });

  it("Stake tests", async () => {
    await token.approve(staking.address, defaultMinStake);
    await expect(staking.stake(clientAddresses[0], defaultMinStake)).to.be.not
      .reverted;

    // * verify staker stake
    const stakerStake = await staking.stakersStakePerClient(
      signers[0].address,
      clientAddresses[0]
    );
    expect(stakerStake).to.be.equal(defaultMinStake);
    // expect(await stakerStake.client).to.be.equal(signers[0].address);

    // * verify clientStake
    expect(await staking.clientStake(clientAddresses[0])).to.be.equal(
      defaultMinStake
    );

    // * verify token balance
    expect(await token.balanceOf(staking.address)).to.be.equal(defaultMinStake);

    await token.approve(staking.address, ethers.utils.parseEther("1"));

    // * staker can stake for same client multiple times
    await expect(
      staking.stake(clientAddresses[0], ethers.utils.parseEther("1"))
    ).to.be.not.reverted;
  });

  it("Unstake tests", async () => {
    // * amount should be greater than 0
    await expect(staking.unstake(signers[0].address, 0)).to.be.revertedWith(
      "amount must be > 0"
    );

    // * cannot unstake more than staked amount
    let stakedAmount = await staking.stakersStakePerClient(
      signers[0].address,
      clientAddresses[0]
    );
    await expect(
      staking.unstake(
        clientAddresses[0],
        stakedAmount.add(ethers.utils.parseEther("1"))
      )
    ).to.be.revertedWith("amount must be <= staked amount");

    const tokenBalanceBeforeUnstake = await token.balanceOf(signers[0].address);

    // * UNSTAKE
    const clientStakeBeforeUnstake = await staking.clientStake(
      clientAddresses[0]
    );
    await expect(staking.unstake(clientAddresses[0], stakedAmount)).to.be.not
      .reverted;

    // * verify staker token balance
    const tokenBalanceAfterUnstake = await token.balanceOf(signers[0].address);
    expect(tokenBalanceAfterUnstake).to.be.equal(
      tokenBalanceBeforeUnstake.add(stakedAmount)
    );

    const clientStakeAfterUnstake = await staking.clientStake(
      clientAddresses[0]
    );
    expect(clientStakeAfterUnstake).to.be.equal(
      clientStakeBeforeUnstake.sub(stakedAmount)
    );

    // * verify staker stake
    stakedAmount = await staking.stakersStakePerClient(
      signers[0].address,
      clientAddresses[0]
    );
    expect(stakedAmount).to.be.equal(0);
  });

  it("Verify client address is push/pop from stakersClients", async () => {
    let signer1Clients = await staking.getStakersClient(signers[1].address);

    // * if the staker has no clients
    expect(signer1Clients).to.be.an("array").that.is.empty;

    // * as soon as staker stakes to client for the first time, client address is pushed to stakersClients
    await token.transfer(signers[1].address, defaultMinStake);
    await token.transfer(signers[1].address, defaultMinStake);

    await token.connect(signers[1]).approve(staking.address, defaultMinStake);
    await expect(
      staking.connect(signers[1]).stake(clientAddresses[0], defaultMinStake)
    ).to.be.not.reverted;
    signer1Clients = await staking.getStakersClient(signers[1].address);

    expect(signer1Clients).to.be.deep.equal([clientAddresses[0]]);

    // * if staker stakes to same client again, client address is not pushed to stakersClients
    await token.connect(signers[1]).approve(staking.address, defaultMinStake);
    await expect(
      staking.connect(signers[1]).stake(clientAddresses[0], defaultMinStake)
    ).to.be.not.reverted;
    signer1Clients = await staking.getStakersClient(signers[1].address);

    expect(signer1Clients).to.be.deep.equal([clientAddresses[0]]);

    // * during partial unstake, client address is not popped from stakersClients
    let stakedAmount = await staking.stakersStakePerClient(
      signers[1].address,
      clientAddresses[0]
    );
    await expect(
      staking
        .connect(signers[1])
        .unstake(clientAddresses[0], stakedAmount.sub(defaultMinStake))
    ).to.be.not.reverted;

    signer1Clients = await staking.getStakersClient(signers[1].address);
    expect(signer1Clients).to.be.deep.equal([clientAddresses[0]]);

    // * during full unstake, client address is popped from stakersClients
    stakedAmount = await staking.stakersStakePerClient(
      signers[1].address,
      clientAddresses[0]
    );
    await expect(
      staking.connect(signers[1]).unstake(clientAddresses[0], stakedAmount)
    ).to.be.not.reverted;

    signer1Clients = await staking.getStakersClient(signers[1].address);
    expect(signer1Clients).to.be.an("array").that.is.empty;

    // * try staking to same client again
    await token.connect(signers[1]).approve(staking.address, defaultMinStake);
    await expect(
      staking.connect(signers[1]).stake(clientAddresses[0], defaultMinStake)
    ).to.be.not.reverted;
    signer1Clients = await staking.getStakersClient(signers[1].address);

    expect(signer1Clients).to.be.deep.equal([clientAddresses[0]]);
  });
});
