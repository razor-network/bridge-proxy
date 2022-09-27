// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ResultHandlerMock is AccessControlEnumerableUpgradeable {
    uint16[] public activeCollectionIds;

    bytes32 public constant SOURCE_CHAIN_HASH = keccak256("whispering-turais");
    address public constant MESSAGE_PROXY_ADDRESS =
        0xd2AAa00100000000000000000000000000000000;
    address public resultSender;
    bool public initialized;
    address public keygenAddress;

    function initialize(address _keygenAddress) public initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        initialized = true;
        keygenAddress = _keygenAddress;
    }

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

    // requestId => Block
    mapping(uint32 => Block) public blocks;

    /// @notice mapping for name of collection in bytes32 -> collectionid
    mapping(bytes32 => uint16) public collectionIds;

    /// @notice mapping for CollectionID -> Value Info
    mapping(uint16 => Value) public collectionResults;

    event DataReceived(bytes data);

    modifier onlyInitialized() {
        require(initialized, "Contract should be initialized");
        _;
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

        Value[] memory values = abi.decode(tssBlock.message, (Value[])); // solhint-disable-line
        uint16[] memory ids = new uint16[](values.length);

        blocks[tssBlock.requestId] = tssBlock;
        for (uint256 i; i < values.length; i++) {
            collectionResults[values[i].collectionId] = values[i];
            collectionIds[values[i].name] = values[i].collectionId;
            ids[i] = values[i].collectionId;
        }
        activeCollectionIds = ids;
    }

    /**
     * @dev Receives source chain data through validators/IMA
     */
    function postMessage(address sender, bytes calldata data) external {
        Block memory tssBlock = abi.decode(data, (Block));
        setBlock(tssBlock);
        emit DataReceived(data);
    }

    /**
     * @dev using the hash of collection name, clients can query collection id with respect to its hash
     * @param _name bytes32 hash of the collection name
     * @return collection ID
     */
    function getCollectionID(bytes32 _name) public view returns (uint16) {
        return collectionIds[_name];
    }

    /**
     * @dev using the hash of collection name, clients can query the result of that collection
     * @param _name bytes32 hash of the collection name
     * @return result of the collection and its power
     */
    function getResult(bytes32 _name) public view returns (uint256, int8) {
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
    function getCollectionStatus(uint16 _id) public view returns (bool) {
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
