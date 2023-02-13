// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Forwarder is AccessControlEnumerable, Pausable {
    using Address for address;

    bytes32 public constant FORWARDER_ADMIN_ROLE =
        keccak256("FORWARDER_ADMIN_ROLE");
    bytes32 public constant TRANSPARENT_FORWARDER_ROLE =
        keccak256("TRANSPARENT_FORWARDER_ROLE");
    bytes32 public constant PAUSE_ROLE = keccak256("PAUSE_ROLE");

    address public resultManager;
    mapping(bytes32 => bytes) public collectionPayload;

    event PermissionSet(address sender);
    event PermissionRemoved(address sender);

    constructor(address _resultManager) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(FORWARDER_ADMIN_ROLE, msg.sender);
        _setupRole(TRANSPARENT_FORWARDER_ROLE, msg.sender);
        resultManager = _resultManager;
    }

    /// @notice Set result manager contract address
    /// @dev Allows admin to update result manager
    /// @param _resultManager new result manager address
    function setResultManager(address _resultManager)
        external
        onlyRole(FORWARDER_ADMIN_ROLE)
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
    ) external onlyRole(FORWARDER_ADMIN_ROLE) {
        collectionPayload[_collectionName] = _payload;
    }

    function pause() external onlyRole(PAUSE_ROLE) {
        Pausable._pause();
    }

    function unpause() external onlyRole(PAUSE_ROLE) {
        Pausable._unpause();
    }

    /// @notice get result by collection name
    function getResult(bytes32 collectionName)
        external
        view
        whenNotPaused
        onlyRole(TRANSPARENT_FORWARDER_ROLE)
        returns (uint256, int8)
    {
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
