# Razor collection result proxy

## Architecture

![Architecture Diagram](/razor-bridge-arch.png)

### Destination Chain contracts

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

## Deployment

Deploy bridge on destination chain using `deployBridge.js` script.
Run: `npx hardhat run scripts/deployBridge.js --network [NETWORK]`
The above script will perform following operation:

1. Deploy ResultManager contract.
1. Deploy Forwarder contract.
1. Deploy TransparentForwarder contract.
1. Deploy Staking contract.
1. In ResultManager contract, grant `FORWARDER_ROLE` to Forwarder contract address.
1. In Forwarder contract, grant `TRANSPARENT_FORWARDER_ROLE` to TransparentForwarder contract address.
1. In Forwarder contract, grant `FORWARDER_ADMIN_ROLE` to deployer address.
1. In Forwarder contract, set collection payload with `COLLECTION_NAME_HASH` and `PAYLOAD`.
1. In TransparentForwarder contract, grant `TRANSPARENT_FORWARDER_ADMIN_ROLE` to deployer address.
1. In TransparentForwarder contract, `setStaking` as Staking contract address.
1. In Staking contract, grant `TRANSPARENT_FORWARDER_ROLE` to TransparentForwarder contract address.

> **_NOTE:_** Please verify `SIGNER_ADDRESS`, `COLLECTION_NAME_HASH` and `PAYLOAD` in `scripts/deployBridge.js` before deploying.

## Contract Address

### Calypso Mainnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x528E94882C5e3AB519ce2eFfc819509c062B32a0 |
| Forwarder            | 0x73280eA1053164528517CF176dFf6Fb42d5Ca7d4 |
| TransparentForwarder | 0xEb9324f0d17e4dEa7371f6dddf361D9bB453BEb9 |
| Staking              | 0x34775d367350a9a644bf70129d0356CCFF6238C3 |

### Nebula Mainnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x528E94882C5e3AB519ce2eFfc819509c062B32a0 |
| Forwarder            | 0x73280eA1053164528517CF176dFf6Fb42d5Ca7d4 |
| TransparentForwarder | 0xEb9324f0d17e4dEa7371f6dddf361D9bB453BEb9 |
| Staking              | 0x34775d367350a9a644bf70129d0356CCFF6238C3 |

### Calypso Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 |
| Forwarder            | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking              | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |

### Europa Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 |
| Forwarder            | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking              | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |

### Polygon Mumbai Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x3fF5387A4Ed802d6191C9d1ff78433b92733262C |
| Forwarder            | 0xAfAf9554D8f425030AB51188fC84Fe0Bd5f3E908 |
| TransparentForwarder | 0x76a6AB56E27823B2175F11b0041c489bFdb13c88 |
| Staking              | 0x86bE8d38558cFFec297aC049149fd86C4E2b67aB |

### Moonbase Alpha

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| Forwarder            | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| TransparentForwarder | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |
| Staking              | 0xe4371caE0ab6Fb4875BB1002c0230CB0a1423616 |

### zkSync v2.0 Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x3BB71B185cc0E45BfD1A13Aa5305B50a8De07b79 |
| Forwarder            | 0x3999142362705A2E59231C039aF49D82589e6325 |
| TransparentForwarder | 0x47c475a69FF1F0AfBe74d6399D57Ef43E4245185 |
| Staking              | 0x3238ee6E7EEDff8683dE31EB4fF80e187B5a1CC2 |

### BSC Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Forwarder            | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |
| TransparentForwarder | 0xe4371caE0ab6Fb4875BB1002c0230CB0a1423616 |
| Staking              | 0x53Df936a3594777185DF12Cd073d9033cfF348D6 |

### XDC Testnet (Apothem)

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |
| Forwarder            | 0xe4371caE0ab6Fb4875BB1002c0230CB0a1423616 |
| TransparentForwarder | 0x53Df936a3594777185DF12Cd073d9033cfF348D6 |
| Staking              | 0x7f80398840d1be49dd99609abe405034bf97e97a |

### opBNB Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 |
| Forwarder            | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking              | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |

### Polygon zkEVM Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 |
| Forwarder            | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking              | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |

### Meter Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x7cF18d12c75ea10E4070CF3745Ee82BfB52309dB |
| Forwarder            | 0xaec25C98C3EAC5f6D73a1760D1A70947B740A53C |
| TransparentForwarder | 0xb08183402f96645b72Cf2d2969DA01bB25D590CD |
| Staking              | 0xF31198E0B27B3903F5c9E4D6BeaA9DB6998eF4BB |

### Sepolia Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x53Df936a3594777185DF12Cd073d9033cfF348D6 |
| Forwarder            | 0x7f80398840D1bE49dD99609Abe405034bF97E97a |
| TransparentForwarder | 0x328BAc5C2be4961252041EC589A22e55Ec132010 |
| Staking              | 0x36b309a9D1404a7B2Ae3429742F2967EF861606E |


### OP Sepolia Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 |
| Forwarder            | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking              | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |


### Base Sepolia Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| Forwarder            | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| TransparentForwarder | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |
| Staking              | 0xe4371caE0ab6Fb4875BB1002c0230CB0a1423616 |


### Arbitrum Sepolia Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 |
| Forwarder            | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking              | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |


### Mantle Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 |
| Forwarder            | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking              | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |


### Linea Goerli Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 |
| Forwarder            | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking              | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |


### Scroll Sepolia Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 |
| Forwarder            | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking              | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |

## Adding a New Network to Bridge

### 1. Update Hardhat Configuration

To add a new network in bridge:

#### Steps:

1. **Open Configuration File**  
   Navigate to your project directory and open `hardhat.config.js`.

2. **Add Your Network Details**  
   In the `networks` section, append your new network configuration:

   ```javascript
   [NETWORK_NAME]: {
     url: "https://[YOUR-RPC-URL]",
     chainId: [CHAIN_ID],
     // ... any other specific configurations you might require.
   },
   ```

   Replace:

   - `[NETWORK_NAME]` with a unique identifier for your network (e.g., "mainnet").
   - `[YOUR-RPC-URL]` with the full URL to your network's RPC endpoint.
   - `[CHAIN_ID]` with the specific chain ID of your network.

### 2. Deployment Script (HARDHAT)

Once you've set up the network configuration, provide the following deployment script that needs to be run:

```bash
npx hardhat run scripts/deployBridge.js --network [NETWORK_NAME]
```

You'll need to replace `[NETWORK_NAME]` with the identifier you specified in the first step.

### 3. Deployment Script (FOUNDRY)

Make sure to install foundry following the steps [here](https://book.getfoundry.sh/getting-started/installation).

- refer to ENV for required details (NETWORK, DEPLOYER_ADDRESS, SIGNER_ADDRESS)

using private key: 
```bash
forge script script/Deployer.s.sol:Deployer --rpc-url $RPC_URL --optimize --private-key ${PRIV_KEY} -vvv
```
Note: the PRIV_KEY should match the derived DEPLOYER_ADDRESS set in ENV

using ledger: 

```bash
forge script script/Deployer.s.sol:Deployer --rpc-url $RPC_URL --optimize  -vvvv --ledger --sender ${DEPLOYER_ADDRESS} --hd-paths "m/44'/60'/${index}'/0/0" 
```

Note: 
- use `--broadcast` flag to deploy to live network
- use `--verify` flag to verify contracts deployed to networks that support it


### 3. Raise a Pull Request (PR)

- Commit and push your changes.
- Raise a PR against the original repository.
- Describe your changes and wait for review.


