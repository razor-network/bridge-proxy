# Razor collection result proxy

## Architecture

![Architecture Diagram](/razor-bridge-arch.png)

## Deployments

### Destination Chain

1. `ResultManager` - This contract is used to return results stored from the Native Chain.
2. `ForwarderContract` - Used to map collection payloads and to fetch data from the ResultManager.
3. `TransparentProxy` - Clients will interact directly with this contract to query data using an interface (`ITransparentForwarder`).
4. `Staking` - To enable Whitelisting and to facilitate fees.

### How does data from the native chain get bridged?

- The Bridge Daemon listens for BlockConfirmed events from the Oracle on the Native Chain.
- Daemon will then call `setBlock()` in the `ResultManager` contract of each destination chain. The `signerAddress` of the Block is verified here.
- The results are now available for Clients to query using an interface `ITransparentProxy` using the `TransparentProxy` address of the respective destination chain.

### What are the contents of a Block?

Block:

- message
- signature

### What are the contents of Message?

message

- epoch
- timestamp
- values[] (power, id, nameHash, value)

## Chain Contract Addresses

1. Deploy ResultManager contract on source chain using `deployResultManager.js` script.
   > **_NOTE:_** Please verify SIGNER_ADDRESS and DESTINATION_CHAIN before deploying in the script.
2. Deploy Forwarder, TransparentProxy and Staking contracts using `deployForwarder.js` script.
   > **_NOTE:_** Verify SIGNER_ADDRESS and DESTINATION_CHAIN in script before deploying.

## Contract Address

###  Calypso Testnet

| Contract                       | Address                                    |
| ------------------------------ | ------------------------------------------ | 
| ResultManager         | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 | 
| Forwarder  | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder                       | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking           | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF | 


###  Europa Testnet

| Contract                       | Address                                    |
| ------------------------------ | ------------------------------------------ | 
| ResultManager         | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 | 
| Forwarder  | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder                       | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking           | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF | 


###  Polygon Mumbai Testnet

| Contract                       | Address                                    |
| ------------------------------ | ------------------------------------------ | 
| ResultManager         | 0x3fF5387A4Ed802d6191C9d1ff78433b92733262C | 
| Forwarder  | 0xAfAf9554D8f425030AB51188fC84Fe0Bd5f3E908 |
| TransparentForwarder                       | 0x76a6AB56E27823B2175F11b0041c489bFdb13c88 |
| Staking           | 0x86bE8d38558cFFec297aC049149fd86C4E2b67aB | 


###  Moonbase Alpha

| Contract                       | Address                                    |
| ------------------------------ | ------------------------------------------ | 
| ResultManager         | 0xa26232204879C4370806cA56F821b9fe97eAeF5B | 
| Forwarder  | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| TransparentForwarder                       | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |
| Staking           | 0xe4371caE0ab6Fb4875BB1002c0230CB0a1423616 | 



###  zkSync v2.0 Testnet

| Contract                       | Address                                    |
| ------------------------------ | ------------------------------------------ | 
| ResultManager         | 0x3BB71B185cc0E45BfD1A13Aa5305B50a8De07b79 | 
| Forwarder  | 0x3238ee6E7EEDff8683dE31EB4fF80e187B5a1CC2 |
| TransparentForwarder                       | 0xE874C95b16964576f2dEa8277fA33214Fc9d73ed |
| Staking           | 0x7505cA8584128154C8e19543043947bE9C2A75D2 | 


