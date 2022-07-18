const hre = require("hardhat");
// const DELEGATOR_ADDRESS = "0xEe0F436708677c399466Fd61179f8D9864999903";

// const destinationChainHash =
//   "0x8d646f556e5d9d6f1edcf7a39b77f5ac253776eb34efcfd688aacbee518efc26";

// const proxySchainAddress = "0x7138c235AFd7F38cE7224CEd2C2D80e2ea5ea490";

// const RESULT_PROXY_ADDRESS = "0x7138c235AFd7F38cE7224CEd2C2D80e2ea5ea490";

// const RESULT_HANDLER_ADDRESS = "0xC5888275e0a1ca13a26463318105957aa4d1feD7";

const MAINNET_RESULT_HANDLER_CONTRACT_ADDRESS =
  "0x87B6a0ab90d826189cC004Dc2ff16E2b472309db";

const SCHAIN_RESULT_PROXY_ADDRESS =
  "0x71c5C2a006F933C4D11B887De89524f62d92E8B0";

async function main() {
  const ResultProxy = await hre.ethers.getContractFactory("ResultProxy");
  const resultProxy = ResultProxy.attach(SCHAIN_RESULT_PROXY_ADDRESS);

  const tx = await resultProxy.updateResultHandlerAddress(
    MAINNET_RESULT_HANDLER_CONTRACT_ADDRESS
  );
  console.log("tx");
  console.log(tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
