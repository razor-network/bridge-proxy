const hre = require("hardhat");

async function calculateGasPrice() {
  try {
    let gasPrice = await hre.ethers.provider.getGasPrice();
    console.log("Current gasPrice:", gasPrice.toString());
    gasPrice = gasPrice.mul(120).div(100); // 20% more than the current gas price 
    console.log("20% Higher used gasPrice", gasPrice.toString())
    return gasPrice.toString();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = { calculateGasPrice };

