require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-abi-exporter");
require("solidity-coverage");
require("@nomicfoundation/hardhat-ledger");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */

const { RINKEBY_RPC } = process.env;

module.exports = {
  solidity: "0.8.9",
  networks: {
    sChainLocal: {
      url: "http://localhost:15000",
      accounts: [
        "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
        "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
      ],
    },
    ethereum: {
      chainId: 1,
      url: "https://eth-mainnet.g.alchemy.com/v2/Dfl1-TVt6OKlnbADGvHTSRJBbrXEPeYG",
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
    },
    calypsoMainnet: {
      chainId: 1564830818,
      url: "https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague",
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000, // this is important, because otherwise the request can time out before you've reviewed and confirmed your transaction on the Ledger
    },
    nebulaMainnet: {
      chainId: 1482601649,
      url: "https://mainnet.skalenodes.com/v1/green-giddy-denebola",
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
    },
    titanMainnet: {
      chainId: 1350216234,
      url: "https://mainnet.skalenodes.com/v1/parallel-stormy-spica",
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
    },
    europaMainnet: {
      chainId: 2046399126,
      url: "https://mainnet.skalenodes.com/v1/elated-tan-skat",
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
    },
    polygon: {
      chainId: 137,
      url: "https://rpc.ankr.com/polygon",
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
    },
    moonbeam: {
      chainId: 1284,
      url: "https://rpc.api.moonbeam.network", 
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
    },
    meter: {
      chainId: 82,
      url: "https://rpc.meter.io", 
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
    },
    zksyncEra: {
      chainId: 324,
      url: "https://mainnet.era.zksync.io", 
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
    },
    canto: {
      chainId: 7700,
      url: "http://127.0.0.1:1248", 
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
    },
    BNBMainnet: {
      chainId: 56,
      url: "https://bsc-dataseed4.bnbchain.org", 
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
      },
    opBNBMainnet: {
      chainId: 204,
      url: "https://opbnb-mainnet-rpc.bnbchain.org	", 
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
    },
    polygonZkEvmMainnet: {
      chainId: 1101,
      url: "https://polygonzkevm-mainnet.g.alchemy.com/v2/qPs1m6q-HNpDjUn_A10pYNjssZuWIVnq", 
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
      },
    xdcMainnet: {
      chainId: 50,
      url: "https://rpc.xinfin.network/", 
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
    },
    optimism: {
      chainId: 10,
      url: "https://mainnet.optimism.io", 
      ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
      timeout: 600000,
    },
    arbitrumOne: {
        chainId: 42161,
        url: "https://arb1.arbitrum.io/rpc", 
        ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
        timeout: 600000,
      },
      base: {
        chainId: 8453,
        url: "https://mainnet.base.org", 
        ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
        timeout: 600000,
      },
      linea: {
        chainId: 59144,
        url: "https://rpc.linea.build", 
        ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
        timeout: 600000,
      },
      scroll: {
        chainId: 534352,
        url: "https://rpc.scroll.io/", 
        ledgerAccounts: [
        "0xB32A48c1FC59A9954617D8B22c72f509E985a852", // specify Ledger Address here (required) ADMIN ADDRESS
      ],
        timeout: 600000,
      },
    //Testnets
    europaTestnet: {
        chainId: 476158412,
        url: "https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      calypsoTestnet: {
        chainId: 344106930,
        url: "https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
    xdcTestnet: {
      chainId: 51,
      url: "https://erpc.apothem.network",
      accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 600000,
    },
    BNBTestnet: {
      chainId: 97,
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 600000,
    },
    opBNBTestnet: {
      chainId: 5611,
      url: "https://opbnb-testnet-rpc.bnbchain.org",
      accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 600000,
    },
    polygonZkEvmTestnet: {
        chainId: 1442,
        url: "https://rpc.public.zkevm-test.net",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
    mumbai: {
        chainId: 80001,
        url: "https://rpc-mumbai.maticvigil.com",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
    },
    meterTestnet: {
        chainId: 83,
        url: "https://rpctest.meter.io",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
    },
    zksyncEraTestnet: {
      chainId: 280,
      url: "https://testnet.era.zksync.dev",
      accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 600000,
     },
     moonbaseAlpha: {
      chainId: 1287,
      url: "https://rpc.api.moonbase.moonbeam.network",
      accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 600000,
     },
     cantoTestnet: {
      chainID: 7701,
      url: "https://canto-testnet.plexnode.wtf",
      accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 600000,
     },
     sepolia: {
        chainId: 11155111,
        url: "https://ethereum-sepolia.publicnode.com",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      opSepolia: {
        chainId: 11155420,
        url: "https://sepolia.optimism.io",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      baseSepolia: {
        chainId: 84532,
        url: "https://sepolia.base.org",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      arbitrumSepolia: {
        chainId: 421614,
        url: "https://sepolia-rollup.arbitrum.io/rpc",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      mantleTestnet: {
        chainId: 5001,
        url: "https://rpc.testnet.mantle.xyz",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      lineaGoerli: {
        chainId: 59140,
        url: "https://rpc.goerli.linea.build",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      scrollSepolia: {
        chainId: 534351,
        url: "https://sepolia-rpc.scroll.io",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      }
    },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true, // Colors on terminal corrupts the output.
    currency: "USD",
  },
};
