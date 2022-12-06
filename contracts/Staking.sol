// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Staking {
    address transparentForwarder;

    constructor(address _transparentForwarder) {
        transparentForwarder = _transparentForwarder;
    }

    function isWhitelisted() external payable returns (bool) {
        require(msg.sender == transparentForwarder, "Staking: Invalid caller");
        return true;
    }
}
