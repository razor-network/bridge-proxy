# Razor collection result proxy

## Architecture

![Architecture Diagram](/IMA-arch.png)

## Working

There are 2 contracts that are required to bridge collection result from skale chain to destination chain.

1. `ResultProxy.sol` - To be deployed on skale chain (where Razor contracts are deployed).
2. `ResultHandler.sol` - To be deployed on destination chain (where Skale IMA bridge is supported).

### How result will be updated?

- Razor-go calls `publishResult()` of **ResultProxy** contract which fetches all the active collections and it's result and publish the data as bytes to `ResultHandler` on destination chain via Skale IMA bridge.
- `ResultHandler` listens for `postMessage`, as soon as message is received bytes data is decoded and collection result is updated.

## Deployment

1. Deploy ResultProxy contract on source chain.
2. Whitelist the result proxy contract address on soruce chain using registerSchainContrat.js script.
3. Update RESULT_PROXY_ADDRESS in ResultHanlder.sol contract (since it's a constant).
4. Deploy ResultHanlder contract on destination chain.
5. Whitelist the result handler contract address on destination chain using registerMainnetContract.js script.
6. Update result handler address in proxy contract using updateHandler.js script.

## Contract Address

| Contract              | Address                                    | Chain Name        |
| --------------------- | ------------------------------------------ | ----------------- |
| ResultHandler         | 0x1C44BFe51762CF87aF4C95ABebB6607298eaF04a | attractive-merope |
| MessageProxy          | 0xd2AAa00100000000000000000000000000000000 | attractive-merope |
| ResultProxy           | 0xcBAcB0bFD136E43b998E45eB096E2a06dCb2a5C7 | whispering-turais |
| Delegator             | 0xEe0F436708677c399466Fd61179f8D9864999903 | whispering-turais |
| MessageProxy          | 0xd2AAa00100000000000000000000000000000000 | whispering-turais |
| ResultProxy (rinkeby) | 0xbf823D9323B74AE01096d84EcbE76Fb7e4D44209 | whispering-turais |
| ResultHandler         | 0x8DFdbC21f1F406A92F05C8B192fAd10e3b79eeb6 | Mainnet (rinkeby) |
| MessageProxy          | 0x656fb12abab353FB1875a4e3Dc4D70179CB85BA4 | Mainnet (rinkeby) |
