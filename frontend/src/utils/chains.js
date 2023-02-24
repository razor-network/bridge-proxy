import { config } from "./config";

export const sCalypsoMainnet = {
  id: 1564830818,
  name: "Calypso Mainnet",
  network: "Honorable steel rasalhague",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5691.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "sFUEL",
    symbol: "sFUEL",
  },
  rpcUrls: {
    default: "https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague",
  },
  blockExplorers: {
    default: {
      name: "Honorable steel rasalhague",
      url: "https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com/",
    },
  },
  testnet: false,
};

export const sNebulaMainnet = {
  id: 1482601649,
  name: "Nebula Mainnet",
  network: "Green giddy denebola",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5691.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "sFUEL",
    symbol: "sFUEL",
  },
  rpcUrls: {
    default: "https://mainnet.skalenodes.com/v1/green-giddy-denebola",
  },
  blockExplorers: {
    default: {
      name: "Honorable steel rasalhague",
      url: "https://green-giddy-denebola.explorer.mainnet.skalenodes.com/",
    },
  },
  testnet: false,
};

export const sCalypsoTestnet = {
  id: 344106930,
  name: "Calypso Testnet",
  network: "Staging utter unripe menkar",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5691.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "sFUEL",
    symbol: "sFUEL",
  },
  rpcUrls: {
    default: "https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar",
  },
  blockExplorers: {
    default: {
      name: "Staging utter unripe menkar",
      url: "https://staging-utter-unripe-menkar.explorer.staging-v3.skalenodes.com/",
    },
  },
  testnet: true,
};

export const sEuropaTestnet = {
  id: 476158412,
  name: "Europa Testnet",
  network: "Staging legal crazy castor",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5691.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "sFUEL",
    symbol: "sFUEL",
  },
  rpcUrls: {
    default: "https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor",
  },
  blockExplorers: {
    default: {
      name: "Staging legal crazy castor",
      url: "https://staging-legal-crazy-castor.explorer.staging-v3.skalenodes.com/",
    },
  },
  testnet: true,
};

export const polygonMumbai = {
  id: 80001,
  name: "Polygon Mumbai",
  network: "Polygon Mumbai",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    default: "https://rpc-mumbai.maticvigil.com",
  },
  blockExplorers: {
    default: {
      name: "Polygon Mumbai",
      url: "https://mumbai.polygonscan.com/",
    },
  },
  testnet: true,
};

export const moonbaseAlpha = {
  id: 1287,
  name: "Moonbase Alpha",
  network: "Moonbase Alpha",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/6836.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "DEV",
    symbol: "DEV",
  },
  rpcUrls: {
    default: "https://rpc.api.moonbase.moonbeam.network",
  },
  blockExplorers: {
    default: {
      name: "Moonbase Alpha",
      url: "https://mumbai.polygonscan.com/",
    },
  },
  testnet: true,
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
  [sCalypsoMainnet.id]: config.RESULT_MANAGER_ADDRESS_CALYPSO_MAINNET,
  [sNebulaMainnet.id]: config.RESULT_MANAGER_ADDRESS_NEBULA_MAINNET,
  [zkSyncTestnet.id]: config.RESULT_MANAGER_ADDRESS_ZKSYNC,
  [polygonMumbai.id]: config.RESULT_MANAGER_ADDRESS_POLYGON_MUMBAI,
  [moonbaseAlpha.id]: config.RESULT_MANAGER_ADDRESS_MOONBASE_ALPHA,
  [sCalypsoTestnet.id]: config.RESULT_MANAGER_ADDRESS_CALYPSO_TESTNET,
  [sEuropaTestnet.id]: config.RESULT_MANAGER_ADDRESS_EUROPA_TESTNET,
};

export const mainnetChains = [sCalypsoMainnet, sNebulaMainnet];

export const testnetChains = [
  sCalypsoTestnet,
  sEuropaTestnet,
  polygonMumbai,
  moonbaseAlpha,
  zkSyncTestnet,
];

export const supportedChains =
  import.meta.env.VITE_CHAIN === "mainnet" ? mainnetChains : testnetChains;
