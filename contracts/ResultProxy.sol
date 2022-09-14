// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./interface/IDelegator.sol";
import "./interface/IProxy.sol";

contract ResultProxy is AccessControlEnumerable {
    IDelegator public delegator;
    IProxy public proxy;

    bytes32 public constant DISPATCHER_ROLE = keccak256("DISPATCHER_ROLE");

    constructor(address _proxyAddress, address _delegatorAddress) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        proxy = IProxy(_proxyAddress);
        delegator = IDelegator(_delegatorAddress);
    }

    modifier onlyDispatcherRole() {
        require(hasRole(DISPATCHER_ROLE, msg.sender), "Not a dispatcher");
        _;
    }

    /**
     * @dev Allows admin to update delegator address.
     */
    function updateDelegatorAddress(address _delegatorAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        delegator = IDelegator(_delegatorAddress);
    }

    /**
     * @dev Allows admin to update skale IMA proxy address.
     */
    function updateProxyAddress(address _newProxyAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        proxy = IProxy(_newProxyAddress);
    }

    /**
     * @dev publish collection result via delegator.
     */
    function publishResult(bytes32 _targetChainHash, address _resultHandler)
        public
        onlyRole(DISPATCHER_ROLE)
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
