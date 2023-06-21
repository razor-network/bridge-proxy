const axios = require("axios");
const fs = require("fs");

const ethGasApi = "https://ethgasstation.info/api/ethgasAPI";
const ethPriceApi = "https://api.gemini.com/v1/pubticker/ethusd";
const maticGasApi = "https://gasstation.polygon.technology/v2";
const maticPriceApi = "https://api.gemini.com/v1/pubticker/maticusd";

const getFileData = () => {
  try {
    const content = fs.readFileSync("./gas-report.txt");
    return content.toString();
  } catch (error) {
    console.log("Error occured while reading content of gas-report.txt file");
  }
};

const getGasCost = () => {
  const gasReportContent = getFileData();
  const lines = gasReportContent.split("\n");
  let gasCost;

  lines.forEach((line) => {
    if (line.indexOf("setBlock") > 0) {
      const avgGasCost = line.split("·")[4];
      gasCost = Number(avgGasCost);
      return;
    }
  });
  return gasCost;
};

const main = async () => {
  const gasCost = getGasCost();
  console.log(`Gas consumption of setBlock is ${gasCost}`);

  if (gasCost && gasCost > 0) {
    // * Ethereum
    // console.log("----------------- ETHEREUM ------------------------");
    // let ethGasPrice = await axios.get(ethGasApi);
    // ethGasPrice = Number(ethGasPrice.data.average) / 10;
    // let ethPrice = await axios.get(ethPriceApi);
    // ethPrice = Number(ethPrice.data.last);

    // console.log("Gas price in Gwei on Ethereum:", ethGasPrice);
    // console.log("Eth price in USD:", ethPrice);

    // const costOnEthereum =
    //   Math.floor(((ethPrice * ethGasPrice * gasCost) / 1e9) * 100) / 100;
    // console.log(`cost of setBlock on Ethereum is $${costOnEthereum}`);
    // console.log(`cost per day if epoch = 20min: $${costOnEthereum * 3 * 24}`);

    // * Polygon
    console.log("\n----------------- POLYGON -------------------------");
    let maticGasPrice = await axios.get(maticGasApi);
    maticGasPrice = Number(maticGasPrice.data.standard.maxFee);
    let maticPrice = await axios.get(maticPriceApi);
    maticPrice = Number(maticPrice.data.last);

    console.log("Gas price in Gwei on Polygon:", maticGasPrice);
    console.log("Polygon price in USD:", maticPrice);

    const costOnMatic =
      Math.floor(((maticPrice * maticGasPrice * gasCost) / 1e9) * 100) / 100;
    console.log(`cost of setBlock on Polygon is $${costOnMatic}`);
    console.log(`cost per day if epoch = 20min: $${costOnMatic * 3 * 24}`);
  }
};

main();
