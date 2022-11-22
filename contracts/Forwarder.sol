// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract Forwarder is AccessControlEnumerable {
    using Address for address;

    address public resultManager;
    mapping(bytes32 => bytes) public collectionPayload;
    // * NOTE: Here the mapping can be changed to (address => address) if there are chances of multiple result manager.
    mapping(address => bool) public permissionList;

    event PermissionSet(address sender);
    event PermissionRemoved(address sender);

    constructor(address _resultManager) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        resultManager = _resultManager;
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

    /// @notice get result by collection name
    function getResult(bytes32 collectionName)
        external
        view
        returns (uint256, int8)
    {
        require(permissionList[msg.sender], "Missing permission");
        require(
            collectionPayload[collectionName].length > 0,
            "Invalid collection name"
        );
        bytes memory data = resultManager.functionStaticCall(
            collectionPayload[collectionName]
        );
        return abi.decode(data, (uint256, int8));
    }

    /// @notice Utility function to construct payload
    function getPayload(string memory functionSig, bytes32 collectionName)
        public
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSignature(functionSig, collectionName);
    }
}
