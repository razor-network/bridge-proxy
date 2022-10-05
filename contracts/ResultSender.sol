// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./interface/IDelegator.sol";
import "./interface/ICollectionManager.sol";
import "./interface/IMAProxy.sol";

contract ResultSender is AccessControlEnumerable {
    address public signerAddress;

    IDelegator public delegator;
    ICollectionManager public collectionManager;
    IMAProxy public imaProxy;

    struct Block {
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
        address _imaProxyAddress,
        address _signerAddress
    ) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        delegator = IDelegator(_delegatorAddress);
        collectionManager = ICollectionManager(_collectionManagerAddress);
        imaProxy = IMAProxy(_imaProxyAddress);
        signerAddress = _signerAddress;
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
     * @dev Allows admin to update signer address.
     */
    function updateSignerAddress(address _newSignerAddress) public {
        require(
            msg.sender == signerAddress ||
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Invalid Caller"
        );
        signerAddress = _newSignerAddress;
    }

    /**
     * @dev Used by daemon/signer to generate message
     */
    function getMessage(
        uint256 _epoch,
        uint32 _requestId,
        uint256 _timestamp
    ) public view returns (bytes memory) {
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

        bytes memory message = abi.encode(
            _epoch,
            _requestId,
            _timestamp,
            values
        );
        return message;
    }

    /**
     * @dev Used by daemon/signer to generate block from message and signature
     */
    function getBlock(bytes calldata message, bytes calldata signature)
        public
        pure
        returns (Block memory)
    {
        return Block(message, signature);
    }

    /**
     * @dev verify the signature and post message through IMA
     */
    function publishResult(
        bytes32 _targetChainHash,
        address _resultHandler,
        Block calldata messageBlock
    ) public {
        bytes32 messageHash = keccak256(messageBlock.message);
        require(
            ECDSA.recover(messageHash, messageBlock.signature) == signerAddress,
            "invalid signature"
        );
        bytes memory data = abi.encode(messageBlock);
        imaProxy.postOutgoingMessage(_targetChainHash, _resultHandler, data);
    }
}
