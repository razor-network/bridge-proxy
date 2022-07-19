// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./interface/IDelegator.sol";
import "./interface/IResultHandler.sol";
import "./interface/IProxy.sol";

contract ResultProxy {
    IDelegator public delegator;
    address public resultHandler;
    IProxy public proxy;
    address public owner;

    constructor(
        address _resultHandlerAddress,
        address _proxyAddress,
        address _delegatorAddress
    ) {
        owner = msg.sender;
        resultHandler = _resultHandlerAddress;
        proxy = IProxy(_proxyAddress);
        delegator = IDelegator(_delegatorAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function updateAddress(
        address _newResultHandlerAddress,
        address _newProxyAddress,
        address _newDelegatorAddress
    ) public onlyOwner {
        resultHandler = _newResultHandlerAddress;
        proxy = IProxy(_newProxyAddress);
        delegator = IDelegator(_newDelegatorAddress);
    }

    function publishResult(bytes32 _targetChainHash) public {
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
        bytes memory data = abi.encode(ids, results, power);
        proxy.postOutgoingMessage(_targetChainHash, resultHandler, data);
    }
}
