// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ResultHandler {
    uint16[] public activeCollectionIds;
    uint256 public lastUpdatedTimestamp;

    mapping(uint16 => CollectionResult) public collectionResults;

    event DataReceived(bytes32 schainHash, address sender, bytes data);

    struct CollectionResult {
        uint256 result;
        int8 power;
    }

    function postMessage(
        bytes32 schainHash,
        address sender,
        bytes calldata data
    ) external returns (address) {
        (
            uint16[] memory ids,
            uint256[] memory results,
            int8[] memory power,
            uint256 timestamp
        ) = abi.decode(data, (uint16[], uint256[], int8[], uint256));

        activeCollectionIds = ids;
        lastUpdatedTimestamp = timestamp;

        for (uint256 i = 0; i < ids.length; i++) {
            collectionResults[ids[i]].result = results[i];
            collectionResults[ids[i]].power = power[i];
        }
        emit DataReceived(schainHash, sender, data);
        return sender;
    }

    function getAllResult()
        public
        view
        returns (
            uint16[] memory,
            uint256[] memory,
            int8[] memory,
            uint256
        )
    {
        uint256 activeCollectionsLength = activeCollectionIds.length;

        uint256[] memory results = new uint256[](activeCollectionsLength);
        int8[] memory power = new int8[](activeCollectionsLength);

        for (uint256 i = 0; i < activeCollectionsLength; i++) {
            results[i] = collectionResults[activeCollectionIds[i]].result;
            power[i] = collectionResults[activeCollectionIds[i]].power;
        }

        return (activeCollectionIds, results, power, lastUpdatedTimestamp);
    }

    function getResult(uint16 _id) public view returns (uint256, int8) {
        return (collectionResults[_id].result, collectionResults[_id].power);
    }
}