import { config } from "./config";

export const sChainAttractiveMerope = {
  id: 1211818568165862,
  name: "attractive-merope",
  network: "Skale Dappnet",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5691.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://staging-v2.skalenodes.com/v1/attractive-merope",
  },
  blockExplorers: {
    default: {
      name: "Attractive Merope",
      url: "https://attractive-merope.explorer.staging-v2.skalenodes.com/",
    },
  },
  testnet: false,
};

export const sChainWhisperingTurais = {
  id: 132333505628089,
  name: "whispering-turais",
  network: "Whispering Turais Schain",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5691.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://staging-v2.skalenodes.com/v1/whispering-turais",
  },
  blockExplorers: {
    default: {
      name: "Whispering Turais",
      url: "https://whispering-turais.explorer.staging-v2.skalenodes.com/",
    },
  },
  testnet: true,
};

export const sCalypsoTestnet = {
  id: 104734457,
  name: "actual-secret-cebalraie",
  network: "Actual Secret Cebalrai",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5691.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://staging-v2.skalenodes.com/v1/actual-secret-cebalrai",
  },
  blockExplorers: {
    default: {
      name: "Actual Secret Cebalrai",
      url: "https://actual-secret-cebalrai.explorer.staging-v2.skalenodes.com/",
    },
  },
  testnet: true,
};

export const rinkebyMainnet = {
  id: 4,
  name: "Rinkeby",
  network: "Rinkeby",
  iconUrl:
    "https://d33wubrfki0l68.cloudfront.net/f9bf7321ed7d9045fac8e374993c9420fe730b45/121d3/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: import.meta.env.VITE_RINKEBY_RPC,
  },
  blockExplorers: {
    default: {
      name: "Rinkeby",
      url: "https://rinkeby.etherscan.io/",
    },
  },
  testnet: false,
};

export const zkSyncTestnet = {
  id: 280,
  name: "zkSync",
  network: "zkSync alpha testnet",
  iconUrl:
    "https://ipfs.io/ipfs/QmX4kiKSy4bBB8PXqj8ZM8gNNmra3Xh1NshiaF5TRk5c2C",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://zksync2-testnet.zksync.dev",
  },
  blockExplorers: {
    default: {
      name: "zkSync explorer",
      url: "https://zksync2-testnet.zkscan.io/",
    },
  },
  testnet: false,
};

export const chainContracts = {
  [sChainAttractiveMerope.id]: config.RESULT_HANDLER_ADDRESS_SCHAINV3,
  [rinkebyMainnet.id]: config.RESULT_HANDLER_ADDRESS_RINKEBY,
  [zkSyncTestnet.id]: config.RESULT_HANDLER_ADDRESS_ZKSYNC,
  [sCalypsoTestnet.id]: config.RESULT_HANDLER_ADDRESS_CALYPSO_TESTNET,
  [sChainWhisperingTurais.id]: config.RESULT_MANAGER_ADDRESS_SCHAINV2,
};
