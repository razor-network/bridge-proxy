// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./ResultManager.sol";

contract ResultSenderMock is AccessControlEnumerable {
    address public signerAddress;
    uint256 public lastUpdatedEpoch;

    struct Block {
        bytes message;
        bytes signature;
    }

    struct Value {
        int8 power;
        uint16 collectionId;
        bytes32 name;
        uint256 value;
    }

    constructor(address _signerAddress) {
        signerAddress = _signerAddress;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Allows admin to update signer address.
     */
    function updateSignerAddress(address _newSignerAddress) public {
        require(
            msg.sender == signerAddress ||
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Invalid Caller"
        );
        signerAddress = _newSignerAddress;
    }

    /**
     * @dev Used by daemon/signer to generate message
     */

    function getMessage(
        int8[] memory power,
        uint16[] memory ids,
        bytes32[] memory names,
        uint256[] memory value,
        uint256 epoch,
        uint32 requestId
    ) public pure returns (bytes memory) {
        Value[] memory values = new Value[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            values[i] = Value(power[i], ids[i], names[i], value[i]);
        }

        bytes memory message = abi.encode(epoch, requestId, values);
        return message;
    }

    /**
     * @dev Used by daemon/signer to generate block from message and signature
     */
    function getBlock(bytes calldata message, bytes calldata signature)
        public
        pure
        returns (Block memory)
    {
        return Block(message, signature);
    }

    /**
     * @dev publish collection result via delegator.
     */
    function publishResult(address _resultHandler, Block calldata messageBlock)
        public
    {
        bytes32 messageHash = keccak256(messageBlock.message);
        require(
            ECDSA.recover(
                ECDSA.toEthSignedMessageHash(messageHash),
                messageBlock.signature
            ) == signerAddress,
            "invalid signature"
        );
        bytes memory data = abi.encode(messageBlock);

        ResultManagerMock(_resultHandler).postMessage(address(this), data);
        // proxy.postOutgoingMessage(_targetChainHash, _resultHandler, data);
    }
}
