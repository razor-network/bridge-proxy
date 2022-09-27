// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./interface/IDelegator.sol";
import "./interface/ICollectionManager.sol";
import "./interface/IMAProxy.sol";

contract ResultSender is AccessControlEnumerable {
    uint256 public lastUpdatedTimestamp;
    uint32 public lastRequestId;

    IDelegator public delegator;
    ICollectionManager public collectionManager;
    IMAProxy public imaProxy;

    bytes32 public constant DISPATCHER_ROLE = keccak256("DISPATCHER_ROLE");
    struct Block {
        uint32 requestId;
        bytes message;
        bytes signature;
    }

    struct Value {
        int8 power;
        uint16 collectionId;
        bytes32 name;
        uint256 value;
    }

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

    function getMessage() public view returns (bytes memory) {
        uint16[] memory activeCollections = delegator.getActiveCollections();
        Value[] memory values = new Value[](activeCollections.length);

        for (uint256 i = 0; i < activeCollections.length; i++) {
            (uint256 value, int8 power) = delegator.getResultFromID(
                activeCollections[i]
            );
            string memory name = collectionManager
                .getCollection(activeCollections[i])
                .name;
            bytes32 nameHash = keccak256(abi.encodePacked(name));

            values[i] = Value(power, activeCollections[i], nameHash, value);
        }

        bytes memory message = abi.encode(values);
        return message;
    }

    /**
     * @dev publish collection result via delegator.
     */
    function publishResult(
        bytes32 _targetChainHash,
        address _resultHandler,
        uint32 _requestId,
        bytes calldata _signature
    ) public onlyRole(DISPATCHER_ROLE) {
        lastRequestId = _requestId;
        lastUpdatedTimestamp = block.timestamp;

        bytes memory message = getMessage();
        Block memory tssBlock = Block(_requestId, message, _signature);
        bytes memory data = abi.encode(tssBlock);

        imaProxy.postOutgoingMessage(_targetChainHash, _resultHandler, data);
    }
}
