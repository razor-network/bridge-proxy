// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ResultHandler is AccessControlEnumerableUpgradeable {

    uint16[] public activeCollectionIds;
    bool public initialized;
    address public keygenAddress;
    uint256 public lastUpdatedTimestamp;

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

    // requestId => Block
    mapping(uint32 => Block) public blocks;

    /// @notice mapping for name of collection in bytes32 -> collectionid
    mapping(bytes32 => uint16) public collectionIds;

    /// @notice mapping for CollectionID -> Value Info
    mapping(uint16 => Value) public collectionResults;

    event DataReceived(bytes32 schainHash, address sender, bytes data);


    modifier onlyInitialized() {
        require(initialized, "Contract should be initialized");
        _;
    }

    function initialize(address _keygenAddress) public initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        initialized = true;
        keygenAddress = _keygenAddress;
    }

    function setKeygen(address _keygenAddress) external {
        require(
            msg.sender == keygenAddress ||
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Invalid Caller"
        );
        keygenAddress = _keygenAddress;
    }

    function setBlock(Block memory tssBlock) public onlyInitialized {
        bytes32 messageHash = keccak256(tssBlock.message);

        require(
            ECDSA.recover(
                ECDSA.toEthSignedMessageHash(messageHash),
                tssBlock.signature
            ) == keygenAddress,
            "invalid signature"
        );

        (, uint32 requestId, uint256 timestamp, Value[] memory values) = abi
            .decode(tssBlock.message, (uint256, uint32, uint256, Value[]));

        uint16[] memory ids = new uint16[](values.length);
        blocks[requestId] = tssBlock;
        for (uint256 i; i < values.length; i++) {
            collectionResults[values[i].collectionId] = values[i];
            collectionIds[values[i].name] = values[i].collectionId;
            ids[i] = values[i].collectionId;
        }
        activeCollectionIds = ids;
        lastUpdatedTimestamp = timestamp;
    }

    /**
     * @dev Receives source chain data through validators/IMA
     * Requirements:
     *
     * - `msg.sender` should be IMA_PROXY_ADDRESS
     * - sender should be resultSender
     */
    function postMessage(
        bytes32 schainHash,
        address sender,
        bytes calldata data
    ) external onlyInitialized {
        Block memory tssBlock = abi.decode(data, (Block));
        setBlock(tssBlock);
        emit DataReceived(schainHash, sender, data);
    }

    /**
     * @dev using the hash of collection name, clients can query collection id with respect to its hash
     * @param _name bytes32 hash of the collection name
     * @return collection ID
     */
    function getCollectionID(bytes32 _name) external view returns (uint16) {
        return collectionIds[_name];
    }

    /**
     * @dev using the hash of collection name, clients can query the result of that collection
     * @param _name bytes32 hash of the collection name
     * @return result of the collection and its power
     */
    function getResult(bytes32 _name) external view returns (uint256, int8) {
        uint16 id = collectionIds[_name];
        return getResultFromID(id);
    }

    /**
     * @dev Returns collection result and power with collectionId as parameter
     */
    function getResultFromID(uint16 _id) public view returns (uint256, int8) {
        return (collectionResults[_id].value, collectionResults[_id].power);
    }

    /**
     * @return ids of active collections in the oracle
     */
    function getActiveCollections() external view returns (uint16[] memory) {
        return activeCollectionIds;
    }

    /**
     * @dev using the collection id, clients can query the status of collection
     * @param _id collection ID
     * @return status of the collection
     */
    function getCollectionStatus(uint16 _id) external view returns (bool) {
        bool isActive;
        for (uint256 i = 0; i < activeCollectionIds.length; i++) {
            if (activeCollectionIds[i] == _id) {
                isActive = true;
                break;
            }
        }
        return isActive;
    }
}
