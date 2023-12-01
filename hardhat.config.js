require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-abi-exporter");
require("solidity-coverage");
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
    sChainV2: {
      url: "https://staging-v2.skalenodes.com/v1/whispering-turais",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ],
    },
    sChainV3: {
      url: "https://staging-v2.skalenodes.com/v1/attractive-merope",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ],
    },
    rinkeby: {
      url: RINKEBY_RPC || "",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ],
    },
    calypsoMainnet: {
      chainId: 1564830818,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000, // this is important, because otherwise the request can time out before you've reviewed and confirmed your transaction on the Ledger
    },
    nebulaMainnet: {
      chainId: 1482601649,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
    titanMainnet: {
      chainId: 1350216234,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
    europaMainnet: {
      chainId: 2046399126,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
    polygon: {
      chainId: 137,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
    moonbeam: {
      chainId: 1284,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
    meter: {
      chainId: 82,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
    zksyncEra: {
      chainId: 324,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
    canto: {
      chainId: 7700,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
    BNBMainnet: {
      chainId: 56,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
      },
    opBNBMainnet: {
      chainId: 204,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
    polygonZkEvmMainnet: {
      chainId: 1101,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
      },
    xdcMainnet: {
      chainId: 50,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
    optimism: {
      chainId: 10,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
    arbitrumOne: {
        chainId: 42161,
        url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
        timeout: 60000,
      },
      base: {
        chainId: 8453,
        url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
        timeout: 60000,
      },
      linea: {
        chainId: 59144,
        url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
        timeout: 60000,
      },
      scroll: {
        chainId: 534352,
        url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
        timeout: 60000,
      },
    //Testnets
    europaTestnet: {
        chainId: 476158412,
        url: "https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 60000,
      },
      calypsoTestnet: {
        chainId: 344106930,
        url: "https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 60000,
      },
    xdcTestnet: {
      chainId: 51,
      url: "https://erpc.apothem.network",
      accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 60000,
    },
    BNBTestnet: {
      chainId: 97,
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 60000,
    },
    opBNBTestnet: {
      chainId: 5611,
      url: "https://opbnb-testnet-rpc.bnbchain.org",
      accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 60000,
    },
    polygonZkEvmTestnet: {
        chainId: 1442,
        url: "https://rpc.public.zkevm-test.net",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 60000,
      },
    mumbai: {
        chainId: 80001,
        url: "https://rpc-mumbai.maticvigil.com",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 60000,
    },
    meterTestnet: {
        chainId: 83,
        url: "https://rpctest.meter.io",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 60000,
    },
    zksyncEraTestnet: {
      chainId: 280,
      url: "https://zksync-era-testnet.blockpi.network/v1/rpc/public",
      accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 60000,
     },
     moonbaseAlpha: {
      chainId: 1287,
      url: "https://rpc.testnet.moonbeam.network",
      accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 60000,
     },
     cantoTestnet: {
      chainID: 7701,
      url: "https://canto-testnet.plexnode.wtf",
      accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      timeout: 60000,
     },
     sepolia: {
        chainId: 11155111,
        url: "https://ethereum-sepolia.publicnode.com",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 60000,
      },
      opSepolia: {
        chainId: 11155420,
        url: "https://sepolia.optimism.io",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 60000,
      },
      baseSepolia: {
        chainId: 84532,
        url: "https://sepolia.base.org",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 60000,
      },
      arbitrumSepolia: {
        chainId: 421614,
        url: "https://sepolia-rollup.arbitrum.io/rpc",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 60000,
      },
      mantleTestnet: {
        chainId: 5001,
        url: "https://rpc.testnet.mantle.xyz",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 60000,
      },
      lineaGoerli: {
        chainId: 59140,
        url: "https://rpc.goerli.linea.build",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 60000,
      },
      scrollSepolia: {
        chainId: 534351,
        url: "https://sepolia-rpc.scroll.io",
        accounts: [process.env.DEPLOYER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
        timeout: 60000,
      }
    },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true, // Colors on terminal corrupts the output.
    currency: "USD",
  },
};
