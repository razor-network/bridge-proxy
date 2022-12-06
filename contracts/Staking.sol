// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract Staking is AccessControlEnumerable {
    address public transparentForwarder;
    bool public isWhitelistEnabled;
    mapping(address => bool) public permissionList;

    event PermissionSet(address sender);
    event PermissionRemoved(address sender);

    constructor(address _transparentForwarder) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        transparentForwarder = _transparentForwarder;
    }

    function setPermission(address sender)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        permissionList[sender] = true;
        emit PermissionSet(sender);
    }

    function removePermission(address sender)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        permissionList[sender] = false;
        emit PermissionRemoved(sender);
    }

    function enableWhitelist() external onlyRole(DEFAULT_ADMIN_ROLE) {
        isWhitelistEnabled = true;
    }

    function disableWhitelist() external onlyRole(DEFAULT_ADMIN_ROLE) {
        isWhitelistEnabled = false;
    }

    function isWhitelisted(address caller) external payable returns (bool) {
        require(msg.sender == transparentForwarder, "Staking: Invalid caller");
        return isWhitelistEnabled ? permissionList[caller] : true;
    }
}
