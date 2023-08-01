// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Staking is AccessControlEnumerable, Pausable {
    bytes32 public constant STAKING_ADMIN_ROLE =
        keccak256("STAKING_ADMIN_ROLE");
    bytes32 public constant ESCAPE_HATCH_ROLE = keccak256("ESCAPE_HATCH_ROLE");
    bytes32 public constant TRANSPARENT_FORWARDER_ROLE =
        keccak256("TRANSPARENT_FORWARDER_ROLE");
    bytes32 public constant PAUSE_ROLE = keccak256("PAUSE_ROLE");

    IERC20 public token;
    bool public isWhitelistEnabled;
    uint256 public minStake = 1_000_000 * (10 ** 18);

    mapping(address => mapping(address => uint256))
        public stakersStakePerClient; // staker stake per client
    mapping(address => address[]) public stakersClients; // clients that staker has staked
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

    function pause() external onlyRole(PAUSE_ROLE) {
        Pausable._pause();
    }

    function unpause() external onlyRole(PAUSE_ROLE) {
        Pausable._unpause();
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

    function withdrawTokens() external onlyRole(ESCAPE_HATCH_ROLE) {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(msg.sender, balance);
    }

    function stake(address client, uint256 amount) external whenNotPaused {
        require(amount > 0, "amount should be greater than 0");
        if (stakersStakePerClient[msg.sender][client] == 0) {
            stakersClients[msg.sender].push(client);
        }

        stakersStakePerClient[msg.sender][client] += amount;
        clientStake[client] += amount;

        require(
            token.transferFrom(msg.sender, address(this), amount),
            "token transfer failed"
        );
        emit Staked(
            msg.sender,
            client,
            stakersStakePerClient[msg.sender][client],
            clientStake[client]
        );
    }

    function unstake(
        address client,
        uint256 amount,
        uint256 index
    ) external whenNotPaused {
        require(amount > 0, "amount must be > 0");
        require(
            stakersStakePerClient[msg.sender][client] >= amount,
            "amount must be <= staked amount"
        );

        stakersStakePerClient[msg.sender][client] -= amount;
        clientStake[client] -= amount;

        // * remove the client address from stakersClients if amount staked == 0
        if (stakersStakePerClient[msg.sender][client] == 0) {
            uint length = stakersClients[msg.sender].length;
            require(
                index < length && stakersClients[msg.sender][index] == client,
                "incorrect index"
            );

            stakersClients[msg.sender][index] = stakersClients[msg.sender][
                length - 1
            ];
            stakersClients[msg.sender].pop();
        }

        require(token.transfer(msg.sender, amount), "token transfer failed");
        emit Unstaked(
            msg.sender,
            client,
            stakersStakePerClient[msg.sender][client],
            clientStake[client]
        );
    }

    function getStakerClients(
        address staker
    ) public view returns (address[] memory) {
        return stakersClients[staker];
    }
}
