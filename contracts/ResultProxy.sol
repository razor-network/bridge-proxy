// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./interface/IDelegator.sol";
import "./interface/IResultHandler.sol";

contract ResultProxy {
    IDelegator public delegator;
    IResultHandler public resultHandler;
    address public owner;

    constructor(address _delegatorAddress, address _resultHandlerAddress) {
        delegator = IDelegator(_delegatorAddress);
        resultHandler = IResultHandler(_resultHandlerAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function updateAddress(
        address _newDelegatorAddress,
        address _newResultHandlerAddress
    ) public onlyOwner {
        delegator = IDelegator(_newDelegatorAddress);
        resultHandler = IResultHandler(_newResultHandlerAddress);
    }

    function publishResult() public returns (bytes memory data) {
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
        data = abi.encode(ids, results, power);
        resultHandler.postMessage(data);
    }
}
