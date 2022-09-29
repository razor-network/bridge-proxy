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
| ResultHandler (Proxy)          | 0xE5E77D25a53b801cA312aEBa6c798e47E992d77c | attractive-merope |
| ResultHandler (Implementation) | 0x5F11eD9E0de9a83e486de27C456B5aF865aC8cD8 | attractive-merope |
| IMAProxy                       | 0xd2AAa00100000000000000000000000000000000 | attractive-merope |
| ResultHandler (Proxy)          | 0xa812E03C4C1E7c286bb4EAAB41a5B4650AC33aB0 | rinkeby |
| ResultHandler (Implementation) | 0x12Cbd31a8ECbCAf17Ff551C3b7a758E9A8f72f85 | rinkeby |
| IMAProxy                       | 0x656fb12abab353FB1875a4e3Dc4D70179CB85BA4 | rinkeby |
| ResultSender                   | 0xE93C1C49Ed593CaA13027C3B8987A9DdB8fE35c7 | whispering-turais |
| IMAProxy                       | 0xd2AAa00100000000000000000000000000000000 | whispering-turais |
