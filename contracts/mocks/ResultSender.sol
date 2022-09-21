// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./ResultReceiverProxy.sol";

contract ResultSenderMock is AccessControlEnumerable {
    uint256 public lastUpdatedTimestamp;

    bytes32 public constant DISPATCHER_ROLE = keccak256("DISPATCHER_ROLE");

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(DISPATCHER_ROLE, msg.sender);
    }

    /**
     * @dev publish collection result via delegator.
     */
    function publishResult(address _resultReceiver, bytes memory data)
        public
        onlyRole(DISPATCHER_ROLE)
    {
        lastUpdatedTimestamp = block.timestamp;
        ResultReceiverProxyMock(_resultReceiver).postMessage(
            address(this),
            data
        );
        // proxy.postOutgoingMessage(_targetChainHash, _resultHandler, data);
    }
}
