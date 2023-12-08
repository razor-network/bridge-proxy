// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Forwarder is AccessControlEnumerable, Pausable {
    using Address for address;

    struct Value {
        int8 power;
        uint16 collectionId;
        bytes32 name;
        uint256 value;
        uint256 timestamp;
    }

    bytes32 public constant FORWARDER_ADMIN_ROLE =
        keccak256("FORWARDER_ADMIN_ROLE");
    bytes32 public constant TRANSPARENT_FORWARDER_ROLE =
        keccak256("TRANSPARENT_FORWARDER_ROLE");
    bytes32 public constant PAUSE_ROLE = keccak256("PAUSE_ROLE");

    address public resultManager;
    bytes4 public resultGetterSelector;
    bytes4 public updateSelector;
    bytes4 public validateSelector;

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
        external
        onlyRole(FORWARDER_ADMIN_ROLE)
    {
        require(_resultManager.isContract(), "Not a contract address");
        resultManager = _resultManager;
    }

    /// @notice Set resultGetter Selector
    /// @dev Allows admin to set resultGetter Selector
    /// @param _resultGetterSelector resultGetter Selector
    function setResultGetterSelector(
        bytes4 _resultGetterSelector
    ) external onlyRole(FORWARDER_ADMIN_ROLE) {
        resultGetterSelector = _resultGetterSelector;
    }

    /// @notice Set update selector
    /// @dev Allows admin to set update selector
    /// @param _updateSelector update selector
    function setUpdateSelector(bytes4 _updateSelector)
        external
        onlyRole(FORWARDER_ADMIN_ROLE)
    {
        updateSelector = _updateSelector;
    }

    /// @notice Set validate selector
    /// @dev Allows admin to set validate selector
    /// @param _validateSelector validate selector
    function setValidateSelector(bytes4 _validateSelector)
        external
        onlyRole(FORWARDER_ADMIN_ROLE)
    {
        validateSelector = _validateSelector;
    }

    function pause() external onlyRole(PAUSE_ROLE) {
        Pausable._pause();
    }

    function unpause() external onlyRole(PAUSE_ROLE) {
        Pausable._unpause();
    }

    function getResult(bytes memory data)
        external
        whenNotPaused
        onlyRole(TRANSPARENT_FORWARDER_ROLE)
        returns (uint256, int8, uint256)
    {
        require(
            resultGetterSelector != bytes4(0),
            "No result getter selector"
        );
        if (data.length == 32) {
            require(
                resultGetterSelector != bytes4(0),
                "No result getter selector"
            );
            bytes memory returnData = resultManager.functionStaticCall(
                abi.encodePacked(
                    resultGetterSelector,
                    data
                )
            );
            return abi.decode(returnData, (uint256, int8, uint256));
        }
        else {
            require(
                updateSelector != bytes4(0),
                "No update selector"
            );
            bytes memory returnData = resultManager.functionCall(
                abi.encodePacked(
                    updateSelector,
                    data
                )
            );
            return abi.decode(returnData, (uint256, int8, uint256));
        }
    }

    function validateResult(bytes memory data)
        external
        view
        whenNotPaused
        onlyRole(TRANSPARENT_FORWARDER_ROLE)
        returns (bool)
    {
        require(
            validateSelector != bytes4(0),
            "No validate selector"
        );
        bytes memory returnData = resultManager.functionCall(
            abi.encodePacked(validateSelector, data)
        );   
        return abi.decode(returnData, (bool));
    }
}
