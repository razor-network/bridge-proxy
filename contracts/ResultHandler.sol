// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ResultHandler {
    mapping(uint16 => CollectionResult) collectionResults;

    struct CollectionResult {
        uint256 result;
        int8 power;
    }

    function postMessage(bytes memory data) public {
        (
            uint16[] memory ids,
            uint256[] memory results,
            int8[] memory power
        ) = abi.decode(data, (uint16[], uint256[], int8[]));

        for (uint256 i = 0; i < ids.length; i++) {
            collectionResults[ids[i]].result = results[i];
            collectionResults[ids[i]].power = power[i];
        }
    }

    function getResult(uint16 _id) public view returns (uint256, int8) {
        return (collectionResults[_id].result, collectionResults[_id].power);
    }
}
