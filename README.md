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
| ResultHandler (Proxy)          | 0xE8d70335AE7fc0c145917EA303D507b18f3fE854 | attractive-merope |
| ResultHandler (Implementation) | 0x626cBE9a8a2A96DA7435f13e26045e82E136Eaf4 | attractive-merope |
| IMAProxy                       | 0xd2AAa00100000000000000000000000000000000 | attractive-merope |
| ResultHandler (Proxy)          | 0x665f152ee96c6c6448A81e1002BC99A70D4A29AD | rinkeby |
| ResultHandler (Implementation) | 0xE41CfA819999Ba9A9810830A55cc118de472855d | rinkeby |
| IMAProxy                       | 0x656fb12abab353FB1875a4e3Dc4D70179CB85BA4 | rinkeby |
| ResultSender                   | 0xfa6D7a3a902020561e1D9D098Bac444D3B7e15b6 | whispering-turais |
| IMAProxy                       | 0xd2AAa00100000000000000000000000000000000 | whispering-turais |
