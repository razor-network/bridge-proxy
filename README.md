# Razor collection result proxy

## Architecture

![Architecture Diagram](/IMA-arch.png)

## Working

There are 2 contracts that are required to bridge collection result from skale chain to destination chain.

1. `ResultSender.sol` - To be deployed on skale chain (where Razor contracts are deployed).
2. `ResultManager.sol` - To be deployed on destination chain (where Skale IMA bridge is supported).
   _NOTE_: `ResultManager.sol` contract is deployed with OZ transparent proxy.

### How s2s communication work?

- Daemon listens for BlockConfirmed events of oracle contract.
- Daemon will generate block offchain and calls `publishResult` of `ResultSender.sol` contract.
- `publishResult` will recover address from signature which is present in block, and check if it matches with whitelisted address.
- If it matches wilh the whitelisted address, message is sent through IMA.
- On destination chain, same ecrecover check happens and updates the result.

### What are the contents of Block?

Block:

- message
- signature

### What are the contents of Message?

message

- epoch
- requestId
- timestamp
- values[] (power, id, nameHash, value)

## Deployment

1. Deploy ResultSender contract on source chain using `deployResultSender.js` script.
   > **_NOTE:_** Please verify DELEGATOR_ADDRESS, COLLECTION_MANAGER_ADDRESS, SIGNER_ADDRESS and DESTINATION_CHAIN before deploying in the script.
2. Deploy ResultManager contract on destination chain using `deployResultManagerProxy` script.
   > **_NOTE:_** Verify SIGNER_ADDRESS and SOURCE_CHAIN in script before deploying.
3. [Optional] Publishing result can be done through `publishResult.js` script. Verify targetChainHash, RESULT_SENDER_ADDRESS and RESULT_MANAGER_PROXY_ADDRESS in script.
4. [Optional] Fetching result can done through `result.js` script. Verify `RESULT_MANAGER_PROXY_ADDRESS` in script.

## Contract Address

| Contract                       | Address                                    | Chain Name        |
| ------------------------------ | ------------------------------------------ | ----------------- |
| ResultManager (Proxy)          | 0xF2aE9Fd8141E774A08EE3007dA76Ad9d058e713C | attractive-merope |
| ResultManager (Implementation) | 0xA76EF1b69Bd552796aef2Af9417C94708eC018D0 | attractive-merope |
| IMAProxy                       | 0xd2AAa00100000000000000000000000000000000 | attractive-merope |
| ResultHandler (Proxy)          | 0xbd13374e145Cb2704c101D6FC34470D0a667F35d | rinkeby           |
| ResultHandler (Implementation) | 0xf7F8AC4653B6Ee69740e4A776796F9012fa6f675 | rinkeby           |
| IMAProxy                       | 0x656fb12abab353FB1875a4e3Dc4D70179CB85BA4 | rinkeby           |
| ResultSender                   | 0xd59f8FcF5fC59F957DFe5855eC297f9c3d77ED99 | whispering-turais |
| IMAProxy                       | 0xd2AAa00100000000000000000000000000000000 | whispering-turais |
