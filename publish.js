const ethers = require("ethers");

const PROXY_ADDRESS = "0x72ed6e892932c90cDF3c2FDC436d06db4aF23EEC";
const provider = ethers.providers.getDefaultProvider("http://localhost:15000");
const ProxyABI = require("./artifacts/contracts/ResultProxy.sol/ResultProxy.json");
const privateKey =
  "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e";
const wallet = new ethers.Wallet(privateKey, provider);

const destinationChainHash =
  "0x8d646f556e5d9d6f1edcf7a39b77f5ac253776eb34efcfd688aacbee518efc26";

const abi = ethers.utils.defaultAbiCoder;

const ids = [1, 2, 3, 4, 5];
const result = [12122, 212121, 21212, 212, 21];
const power = [2, 2, 2, 2, 5];

const encodedData = abi.encode(
  ["uint16[]", "uint256[]", "int8[]"],
  [ids, result, power]
);

const fetchData = async () => {
  const contract = new ethers.Contract(PROXY_ADDRESS, ProxyABI.abi, wallet);

  const result = await contract.publishResult(
    destinationChainHash,
    encodedData
  );
  await result.wait();
  console.log("result");
  console.log(result);
};

fetchData();
