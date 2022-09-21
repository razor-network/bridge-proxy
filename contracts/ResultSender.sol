// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./interface/IDelegator.sol";
import "./interface/ICollectionManager.sol";
import "./interface/IMAProxy.sol";

contract ResultSender is AccessControlEnumerable {
    uint256 public lastUpdatedTimestamp;

    IDelegator public delegator;
    ICollectionManager public collectionManager;
    IMAProxy public imaProxy;

    bytes32 public constant DISPATCHER_ROLE = keccak256("DISPATCHER_ROLE");

    constructor(
        address _delegatorAddress,
        address _collectionManagerAddress,
        address _imaProxyAddress
    ) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(DISPATCHER_ROLE, msg.sender);
        delegator = IDelegator(_delegatorAddress);
        collectionManager = ICollectionManager(_collectionManagerAddress);
        imaProxy = IMAProxy(_imaProxyAddress);
    }

    /**
     * @dev Allows admin to update delegator address.
     */
    function updateDelegatorAddress(address _delegatorAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        delegator = IDelegator(_delegatorAddress);
    }

    /**
     * @dev Allows admin to update collection manager address.
     */
    function updateCollectionManagerAddress(address _collectionManagerAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        collectionManager = ICollectionManager(_collectionManagerAddress);
    }

    /**
     * @dev Allows admin to update skale IMA proxy address.
     */
    function updateProxyAddress(address _newProxyAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        imaProxy = IMAProxy(_newProxyAddress);
    }

    /**
     * @dev publish collection result via delegator.
     */
    function publishResult(bytes32 _targetChainHash, address _resultHandler)
        public
        onlyRole(DISPATCHER_ROLE)
    {
        uint16[] memory activeCollections = delegator.getActiveCollections();

        uint16[] memory ids = new uint16[](activeCollections.length);
        uint256[] memory results = new uint256[](activeCollections.length);
        int8[] memory power = new int8[](activeCollections.length);
        bytes32[] memory namesHash = new bytes32[](activeCollections.length);

        for (uint256 i = 0; i < activeCollections.length; i++) {
            (uint256 collectionResult, int8 collectionPower) = delegator
                .getResultFromID(activeCollections[i]);
            string memory name = collectionManager
                .getCollection(activeCollections[i])
                .name;
            bytes32 nameHash = keccak256(abi.encodePacked(name));

            ids[i] = activeCollections[i];
            results[i] = collectionResult;
            power[i] = collectionPower;
            namesHash[i] = nameHash;
        }

        lastUpdatedTimestamp = block.timestamp;

        // send encoded data to MessageProxy
        bytes memory data = abi.encode(
            ids,
            results,
            power,
            namesHash,
            block.timestamp
        );
        imaProxy.postOutgoingMessage(_targetChainHash, _resultHandler, data);
    }
}
