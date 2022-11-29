// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

contract ForwarderV2 is
    AccessControlEnumerableUpgradeable,
    PausableUpgradeable
{
    using AddressUpgradeable for address;

    bool public isWhitelistEnabled;
    address public resultManager;
    mapping(bytes32 => bytes) public collectionPayload;
    mapping(address => bool) public permissionList;
    IERC20Upgradeable public token;
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public count;

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

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        PausableUpgradeable._pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        PausableUpgradeable._unpause();
    }

    function updateToken(address _token) public onlyRole(DEFAULT_ADMIN_ROLE) {
        token = IERC20Upgradeable(_token);
    }

    function stake(uint256 amount) public {
        require(token.transferFrom(msg.sender, address(this), amount));
        balanceOf[msg.sender] += amount;
    }

    /// @notice get result by collection name
    function getResult(bytes32 collectionName)
        external
        whenNotPaused
        returns (uint256, int8)
    {
        require(
            isWhitelistEnabled ? permissionList[msg.sender] : true,
            "Missing permission"
        );
        require(balanceOf[msg.sender] > 0, "Stake should be greater than 0");
        require(
            collectionPayload[collectionName].length > 0,
            "Invalid collection name"
        );
        count[msg.sender]++;
        bytes memory data = resultManager.functionStaticCall(
            collectionPayload[collectionName]
        );
        return abi.decode(data, (uint256, int8));
    }
}
