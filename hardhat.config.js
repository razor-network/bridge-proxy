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
    ethereum: {
      chainId: 1,
    //   url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
      url: "https://eth.meowrpc.com",
      ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
      timeout: 600000,
    },
    calypsoMainnet: {
      chainId: 1564830818,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
    //   url: "https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague",
    //   ledgerAccounts: [
    //     process.env.DEPLOYER_ADDRESS, 
    //   ],
      timeout: 600000,
    },
    nebulaMainnet: {
      chainId: 1482601649,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
    //   url: "https://mainnet.skalenodes.com/v1/green-giddy-denebola",
    //   ledgerAccounts: [
    //     process.env.DEPLOYER_ADDRESS, 
    //   ],
      timeout: 600000,
    },
    titanMainnet: {
      chainId: 1350216234,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
    //   url: "https://mainnet.skalenodes.com/v1/parallel-stormy-spica",
    //   ledgerAccounts: [
    //     process.env.DEPLOYER_ADDRESS, 
    //   ],
      timeout: 600000,
    },
    europaMainnet: {
      chainId: 2046399126,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
    //   url: "https://mainnet.skalenodes.com/v1/elated-tan-skat",
    //   ledgerAccounts: [
    //     process.env.DEPLOYER_ADDRESS, 
    //   ],
      timeout: 600000,
    },
    polygon: {
      chainId: 137,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
    //   url: "https://1rpc.io/matic", 
    //   ledgerAccounts: [
    //     process.env.DEPLOYER_ADDRESS, 
    //   ],
      timeout: 600000,
    },
    moonbeam: {
      chainId: 1284,
    //url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
      url: "https://rpc.api.moonbeam.network", 
      ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
      timeout: 600000,
    },
    meter: {
      chainId: 82,
    //url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
      url: "https://rpc.meter.io", 
      ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
      timeout: 600000,
    },
    zksyncEra: {
      chainId: 324,
    //url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
      url: "https://mainnet.era.zksync.io", 
      ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
      timeout: 600000,
    },
    canto: {
      chainId: 7700,
      //url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
      url: "https://canto.slingshot.finance/", 
      ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
      timeout: 600000,
    },
    BNBMainnet: {
      chainId: 56,
      //url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
      url: "https://bsc-dataseed4.bnbchain.org", 
      ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
      timeout: 600000,
      },
    opBNBMainnet: {
      chainId: 204,
      //url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
      url: "https://opbnb-mainnet-rpc.bnbchain.org", 
      ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
      timeout: 600000,
    },
    polygonZkEvmMainnet: {
      chainId: 1101,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
    //   url: "https://polygon-zkevm-mainnet.public.blastapi.io	", 
    //   ledgerAccounts: [
    //     process.env.DEPLOYER_ADDRESS, 
    //   ],
      timeout: 600000,
      gasPrice: 3000000000
      },
    xdcMainnet: {
      chainId: 50,
    //   url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
      url: "https://erpc.xinfin.network", 
      ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
      timeout: 600000,
    },
    optimism: {
      chainId: 10,
    //   url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
      url: "https://mainnet.optimism.io", 
      ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
      timeout: 600000,
    },
    arbitrumOne: {
        chainId: 42161,
        // url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
        url: "https://arb1.arbitrum.io/rpc", 
        ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
        timeout: 600000,
      },
      base: {
        chainId: 8453,
        // url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
        url: "https://mainnet.base.org", 
        ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
        timeout: 600000,
      },
      linea: {
        chainId: 59144,
        // url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
        url: "https://rpc.linea.build", 
        ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
        timeout: 600000,
      },
      scroll: {
        chainId: 534352,
        // url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
        url: "https://rpc.scroll.io/", 
        ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
        timeout: 600000,
      },
      blast: {
        chainId: 81457,
        // url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
        url: "https://rpc.blast.io", 
        ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
        timeout: 600000,
      },
      gnosis: {
        chainId: 100,
        // url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
        url: "https://rpc.gnosischain.com", 
        ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
        timeout: 600000,
      },
      avalanche: {
        chainId: 43114,
        // url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
        url: "https://avax.meowrpc.com", 
        ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
        timeout: 600000,
      },
      conflux: {
        chainId: 1030,
        // url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
        url: "https://evm.confluxrpc.com", 
        ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
        timeout: 600000,
      },
      fraxtal: {
        chainId: 252,
        // url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
        url: "https://rpc.frax.com", 
        ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
        timeout: 600000,
      },
      mode: {
        chainId: 34443,
        // url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame,
        url: "https://mainnet.mode.network/", 
        ledgerAccounts: [
        process.env.DEPLOYER_ADDRESS, 
      ],
        timeout: 600000,
      },
    //Testnets
    confluxTestnet: {
        chainId: 71,
        url: "https://evmtestnet.confluxrpc.com",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      gnosisTestnet: {
        chainId: 10200,
        url: "https://rpc.chiadochain.net",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      avaxTestnet: {
        chainId: 43113,
        url: "https://api.avax-test.network/ext/C/rpc",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
    europaTestnet: {
        chainId: 1444673419,
        url: "https://testnet.skalenodes.com/v1/juicy-low-small-testnet",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      calypsoTestnet: {
        chainId: 974399131,
        url: "https://testnet.skalenodes.com/v1/giant-half-dual-testnet",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
    xdcTestnet: {
      chainId: 51,
      url: "https://erpc.apothem.network",
      accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 600000,
    },
    BNBTestnet: {
      chainId: 97,
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 600000,
    },
    opBNBTestnet: {
      chainId: 5611,
      url: "https://opbnb-testnet-rpc.bnbchain.org",
      accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 600000,
    },
    polygonZkEvmTestnet: {
        chainId: 1442,
        url: "https://rpc.public.zkevm-test.net",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
    mumbai: {
        chainId: 80001,
        url: "https://rpc-mumbai.maticvigil.com",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
    },
    meterTestnet: {
        chainId: 83,
        url: "https://rpctest.meter.io",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
    },
    zksyncEraTestnet: {
      chainId: 280,
      url: "https://testnet.era.zksync.dev",
      accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 600000,
     },
     moonbaseAlpha: {
      chainId: 1287,
      url: "https://rpc.api.moonbase.moonbeam.network",
      accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 600000,
     },
     cantoTestnet: {
      chainID: 7701,
      url: "https://canto-testnet.plexnode.wtf",
      accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 600000,
     },
     sepolia: {
        chainId: 11155111,
        url: "https://sepolia.gateway.tenderly.co",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      opSepolia: {
        chainId: 11155420,
        url: "https://sepolia.optimism.io",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      baseSepolia: {
        chainId: 84532,
        url: "https://sepolia.base.org",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      arbitrumSepolia: {
        chainId: 421614,
        url: "https://sepolia-rollup.arbitrum.io/rpc",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      mantleTestnet: {
        chainId: 5001,
        url: "https://rpc.testnet.mantle.xyz",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      lineaGoerli: {
        chainId: 59140,
        url: "https://rpc.goerli.linea.build",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      scrollSepolia: {
        chainId: 534351,
        url: "https://sepolia-rpc.scroll.io",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      blastSepolia: {
        chainId: 168587773,
        url: "https://sepolia.blast.io",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      fraxtalTestnet: {
        chainId: 2522,
        url: "https://rpc.testnet.frax.com",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
      modeTestnet: {
        chainId: 919,
        url: "https://sepolia.mode.network",
        accounts: [process.env.TESTNET_DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 600000,
      },
    },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true, // Colors on terminal corrupts the output.
    currency: "USD",
  },
};
