// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./interface/IDelegator.sol";
import "./interface/IProxy.sol";

contract ResultProxy {
    IDelegator public delegator;
    IProxy public proxy;
    address public owner;

    constructor(address _proxyAddress, address _delegatorAddress) {
        owner = msg.sender;
        proxy = IProxy(_proxyAddress);
        delegator = IDelegator(_delegatorAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /**
     * @dev Allows admin to update delegator address.
     */
    function updateDelegatorAddress(address _delegatorAddress)
        public
        onlyOwner
    {
        delegator = IDelegator(_delegatorAddress);
    }

    /**
     * @dev Allows admin to update skale IMA proxy address.
     */
    function updateProxyAddress(address _newProxyAddress) public onlyOwner {
        proxy = IProxy(_newProxyAddress);
    }

    /**
     * @dev publish collection result via delegator.
     */
    function publishResult(bytes32 _targetChainHash, address _resultHandler)
        public
    {
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
        bytes memory data = abi.encode(ids, results, power, block.timestamp);
        proxy.postOutgoingMessage(_targetChainHash, _resultHandler, data);
    }
}
