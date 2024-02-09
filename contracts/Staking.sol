// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./interface/IStaking.sol";

contract Staking is AccessControlEnumerable, IStaking {
    bytes32 public constant STAKING_ADMIN_ROLE = keccak256("STAKING_ADMIN_ROLE");
    bytes32 public constant ESCAPE_HATCH_ROLE = keccak256("ESCAPE_HATCH_ROLE");
    bytes32 public constant WHITELISTED_ROLE = keccak256("WHITELISTED_ROLE");
    bytes32 public constant TRANSPARENT_FORWARDER_ROLE = keccak256("TRANSPARENT_FORWARDER_ROLE");

    bool public isWhitelistEnabled;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function enableWhitelist() external onlyRole(STAKING_ADMIN_ROLE) {
        isWhitelistEnabled = true;
    }

    function disableWhitelist() external onlyRole(STAKING_ADMIN_ROLE) {
        isWhitelistEnabled = false;
    }

    function isWhitelisted(address caller) external payable onlyRole(TRANSPARENT_FORWARDER_ROLE) returns (bool) {
        return isWhitelistEnabled ? hasRole(WHITELISTED_ROLE, caller) : true;
    }

    function withdraw() external onlyRole(ESCAPE_HATCH_ROLE) {
        uint256 amount = address(this).balance;
        // since the address is required to have the ESCAPE_HATCH_ROLE to call the function,
        // it is trusted and not an arbitrary address 
        // slither-disable-next-line arbitrary-send-eth
        payable(msg.sender).transfer(amount);
    }
}
