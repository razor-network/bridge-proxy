// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract Staking is AccessControlEnumerable {
    bytes32 public constant STAKING_ADMIN_ROLE =
        keccak256("STAKING_ADMIN_ROLE");
    bytes32 public constant ESCAPE_HATCH_ROLE = keccak256("ESCAPE_HATCH_ROLE");
    bytes32 public constant WHITELISTED_ROLE = keccak256("WHITELISTED_ROLE");

    address public transparentForwarder;
    bool public isWhitelistEnabled;
    mapping(address => bool) public permissionList;

    event PermissionSet(address sender);
    event PermissionRemoved(address sender);

    constructor(address _transparentForwarder) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(STAKING_ADMIN_ROLE, msg.sender);
        _setupRole(ESCAPE_HATCH_ROLE, msg.sender);
        transparentForwarder = _transparentForwarder;
    }

    function setPermission(address sender)
        external
        onlyRole(STAKING_ADMIN_ROLE)
    {
        grantRole(WHITELISTED_ROLE, sender);
        emit PermissionSet(sender);
    }

    function removePermission(address sender)
        external
        onlyRole(STAKING_ADMIN_ROLE)
    {
        revokeRole(WHITELISTED_ROLE, sender);
        emit PermissionRemoved(sender);
    }

    function enableWhitelist() external onlyRole(STAKING_ADMIN_ROLE) {
        isWhitelistEnabled = true;
    }

    function disableWhitelist() external onlyRole(STAKING_ADMIN_ROLE) {
        isWhitelistEnabled = false;
    }

    function isWhitelisted(address caller) external payable returns (bool) {
        require(msg.sender == transparentForwarder, "Staking: Invalid caller");
        return isWhitelistEnabled ? hasRole(WHITELISTED_ROLE, caller) : true;
    }

    function withdraw() external onlyRole(ESCAPE_HATCH_ROLE) {
        uint256 amount = address(this).balance;
        payable(msg.sender).transfer(amount);
    }
}
