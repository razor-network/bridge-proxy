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

    bytes32 public constant RESULT_MANAGER_ADMIN_ROLE =
        keccak256("RESULT_MANAGER_ADMIN_ROLE");
    bytes32 public constant FORWARDER_ROLE = keccak256("FORWARDER_ROLE");

    address public signerAddress;
    uint256 public lastUpdatedTimestamp;
    uint32 public latestEpoch;

    /// @notice mapping for name of collection in bytes32 -> collectionid
    mapping(bytes32 => uint16) public collectionIds;

    /// @notice mapping for CollectionID -> Value Info
    mapping(uint16 => Value) private _collectionResults;

    event BlockReceived(Block messageBlock);

    constructor(address _signerAddress) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        signerAddress = _signerAddress;
    }

    function updateSignerAddress(
        address _signerAddress
    ) external onlyRole(RESULT_MANAGER_ADMIN_ROLE) {
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
        require(epoch > latestEpoch, "epoch must be > latestEpoch");

        bytes32 messageHash = keccak256(messageBlock.message);
        require(
            ECDSA.recover(
                ECDSA.toEthSignedMessageHash(messageHash),
                messageBlock.signature
            ) == signerAddress,
            "invalid signature"
        );

        uint16[] memory ids = new uint16[](values.length);
        for (uint256 i; i < values.length; i++) {
            _collectionResults[values[i].collectionId] = values[i];
            collectionIds[values[i].name] = values[i].collectionId;
            ids[i] = values[i].collectionId;
        }
        lastUpdatedTimestamp = timestamp;
        latestEpoch = epoch;

        emit BlockReceived(messageBlock);
    }

    /**
     * @dev using the hash of collection name, clients can query the result of that collection
     * @param _name bytes32 hash of the collection name
     * @return result of the collection and its power
     */
    function getResult(
        bytes32 _name
    ) external view onlyRole(FORWARDER_ROLE) returns (uint256, int8) {
        uint16 id = collectionIds[_name];
        return _getResultFromID(id);
    }

    /**
     * @dev Returns collection result and power with collectionId as parameter
     */
    function _getResultFromID(
        uint16 _id
    ) internal view returns (uint256, int8) {
        return (_collectionResults[_id].value, _collectionResults[_id].power);
    }
}
