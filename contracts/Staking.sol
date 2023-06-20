// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking is AccessControlEnumerable {
    struct Stake {
        uint256 amount;
        address client;
    }
    bytes32 public constant STAKING_ADMIN_ROLE =
        keccak256("STAKING_ADMIN_ROLE");
    bytes32 public constant ESCAPE_HATCH_ROLE = keccak256("ESCAPE_HATCH_ROLE");
    bytes32 public constant TRANSPARENT_FORWARDER_ROLE =
        keccak256("TRANSPARENT_FORWARDER_ROLE");

    IERC20 public token;
    bool public isWhitelistEnabled;
    uint256 public minStake = 1_000_000 * (10 ** 18);

    mapping(address => Stake) public stakers;
    mapping(address => uint256) public clientStake;

    event Staked(
        address indexed staker,
        address indexed client,
        uint256 newStakerStake,
        uint256 newClientStake
    );
    event Unstaked(
        address indexed staker,
        address indexed client,
        uint256 newStakerStake,
        uint256 newClientStake
    );

    constructor(address _tokenAddress) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        token = IERC20(_tokenAddress);
    }

    function updateTokenAddress(
        address _tokenAddress
    ) external onlyRole(STAKING_ADMIN_ROLE) {
        token = IERC20(_tokenAddress);
    }

    function updateMinStake(
        uint256 amount
    ) external onlyRole(STAKING_ADMIN_ROLE) {
        minStake = amount;
    }

    function enableWhitelist() external onlyRole(STAKING_ADMIN_ROLE) {
        isWhitelistEnabled = true;
    }

    function disableWhitelist() external onlyRole(STAKING_ADMIN_ROLE) {
        isWhitelistEnabled = false;
    }

    function isWhitelisted(
        address caller
    ) external payable onlyRole(TRANSPARENT_FORWARDER_ROLE) returns (bool) {
        return isWhitelistEnabled ? clientStake[caller] >= minStake : true;
    }

    function withdraw() external onlyRole(ESCAPE_HATCH_ROLE) {
        uint256 amount = address(this).balance;
        payable(msg.sender).transfer(amount);
    }

    function stake(address client, uint256 amount) public {
        require(
            stakers[msg.sender].client == address(0) ||
                stakers[msg.sender].client == client,
            "staked for another client"
        );

        stakers[msg.sender].client = client;
        stakers[msg.sender].amount += amount;
        clientStake[client] += amount;

        require(
            token.transferFrom(msg.sender, address(this), amount),
            "token transfer failed"
        );
        emit Staked(
            msg.sender,
            client,
            stakers[msg.sender].amount,
            clientStake[client]
        );
    }

    function unstake(uint256 amount) public {
        require(amount > 0, "amount must be > 0");
        require(
            stakers[msg.sender].amount >= amount,
            "amount must be <= staked amount"
        );

        address client = stakers[msg.sender].client;
        stakers[msg.sender].amount -= amount;
        clientStake[client] -= amount;

        require(token.transfer(msg.sender, amount), "token transfer failed");
        emit Unstaked(
            msg.sender,
            client,
            stakers[msg.sender].amount,
            clientStake[client]
        );
    }
}
