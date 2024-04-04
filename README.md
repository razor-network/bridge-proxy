# Razor collection result proxy

## Architecture

![Architecture Diagram](/razor-bridge-arch.png)

### Destination Chain contracts

1. `ResultManager` - This contract is used to return results stored from the Native Chain.
2. `ForwarderContract` - Used to map collection payloads and to fetch data from the ResultManager.
3. `TransparentProxy` - Clients will interact directly with this contract to query data using an interface (`ITransparentForwarder`).
4. `Staking` - To enable Whitelisting and to facilitate fees.

To read more visit our [documentation](https://docs.razor.network/docs/consume-data-feeds/bridge).

### What are the contents of a Block?

Block:

- message
- signature

### What are the contents of calldata received from the REST API?

message

- merkleRoot
- proof
- result (power,collectionId,name,value,lastUpdatedTimestamp)
- signature

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
1. In Forwarder contract, set `resultGetterSelector`, `updateSelector` and `validateSelector`.
1. In TransparentForwarder contract, grant `TRANSPARENT_FORWARDER_ADMIN_ROLE` to deployer address.
1. In Staking contract, grant `TRANSPARENT_FORWARDER_ROLE` to TransparentForwarder contract address.

> **_NOTE:_** Please verify `SIGNER_ADDRESS`, and `DEPLOYER_ADDRESS` in `scripts/deployBridge.js` before deploying.

## Contract Address

### XDC Mainnet

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
| ResultManager        | 0x651a67140162b67f194eF88d5980A7f8E21b41AC |
| Forwarder            | 0x26C26a883fE22b82a89A2Fa8236240744E3C12f9 |
| TransparentForwarder | 0x06b2F64e4Af757e5558787a4e45f4b52dB1D81E6 |
| Staking              | 0x60C14232DbFB779943768DDa5FE01b65eCA4B686 |

### Polygon Mumbai Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x8E1B9f614212Fd2B6d7fFAaD3B1183adc38d9322 |
| Forwarder            | 0xa6DAe98862A5a64f00279DD4Ba4dD88EeC50CaEb |
| TransparentForwarder | 0xed07cdA9bfA5337A50bFFE5c2ADD51cE8f2cF4EF |
| Staking              | 0x10ae6E0a22c224F6f45a9aF16171f75B972385A8 |

### Moonbase Alpha

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xea0127Ebd31617D4672DBCAd34f7a6Be5e35D7e2 |
| Forwarder            | 0x7c4A71d4A92431B76986aEbcfc3e6db49E432412 |
| TransparentForwarder | 0xE6A9e42aE9ADE31D3Aef73202A8Df8167Ed01683 |
| Staking              | 0x3D98095eb64d3d14C7f4EF3cf8b73cd1B20429c3 |

### zkSync Era Sepolia Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x30477910E352DD036bd2A2999ceC174C619C9767 |
| Forwarder            | 0x7397B6F34f379851F719Da71f471cb3a1449b9D7 |
| TransparentForwarder | 0x909768DcB762aEce5EeE34f2c6202a2a1250d03b |
| Staking              | 0xcdb0C411157E43eA9393c5B308F339ca56a5fF56 |

### BNB Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xEFe451aA02919b982B57d546d0D927cFd9C6631C |
| Forwarder            | 0x490d8a210F9230E4A05919a1B1aF052910761108 |
| TransparentForwarder | 0x35a08bE1C8Ae3D084d621f31622dFEB32c049Ef7 |
| Staking              | 0x1a062C28715D521d7350E5f2F98766B899CCEae9 |

### XDC Testnet (Apothem)

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xC9bDA24cC58e2943990faf9777122c810BdD53ca |
| Forwarder            | 0xbcA05CeC204Cc5F75376822f06EDA095Fd229Ab7 |
| TransparentForwarder | 0x35D21a413bf8130b9AD502a78BA06aEBDabfEDF2 |
| Staking              | 0xa3cB400aA765D940dF6b7E0DaebE162Bf2E6E872 |

### opBNB Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x6aC4BbACE4E38B085BA82bDA5477cc85222C2B40 |
| Forwarder            | 0x39D4B78bb09DEEC54fA2df729808b19962Cb9aae |
| TransparentForwarder | 0x7B8BF9a0B648Dd9f75D5E9e8a3054D18E8C4Cc5e |
| Staking              | 0x432bDa6F3E5148898929be9d3555Ca5AA82b214b |

### Polygon zkEVM Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xefd17141D9F111d3bdEe2Df4C7D8C25f2e3B9b0e |
| Forwarder            | 0x4eEc8381422F789C70Af20148fF4F7454b3339BF |
| TransparentForwarder | 0xB95106C045D7d8FD5D14EDfe0D3ED48cd79cc844 |
| Staking              | 0x3BD72F106d94F3c5c96C5F49F89158cCf7C066DE |

### Meter Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x4Bd8F4f280E6a7e08A79A7f1bd7424EB7c066D94 |
| Forwarder            | 0x75f42f6fcc39A5FfAF3Ec8582591cE301A7487b1 |
| TransparentForwarder | 0xF6bb487AA9Ea62e94B8737fA5c1B45835066499a |
| Staking              | 0x91732f7865397ebc66B351D1f645CAe47BC0836f |

### Sepolia Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xeDB19c562B3ae337478A14dADe046a4967c645ac |
| Forwarder            | 0xe6cFE544A48Fa49AfCe6eAE36e5007a39E12DCdf |
| TransparentForwarder | 0x8cE69db7CA670A22073199C2934FAbC72084a3BC |
| Staking              | 0x8246Fc36CB2BB9931AdC9F613B6761C65D6EBe32 |

### OP Sepolia Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x2A4D7e51CFDF8eF2258F15025C7301c1549F1271 |
| Forwarder            | 0xBf6FAE25dd4af2927E4139107a2A5A98C6b94eC7 |
| TransparentForwarder | 0x8233Ff76BAa2B270f728a22061E2E0574AA4D2ef |
| Staking              | 0xA21Ce507E2a636Ed3fcEd017DAD68B1CE2BcA1D1 |

### Base Sepolia Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x72f8aa0901732e251d02381e76506a226e3394b8 |
| Forwarder            | 0xc8039f52ad8c4e5159e22cd6b9ac06cf6ba31bc7 |
| TransparentForwarder | 0x8a666910eb0f0cdbd66e974fd79b52c1050520fc |
| Staking              | 0x99ffef43ab37fb70e75ea40054fde33c6c386256 |

### Arbitrum Sepolia Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x573B1FCc3B8e76ED180dF25695bAb151e0869d56 |
| Forwarder            | 0x1dDeB6B67957Ed521E64E899Be4413287E4B1726 |
| TransparentForwarder | 0xc97d1D3EF35b6Aeec14B287F4E282A63c546Bbc6 |
| Staking              | 0x76E1B5Fc3807c2E3433A0e2a9274485Ff4033d46 |

<!-- ### Mantle Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 |
| Forwarder            | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking              | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF | -->

### Linea Goerli Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x67d1285434D6777Df76e4C94A6802dB3F5AE7113 |
| Forwarder            | 0x63AFD59bBC8e153D6aF220E3c1FB4d08bB4f6e97 |
| TransparentForwarder | 0x5243836FB4365ceBaf7e984f28F7491E254c911e |
| Staking              | 0x64AC2aFC413cc404BD93E425A21905AA1145efd3 |

### Scroll Sepolia Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0x59d5fFc88f33154B6871BB94eB5f6DC4f6fa21Db |
| Forwarder            | 0x5c881723743c48ed3619bc635f10BC7856be3C08 |
| TransparentForwarder | 0xc40ce22f6aF1Cd3A8673De9e19C6e456DC762eB4 |
| Staking              | 0xefd17141D9F111d3bdEe2Df4C7D8C25f2e3B9b0e |

### Blast Sepolia Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 |
| Forwarder            | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking              | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |

### Fraxtal Holesky Testnet

| Contract             | Address                                    |
| -------------------- | ------------------------------------------ |
| ResultManager        | 0xFEb70E7Ad36b425b698184B3d5b1F856c8132a42 |
| Forwarder            | 0xa26232204879C4370806cA56F821b9fe97eAeF5B |
| TransparentForwarder | 0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84 |
| Staking              | 0x03bD73afB6d3C5B86578010C099E5474aF1aABeF |

### Mode Sepolia Testnet

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

- Refer to **ENV** for required details **(NETWORK, DEPLOYER_ADDRESS, SIGNER_ADDRESS)**

**Important**:
The following needs to be run before deploying contracts with forge. (prepend the deployment command)

```bash
npm run validate
```

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
- use `--slow` flag to wait for txn receipt before next txn

### 3. Raise a Pull Request (PR)

- Commit and push your changes.
- Raise a PR against the original repository.
- Describe your changes and wait for review.
