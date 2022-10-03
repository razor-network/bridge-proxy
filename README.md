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
| ResultHandler (Proxy)          | 0x801DdA93f02C0b30E7495bCC788D51271863Ec8c | attractive-merope |
| ResultHandler (Implementation) | 0xA49c5C187c24c39BF99AeA75Db95599184D8FA14 | attractive-merope |
| IMAProxy                       | 0xd2AAa00100000000000000000000000000000000 | attractive-merope |
| ResultHandler (Proxy)          | 0xc0Db5ff39A1a5dA7F3dE0eBc7BC838B79A259A75 | rinkeby |
| ResultHandler (Implementation) | 0x71e95956CdF9297D5C2575c5fA86330FcF582358 | rinkeby |
| IMAProxy                       | 0x656fb12abab353FB1875a4e3Dc4D70179CB85BA4 | rinkeby |
| ResultSender                   | 0x48F3E84e6Ffaf3f55D44D141144a424a424dB83c | whispering-turais |
| IMAProxy                       | 0xd2AAa00100000000000000000000000000000000 | whispering-turais |
