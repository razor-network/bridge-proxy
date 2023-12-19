// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IDelegator {
    /**
     * @notice Updates the result based on the provided data and returns the latest result
     * @dev The data will be updated only if the result is valid and is newer than the previous result.
     * Updation will be done by the clients, though once the result is updated, it wont be updated till the latest results
     * are sent again. Regardless of the updation, the result will be returned.
     * @param _data bytes32 hash of the collection name
     * @return result of the collection, its power and timestamp
     */
    function fetchResult(
        bytes calldata _data
    ) external payable returns (uint256, int8, uint256);

    /**
     * @dev using the hash of collection name, clients can query the result of that collection
     * @param _name bytes32 hash of the collection name
     * @return result of the collection and its power
     */
    function getResult(
        bytes32 _name
    ) external view returns (uint256, int8, uint256);

    /**
     * @dev validates the result based on the provided data and returns the validity
     * @param _data bytes data required to validate the result
     * @return validity of the result
     */
    function validateResult(bytes calldata _data)
        external view returns (bool);
}

contract Client {
    IDelegator public transparentForwarder;
    uint256 public lastResult;
    int8 public lastPower;
    uint256 public lastTimestamp;

    constructor(address _transparentForwarder) {
        transparentForwarder = IDelegator(_transparentForwarder);
    }

    function setTransparentForwarder(address _transparentForwarder) public {
        transparentForwarder = IDelegator(_transparentForwarder);
    }

    function updateResult(
        bytes calldata data
    ) public payable returns (uint256, int8, uint256) {
        (uint256 result, int8 power, uint256 timestamp) = transparentForwarder
            .fetchResult{value: msg.value}(data);

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
