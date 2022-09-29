// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IMAProxy {
    function postOutgoingMessage(
        bytes32 targetChainHash,
        address targetContract,
        bytes calldata data
    ) external;
}
