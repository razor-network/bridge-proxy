const ethers = require("ethers");

const RESULT_HANDLER_ADDRESS = "0xB0F974464eA9BbB2adA6a08B0AB226Cbc57F7261";
const provider = ethers.providers.getDefaultProvider(
  "https://staging-v2.skalenodes.com/v1/whispering-turais/"
);
const ResultHandler = require("./artifacts/contracts/ResultHandler.sol/ResultHandler.json");
const privateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(privateKey, provider);

const fetchData = async () => {
  const contract = new ethers.Contract(
    RESULT_HANDLER_ADDRESS,
    ResultHandler.abi,
    wallet
  );

  for (let i = 1; i <= 5; i++) {
    const result = await contract.getResult(i);
    console.log(
      `CollectionID: ${i}\t Result: ${result[0].toNumber()}\t Power: ${
        result[1]
      }`
    );
  }
};

fetchData();
