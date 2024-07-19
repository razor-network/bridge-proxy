const { ethers } = require("hardhat");
const abi = require("./TransparentForwarder.json");

async function main() {
  // Replace with your contract's ABI

  // Replace with your contract's address
  const contractAddress = "0xD910E832ead086314409D56ECD3D2dB1256CfF58";
  const privateKey = process.env.TESTNET_DEPLOYER_KEY;

  // Replace with your _data value
  const data = "0xcdf9ab9f5bb7631f812b6ba5f8bbe1053589060a13aae11c802e00553c4c565400000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000259102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e873428171600000000000000000000000000000000000000000000000000000000000052417000000000000000000000000000000000000000000000000000000006679304d00000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000001121342e1ee18563ecb29b769cdc592567969113c02408c2ab64172331f39299e0000000000000000000000000000000000000000000000000000000000000041a62420b72d2473f1e35a5cbaf4a598148b5c75094bee3b7e748657a2911c13e22f2d2641f44533d252d199dd92d59da976eeeec538db0ce8db7f322451baf7761c00000000000000000000000000000000000000000000000000000000000000";
  // Get the provider and signer (Assuming you have a local node or network configured in Hardhat)
  const provider = new ethers.providers.JsonRpcProvider("https://mainnet.skalenodes.com/v1/green-giddy-denebola");
  const wallet = new ethers.Wallet(privateKey, provider);

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  // Call the validateResult function
  try {
    const response  = await contract.updateAndGetResult(data, { gasLimit: 30000000 });
    await response.wait();
    console.log(response);

    // const response = await contract.validateResult(data, { gasLimit: 30000000 });
    // console.log("Transaction Response:", response);
    // const result = ethers.utils.defaultAbiCoder.decode(
    //     ["bool","uint256", "int8", "uint256"],
    //     response.data
    //   );
    //   console.log(result);
    //   console.log("Decoded Result:", result);

    // // Convert BigNumber values to strings for readability
    // const success = result[0];
    // const uintValue1 = Number(result[1]);
    // const intValue = result[2];
    // const uintValue2 = Number(result[3]);
    // console.log("Success:", success);
    // console.log("Uint256 Value 1:", uintValue1);
    // console.log("Int8 Value:", intValue);
    // console.log("Uint256 Value 2:", uintValue2);


    // const response = await contract.getResult("0x59102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160");
    // console.log("Transaction Response:", response);
    // const result = ethers.utils.defaultAbiCoder.decode(
    //     ["uint256", "int8", "uint256"],
    //     response.data
    //   );
    //   console.log(result);
    //   console.log("Decoded Result:", result);

    // // Convert BigNumber values to strings for readability
    // const uintValue1 = Number(result[0]);
    // const intValue = result[1];
    // const uintValue2 = Number(result[2]);
    // console.log("Uint256 Value 1:", uintValue1);
    // console.log("Int8 Value:", intValue);
    // console.log("Uint256 Value 2:", uintValue2);
  } catch (error) {
    console.error("Error calling validateResult:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
