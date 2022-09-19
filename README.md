# Razor collection result proxy

## Architecture

![Architecture Diagram](/IMA-arch.png)

## Working

There are 2 contracts that are required to bridge collection result from skale chain to destination chain.

1. `ResultProxy.sol` - To be deployed on skale chain (where Razor contracts are deployed).
2. `ResultHandler.sol` - To be deployed on destination chain (where Skale IMA bridge is supported).
   _NOTE_: `ResultHandler.sol` contract is deployed with OZ transparent proxy.

### How result will be updated?

- Razor-go calls `publishResult()` of **ResultProxy** contract which fetches all the active collections and it's result and publish the data as bytes to `ResultHandler` on destination chain via Skale IMA bridge.
- `ResultHandler` listens for `postMessage`, as soon as message is received bytes data is decoded and collection result is updated.

## Deployment

1. Deploy ResultProxy contract on source chain.
2. Whitelist the result proxy contract address on soruce chain using registerSchainContract.js script.
3. Update RESULT_PROXY_ADDRESS in ResultHanlder.sol contract (since it's a constant).
4. Deploy ResultHanlder contract on destination chain.
5. Whitelist the result handler contract address on destination chain using registerMainnetContract.js script.
6. Update result handler address in proxy contract using updateHandler.js script.

## Contract Address

| Contract                       | Address                                    | Chain Name        |
| ------------------------------ | ------------------------------------------ | ----------------- |
| ResultHandler (Proxy)          | 0xCfF9840C6D8912D91E5f47Cf32672F94Ef673521 | attractive-merope |
| ResultHandler (Implementation) | 0x35Fc80564fb755c8C7e1BCB277445fC726649b70 | attractive-merope |
| MessageProxy                   | 0xd2AAa00100000000000000000000000000000000 | attractive-merope |
| ResultProxy                    | 0x4d03D2fd0aa2EF6bC286dd8C0C970148d681529C | whispering-turais |
| MessageProxy                   | 0xd2AAa00100000000000000000000000000000000 | whispering-turais |
| ResultProxy (rinkeby)          | 0x54EB375F80f6feCA26BaA49A76dc7FB35bd04a03 | whispering-turais |
| ResultHandler                  | 0x10144adD7B8cB532BE580cf508837f155416D21A | Mainnet (rinkeby) |
| MessageProxy                   | 0x656fb12abab353FB1875a4e3Dc4D70179CB85BA4 | Mainnet (rinkeby) |
