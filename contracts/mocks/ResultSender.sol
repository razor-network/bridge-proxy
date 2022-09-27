// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./ResultHandler.sol";

contract ResultSenderMock is AccessControlEnumerable {
    uint256 public lastUpdatedTimestamp;
    uint256 public lastRequestId;

    bytes32 public constant DISPATCHER_ROLE = keccak256("DISPATCHER_ROLE");

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

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(DISPATCHER_ROLE, msg.sender);
    }

    function getMessage(
        int8[] memory power,
        uint16[] memory ids,
        bytes32[] memory names,
        uint256[] memory value
    ) public pure returns (bytes memory) {
        Value[] memory values = new Value[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            values[i] = Value(power[i], ids[i], names[i], value[i]);
        }

        bytes memory message = abi.encode(values);
        return message;
    }

    /**
     * @dev publish collection result via delegator.
     */
    function publishResult(
        address _resultHandler,
        uint32 _requestId,
        bytes calldata _signature,
        bytes calldata _message
    ) public onlyRole(DISPATCHER_ROLE) {
        lastUpdatedTimestamp = block.timestamp;
        lastRequestId = _requestId;

        Block memory tssBlock = Block(_requestId, _message, _signature);
        bytes memory data = abi.encode(tssBlock);

        ResultHandlerMock(_resultHandler).postMessage(address(this), data);
        // proxy.postOutgoingMessage(_targetChainHash, _resultHandler, data);
    }
}
