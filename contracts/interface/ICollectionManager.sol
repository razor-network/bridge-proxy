// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

struct Collection {
    bool active;
    uint16 id;
    int8 power;
    uint32 tolerance;
    uint32 aggregationMethod;
    uint16[] jobIDs;
    string name;
}

interface ICollectionManager {
    function getCollection(uint16 id)
        external
        view
        returns (Collection memory collection);
}
