// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

contract Forwarder is AccessControlEnumerableUpgradeable, PausableUpgradeable {
    using AddressUpgradeable for address;

    bool public isWhitelistEnabled;
    address public resultManager;
    mapping(bytes32 => bytes) public collectionPayload;
    mapping(address => bool) public permissionList;

    event PermissionSet(address sender);
    event PermissionRemoved(address sender);

    function initialize(address _resultManager) public initializer {
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
    }

    /// @notice Remove permission of sender
    function removePermission(address sender)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        permissionList[sender] = false;
    }

    function enableWhitelist() external onlyRole(DEFAULT_ADMIN_ROLE) {
        isWhitelistEnabled = true;
    }

    function disableWhitelist() external onlyRole(DEFAULT_ADMIN_ROLE) {
        isWhitelistEnabled = false;
    }

    /// @notice get result by collection name
    function getResult(bytes32 collectionName)
        external
        view
        whenNotPaused
        returns (uint256, int8)
    {
        require(
            isWhitelistEnabled ? permissionList[msg.sender] : true,
            "Missing permission"
        );
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
