// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./interface/IDelegator.sol";

contract ResultProxy {
    IDelegator public delegator;
    address public owner;

    constructor(address _delegatorAddress) {
        delegator = IDelegator(_delegatorAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function updateDelegatorAddress(address _newDelegatorAddress)
        public
        onlyOwner
    {
        delegator = IDelegator(_newDelegatorAddress);
    }

    function publishResult() public view returns (bytes memory) {
        uint16[] memory activeCollections = delegator.getActiveCollections();

        uint16[] memory ids = new uint16[](activeCollections.length);
        uint256[] memory results = new uint256[](activeCollections.length);
        int8[] memory power = new int8[](activeCollections.length);

        for (uint256 i = 0; i < activeCollections.length; i++) {
            (uint256 collectionResult, int8 collectionPower) = delegator
                .getResultFromID(activeCollections[i]);
            ids[i] = activeCollections[i];
            results[i] = collectionResult;
            power[i] = collectionPower;
        }

        // send encoded data to MessageProxy
        return abi.encode(ids, results, power);
    }
}
