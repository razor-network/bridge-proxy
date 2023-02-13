// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract Staking is AccessControlEnumerable {
    bytes32 public constant STAKING_ADMIN_ROLE =
        keccak256("STAKING_ADMIN_ROLE");
    bytes32 public constant ESCAPE_HATCH_ROLE = keccak256("ESCAPE_HATCH_ROLE");
    bytes32 public constant WHITELISTED_ROLE = keccak256("WHITELISTED_ROLE");
    bytes32 public constant TRANSPARENT_FORWARDER_ROLE =
        keccak256("TRANSPARENT_FORWARDER_ROLE");

    bool public isWhitelistEnabled;

    constructor(address _transparentForwarder) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(TRANSPARENT_FORWARDER_ROLE, _transparentForwarder);
    }

    function setPermission(address sender)
        external
        onlyRole(STAKING_ADMIN_ROLE)
    {
        grantRole(WHITELISTED_ROLE, sender);
    }

    function removePermission(address sender)
        external
        onlyRole(STAKING_ADMIN_ROLE)
    {
        revokeRole(WHITELISTED_ROLE, sender);
    }

    function enableWhitelist() external onlyRole(STAKING_ADMIN_ROLE) {
        isWhitelistEnabled = true;
    }

    function disableWhitelist() external onlyRole(STAKING_ADMIN_ROLE) {
        isWhitelistEnabled = false;
    }

    function isWhitelisted(address caller)
        external
        payable
        onlyRole(TRANSPARENT_FORWARDER_ROLE)
        returns (bool)
    {
        return isWhitelistEnabled ? hasRole(WHITELISTED_ROLE, caller) : true;
    }

    function withdraw() external onlyRole(ESCAPE_HATCH_ROLE) {
        uint256 amount = address(this).balance;
        payable(msg.sender).transfer(amount);
    }
}
