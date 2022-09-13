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

export const rinkebyMainnet = {
  id: 4,
  name: "Rinkeby",
  network: "Rinkeby",
  iconUrl: "https://d33wubrfki0l68.cloudfront.net/f9bf7321ed7d9045fac8e374993c9420fe730b45/121d3/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png",
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
