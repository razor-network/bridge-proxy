// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ResultReceiverProxy is OwnableUpgradeable {
    uint16[] public activeCollectionIds;
    uint256 public lastUpdatedTimestamp;
    uint32 public updatedCounter;

    bytes32 public constant SOURCE_CHAIN_HASH = keccak256("whispering-turais");
    address public constant IMA_PROXY_ADDRESS =
        0xd2AAa00100000000000000000000000000000000;
    address public resultSender;

    function initialize(address _resultSender) public initializer {
        __Ownable_init();
        resultSender = _resultSender;
    }

    struct Collection {
        uint16 id;
        int8 power;
        uint256 result;
    }

    /// @notice mapping for name of collection in bytes32 -> collectionid
    mapping(bytes32 => uint16) public collectionIds;

    /// @notice mapping for CollectionID -> Collection Info
    mapping(uint16 => Collection) public collections;

    event DataReceived(bytes32 schainHash, address sender, bytes data);

    modifier onlyMessageProxy() {
        require(msg.sender == IMA_PROXY_ADDRESS, "Not message proxy address");
        _;
    }

    /**
     * @dev Update resultSender address
     * Requirements:
     * - `msg.sender` should be admin
     */
    function updateResultSender(address _resultSender) public onlyOwner {
        resultSender = _resultSender;
    }

    // * NOTE: Add initialized modifier to all functions
    /**
     * @dev Receives source chain data through validators/IMA
     * Requirements:
     *
     * - `msg.sender` should be IMA_PROXY_ADDRESS
     * - schainHash should be SOURCE_CHAIN_HASH
     * - sender should be resultSender
     */
    function postMessage(
        bytes32 schainHash,
        address sender,
        bytes calldata data
    ) external onlyMessageProxy returns (address) {
        require(schainHash == SOURCE_CHAIN_HASH, "Source chain does not match");
        require(sender == resultSender, "Not Result proxy contract");

        (
            uint16[] memory ids,
            uint256[] memory results,
            int8[] memory power,
            bytes32[] memory namesHash,
            uint256 timestamp
        ) = abi.decode(data, (uint16[], uint256[], int8[], bytes32[], uint256));

        updatedCounter++;

        activeCollectionIds = ids;
        lastUpdatedTimestamp = timestamp;

        for (uint256 i = 0; i < ids.length; i++) {
            collections[ids[i]].result = results[i];
            collections[ids[i]].power = power[i];
            collectionIds[namesHash[i]] = ids[i];
        }
        emit DataReceived(schainHash, sender, data);
        return sender;
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
        return (collections[_id].result, collections[_id].power);
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