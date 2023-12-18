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
    bytes4 public resultGetterSelector;
    bytes4 public updateSelector;
    bytes4 public validateSelector;

    event PermissionSet(address sender);
    event PermissionRemoved(address sender);

    error NoSelectorPresent();

    modifier checkSelector(bytes4 selector) {
        if(selector == bytes4(0)) revert NoSelectorPresent();
        _;
    }

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

    /// @notice pause the contract
    function pause() external onlyRole(PAUSE_ROLE) {
        Pausable._pause();
    }

    /// @notice unpause the contract
    function unpause() external onlyRole(PAUSE_ROLE) {
        Pausable._unpause();
    }

    /**
     * @notice Updates the result based on the provided data and returns the latest result
     * @param data bytes data required to update the result
     * @return result of the collection, its power and timestamp
     */
    function fetchResult(bytes calldata data)
        external
        whenNotPaused
        checkSelector(updateSelector)
        onlyRole(TRANSPARENT_FORWARDER_ROLE)
        returns (uint256, int8, uint256)
    {
        bytes memory returnData = resultManager.functionCall(
            abi.encodePacked(
                updateSelector,
                data
            )
        );
        return abi.decode(returnData, (uint256, int8, uint256));
    }

    /**
     * @dev using the hash of collection name, clients can query the result of that collection
     * @param name bytes32 hash of the collection name
     * @return result of the collection and its power
     */
    function getResult(bytes32 name)
        external
        view
        whenNotPaused
        checkSelector(resultGetterSelector)
        onlyRole(TRANSPARENT_FORWARDER_ROLE)
        returns (uint256, int8, uint256)
    {
        bytes memory returnData = resultManager.functionStaticCall(
            abi.encodePacked(
                resultGetterSelector,
                name
            )
        );
        return abi.decode(returnData, (uint256, int8, uint256));
    }

    /**
     * @dev validates the result based on the provided data and returns the validity
     * @param data bytes data required to validate the result
     * @return validity of the result
     */
    function validateResult(bytes calldata data)
        external
        view
        whenNotPaused
        checkSelector(validateSelector)
        onlyRole(TRANSPARENT_FORWARDER_ROLE)
        returns (bool)
    {
        bytes memory returnData = resultManager.functionStaticCall(
            abi.encodePacked(validateSelector, data)
        );   
        return abi.decode(returnData, (bool));
    }
}
