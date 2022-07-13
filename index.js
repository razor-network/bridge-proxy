const ethers = require("ethers");

const PROXY_ADDRESS = "0x59a667a6430CBcED19023a97c0A6faC758259Bfc";
const provider = ethers.providers.getDefaultProvider(
  "https://staging-v2.skalenodes.com/v1/whispering-turais/"
);
const ProxyABI = require("./artifacts/contracts/ResultProxy.sol/ResultProxy.json");
const privateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(privateKey, provider);

const fetchData = async () => {
  const contract = new ethers.Contract(PROXY_ADDRESS, ProxyABI.abi, wallet);

  const result = await contract.publishResult();
  console.log("result");
  console.log(result);

  // const salt = await contract.salt();
  // console.log(`salt: ${salt}`);
};

fetchData();
