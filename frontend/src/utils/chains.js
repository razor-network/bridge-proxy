import { config } from "./config";

export const sCalypsoTestnet = {
  id: 344106930,
  name: "staging-utter-unripe-menkar",
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
  name: "staging-legal-crazy-castor",
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
  [zkSyncTestnet.id]: config.RESULT_MANAGER_ADDRESS_ZKSYNC,
  [polygonMumbai.id]: config.RESULT_MANAGER_ADDRESS_POLYGON_MUMBAI,
  [moonbaseAlpha.id]: config.RESULT_MANAGER_ADDRESS_MOONBASE_ALPHA,
  [sCalypsoTestnet.id]: config.RESULT_MANAGER_ADDRESS_CALYPSO_TESTNET,
  [sEuropaTestnet.id]: config.RESULT_MANAGER_ADDRESS_EUROPA_TESTNET,
};
