// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../interface/IForwarder.sol";

contract Client {
    IForwarder public transparentForwarder;
    uint256 public lastResult;
    int8 public lastPower;
    uint256 public lastTimestamp;

    constructor(address _transparentForwarder) {
        transparentForwarder = IForwarder(_transparentForwarder);
    }

    function setTransparentForwarder(address _transparentForwarder) public {
        transparentForwarder = IForwarder(_transparentForwarder);
    }

    function updateResult(
        bytes calldata data
    ) public payable returns (uint256, int8, uint256) {
        (uint256 result, int8 power, uint256 timestamp) = transparentForwarder
            .updateAndGetResult{value: msg.value}(data);

        lastResult = result;
        lastPower = power;
        lastTimestamp = timestamp;
        return (result, power, timestamp);
    }

    function getResult(
        bytes32 name
    ) public view returns (uint256, int8, uint256) {
        (uint256 result, int8 power, uint256 timestamp) = transparentForwarder
            .getResult(name);
        return (result, power, timestamp);
    }

    function validateResult(
        bytes calldata data
    ) public view returns (bool) {
        return
            transparentForwarder.validateResult(
                data
            );
    }
}
