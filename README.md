# Razor collection result proxy

## Architecture

![Architecture Diagram](/IMA-arch.png)

## Working

There are 2 contracts that are required to bridge collection result from skale chain to destination chain.

1. `ResultSender.sol` - To be deployed on skale chain (where Razor contracts are deployed).
2. `ResultHandler.sol` - To be deployed on destination chain (where Skale IMA bridge is supported).
   _NOTE_: `ResultHandler.sol` contract is deployed with OZ transparent proxy.

### How result will be updated?

- Razor-go calls `publishResult()` of **ResultSender** contract which fetches all the active collections and it's result and publish the data as bytes to `ResultHandler` on destination chain via Skale IMA bridge.
- `ResultHandler` listens for `postMessage`, as soon as message is received bytes data is decoded and collection result is updated.

## Deployment

1. Deploy ResultSender contract on source chain.
2. Whitelist the result proxy contract address on soruce chain using registerSchainContract.js script.
3. Update RESULT_PROXY_ADDRESS in ResultHanlder.sol contract (since it's a constant).
4. Deploy ResultHanlder contract on destination chain.
5. Whitelist the result handler contract address on destination chain using registerMainnetContract.js script.
6. Update result handler address in proxy contract using updateHandler.js script.

## Contract Address

| Contract                       | Address                                    | Chain Name        |
| ------------------------------ | ------------------------------------------ | ----------------- |
| ResultManager (Proxy)          | 0xF2aE9Fd8141E774A08EE3007dA76Ad9d058e713C | attractive-merope |
| ResultManager (Implementation) | 0xA76EF1b69Bd552796aef2Af9417C94708eC018D0 | attractive-merope |
| IMAProxy                       | 0xd2AAa00100000000000000000000000000000000 | attractive-merope |
| ResultHandler (Proxy)          | 0xc0Db5ff39A1a5dA7F3dE0eBc7BC838B79A259A75 | rinkeby           |
| ResultHandler (Implementation) | 0x71e95956CdF9297D5C2575c5fA86330FcF582358 | rinkeby           |
| IMAProxy                       | 0x656fb12abab353FB1875a4e3Dc4D70179CB85BA4 | rinkeby           |
| ResultSender                   | 0x68557306895C3E21d16B791e2AD9be5c54bd9c0c | whispering-turais |
| IMAProxy                       | 0xd2AAa00100000000000000000000000000000000 | whispering-turais |
