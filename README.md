# Razor collection result proxy

## Working

There are 2 contracts that are required to bridge collection result from skale chain to destination chain.

1. `ResultProxy.sol` - To be deployed on skale chain (where Razor contracts are deployed).
2. `ResultHandler.sol` - To be deployed on destination chain (where Skale IMA bridge is supported).

### How result will be updated?

- Razor-go calls `publishResult()` of **ResultProxy** contract which fetches all the active collections and it's result and publish the data as bytes to `ResultHandler` on destination chain via Skale IMA bridge.
- `ResultHandler` listens for `postMessage`, as soon as message is received bytes data is decoded and collection result is updated.

## Contract Address

| Contract      | Address                                    |
| ------------- | ------------------------------------------ |
| ResultHandler | 0xB0F974464eA9BbB2adA6a08B0AB226Cbc57F7261 |
| ResultProxy   | 0x3495e761eBeb87991C6CD1137108Fd3e7D3c74ba |
| Delegator     | 0xEe0F436708677c399466Fd61179f8D9864999903 |
