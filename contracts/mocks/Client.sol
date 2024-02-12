// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../interface/ITransparentForwarder.sol";

contract Client {
    ITransparentForwarder public transparentForwarder;
    uint256 public lastResult;
    int8 public lastPower;
    uint256 public lastTimestamp;
    bool public isResultValid;

    constructor(address _transparentForwarder) {
        transparentForwarder = ITransparentForwarder(_transparentForwarder);
    }

    function setTransparentForwarder(address _transparentForwarder) public {
        transparentForwarder = ITransparentForwarder(_transparentForwarder);
    }

    function updateResult(bytes calldata data) public payable returns (uint256, int8, uint256) {
        (uint256 result, int8 power, uint256 timestamp) = transparentForwarder.updateAndGetResult{value: msg.value}(data);

        lastResult = result;
        lastPower = power;
        lastTimestamp = timestamp;
        return (result, power, timestamp);
    }

    function getResult(bytes32 name) public returns (uint256, int8, uint256) {
        (uint256 result, int8 power, uint256 timestamp) = transparentForwarder.getResult(name);

        lastResult = result;
        lastPower = power;
        lastTimestamp = timestamp;
        return (result, power, timestamp);
    }

    function validateResult(bytes calldata data) public returns (bool) {
        (isResultValid, , , ) = transparentForwarder.validateResult(data);

        return isResultValid;
    }
}
