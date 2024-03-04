const hre = require("hardhat");

async function checkTimeDifference() {
  const ORACLE_RPC_URL = "https://mainnet.skalenodes.com/v1/turbulent-unique-scheat"

  // Initialize providers
  const oracleProvider = new hre.ethers.providers.JsonRpcProvider(ORACLE_RPC_URL);

  // Fetch latest block from the oracle chain
  const oracleBlock = await oracleProvider.getBlock("latest");
  const oracleTimestamp = oracleBlock.timestamp;
  console.log(`Oracle Chain Latest Block Timestamp: ${oracleTimestamp}`);

  // Fetch latest block from the deploying chain
  const deployingBlock = await hre.ethers.provider.getBlock("latest");
  const deployingTimestamp = deployingBlock.timestamp;
  console.log(`Deploying Chain Latest Block Timestamp: ${deployingTimestamp}`);

  if (typeof deployingTimestamp === 'string' && deployingTimestamp.startsWith('0x')) {
    throw new Error('Reverting: Deploying chain timestamp is in hexadecimal format.');
  }

  const timeDifference = deployingTimestamp - oracleTimestamp;
  console.log(`Time difference (Deploying Chain - Native Chain) in seconds: ${timeDifference}`);

  if (Math.abs(timeDifference) <= 15) {
    console.log('Success: The time difference is within ±15 seconds.');
  } else {
    throw new Error('Error: The time difference is more than ±15 seconds.');
  }
}

async function main() {
  try {
    await checkTimeDifference();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

// Detect if the script is being run directly by Node.js
if (require.main === module) {
  main();
}

module.exports = { checkTimeDifference };

