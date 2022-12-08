// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ResultManager is AccessControlEnumerable {
    struct Block {
        bytes message; // epoch, timestamp, Value[]
        bytes signature;
    }

    struct Value {
        int8 power;
        uint16 collectionId;
        bytes32 name;
        uint256 value;
    }

    address public signerAddress;
    address public forwarder;
    uint256 public lastUpdatedTimestamp;
    uint16[] public activeCollectionIds;
    uint32 public latestEpoch;

    // epoch => Block
    mapping(uint32 => Block) public blocks;

    /// @notice mapping for name of collection in bytes32 -> collectionid
    mapping(bytes32 => uint16) public collectionIds;

    /// @notice mapping for CollectionID -> Value Info
    mapping(uint16 => Value) public collectionResults;

    event BlockReceived(uint32 epoch, uint256 timestamp, Value[] values);

    constructor(address _signerAddress) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        signerAddress = _signerAddress;
    }

    function updateForwarder(address _forwarder)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        forwarder = _forwarder;
    }

    function updateSignerAddress(address _signerAddress)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        signerAddress = _signerAddress;
    }

    /**
     * @dev Verify the signature and update the results
     * Requirements:
     *
     * - ecrecover(signature) should match with signerAddress
     */
    function setBlock(Block memory messageBlock) external {
        (uint32 epoch, uint256 timestamp, Value[] memory values) = abi.decode(
            messageBlock.message,
            (uint32, uint256, Value[])
        );
        require(
            !(blocks[epoch].signature.length > 0),
            "Block already set for the epoch"
        );

        bytes32 messageHash = keccak256(messageBlock.message);
        require(
            ECDSA.recover(
                ECDSA.toEthSignedMessageHash(messageHash),
                messageBlock.signature
            ) == signerAddress,
            "invalid signature"
        );

        uint16[] memory ids = new uint16[](values.length);
        blocks[epoch] = messageBlock;
        for (uint256 i; i < values.length; i++) {
            collectionResults[values[i].collectionId] = values[i];
            collectionIds[values[i].name] = values[i].collectionId;
            ids[i] = values[i].collectionId;
        }
        activeCollectionIds = ids;
        lastUpdatedTimestamp = timestamp;
        latestEpoch = epoch;

        emit BlockReceived(epoch, timestamp, values);
    }

    /**
     * @dev using the hash of collection name, clients can query the result of that collection
     * @param _name bytes32 hash of the collection name
     * @return result of the collection and its power
     */
    function getResult(bytes32 _name) external view returns (uint256, int8) {
        require(msg.sender == forwarder, "Invalid caller");
        uint16 id = collectionIds[_name];
        return _getResultFromID(id);
    }

    /**
     * @dev Returns collection result and power with collectionId as parameter
     */
    function _getResultFromID(uint16 _id)
        internal
        view
        returns (uint256, int8)
    {
        return (collectionResults[_id].value, collectionResults[_id].power);
    }
}
