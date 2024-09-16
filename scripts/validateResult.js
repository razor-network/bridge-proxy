const { ethers } = require("hardhat");
const abi = require("./TransparentForwarder.json");

async function main() {
  // Replace with your contract's ABI

  // Replace with your contract's address
  const contractAddress = "0xa27a80D473a688A75469cb7Ef3bBDf1d250A5003";
  const privateKey = process.env.TESTNET_DEPLOYER_KEY;

  // Replace with your _data value
  const data = "0x05fbf253e685bbe2de2b28b995d65e201e51fe0a72bd99bddd87b84d98d0b30900000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000259102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160000000000000000000000000000000000000000000000000000000000004f7a30000000000000000000000000000000000000000000000000000000066a364fb00000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000001bf2c3c06061b6a7c6a576269f9263eea0584ef481c8240cad0529a241e6faa9d0000000000000000000000000000000000000000000000000000000000000041903310afa23a0069d70a5086e8ed731eebc21c99f022aa2705b71dea931341c1025089ca1d0b940f3428d07590b67b60ac70aa2523fc31b6098bfc1652c2ec4d1b00000000000000000000000000000000000000000000000000000000000000";
  // Get the provider and signer (Assuming you have a local node or network configured in Hardhat)
  const provider = new ethers.providers.JsonRpcProvider("https://mainnet.skalenodes.com/v1/green-giddy-denebola");
  const wallet = new ethers.Wallet(privateKey, provider);

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  // Call the validateResult function
  try {
    // const response  = await contract.updateAndGetResult(data, { gasLimit: 30000000 });
    // await response.wait();
    // console.log(response);

    const response = await contract.validateResult(data);
    console.log("Transaction Response:", response);
      console.log("Decoded Result:", response);

    // Convert BigNumber values to strings for readability
    const success = response[0];
    const uintValue1 = response[1];
    const intValue = response[2];
    const uintValue2 = response[3];
    console.log("Success:", success);
    console.log("Value :", Number(uintValue1));
    console.log("Power :", intValue);
    console.log("Timestamp :", Number(uintValue2));


    // const response = await contract.getResult("0x59102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160");
    // console.log("Transaction Response:", response);

    // // Convert BigNumber values to strings for readability
    // const uintValue1 = Number(response[0]);
    // const intValue = response[1];
    // const uintValue2 = Number(response[2]);
    // console.log("Uint256 Value 1:", uintValue1);
    // console.log("Int8:", intValue);
    // console.log("Uint256 Timestamp 2:", uintValue2);
  } catch (error) {
    console.error("Error calling validateResult:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
