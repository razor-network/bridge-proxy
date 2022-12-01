// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Forwarder is AccessControlEnumerable, Pausable {
    using Address for address;

    bool public isWhitelistEnabled;
    address public resultManager;
    address public transparentForwarder;
    mapping(bytes32 => bytes) public collectionPayload;
    mapping(address => bool) public permissionList;

    event PermissionSet(address sender);
    event PermissionRemoved(address sender);

    constructor(address _resultManager) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        resultManager = _resultManager;
        isWhitelistEnabled = true;
    }

    /// @notice Set result manager contract address
    /// @dev Allows admin to update result manager
    /// @param _resultManager new result manager address
    function setResultManager(address _resultManager)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_resultManager.isContract(), "Not a contract address");
        resultManager = _resultManager;
    }

    /// @notice Set collection payload
    /// @dev Allows admin to set collection payload
    /// @param _collectionName keccak256 hash of collection name
    /// @param _payload payload to call
    function setCollectionPayload(
        bytes32 _collectionName,
        bytes memory _payload
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        collectionPayload[_collectionName] = _payload;
    }

    /// @notice Set permission of sender
    function setPermission(address sender)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        permissionList[sender] = true;
        emit PermissionSet(sender);
    }

    /// @notice Remove permission of sender
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

    function updateTransparentForwarder(address _transparentForwarder)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        transparentForwarder = _transparentForwarder;
    }

    function isWhiteListed(address caller) public view returns (bool) {
        return isWhitelistEnabled ? permissionList[caller] : true;
    }

    /// @notice get result by collection name
    function getResult(bytes32 collectionName)
        external
        view
        whenNotPaused
        returns (uint256, int8)
    {
        require(msg.sender == transparentForwarder, "Invalid caller");
        require(
            collectionPayload[collectionName].length > 0,
            "Invalid collection name"
        );
        bytes memory data = resultManager.functionStaticCall(
            collectionPayload[collectionName]
        );
        return abi.decode(data, (uint256, int8));
    }
}
