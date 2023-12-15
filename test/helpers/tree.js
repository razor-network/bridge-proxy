const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");
const { ethers } = require("hardhat");

const power = [2, 2, 2, 2, 5];
const ids = [1, 2, 3, 4, 5];
const namesHash = [
  "0x1bbf634c3ad0a99dd58667a617f7773ccb7f37901afa8e9ea1e32212bddb83c9",
  "0x60f80af122a08d5feb55b4bc442814adfa75e095370d49d5657c23adf1efcf23",
  "0xf4f695ea9b25bb19437503d3494e8b744124bfef02c8221e6be4bce31a8ef3c0",
  "0xa6ace279d909674e37f74fbb3052afa3e05bfdf6ce343c254e31a0606a1928f9",
  "0x0f5e947b204a798dd86405ac2f21fed0d109e748bcd057b913eb87b6ffe07c3e",
];
const result = [12122, 212121, 21212, 212, 21];

const abiCoder = new ethers.utils.AbiCoder();

const timestamp = Math.floor(Date.now() / 1000);
const timestampBN = ethers.BigNumber.from(timestamp);

const getValues = () => {
  let values = [];
  for (let i = 0; i < ids.length; i++) {
    const value = ethers.BigNumber.from(result[i]);
    const collectionResult = abiCoder.encode(
      ["int8", "uint16", "bytes32", "uint256", "uint256"],
      [power[i], ids[i], namesHash[i], value, timestampBN]
    );
    values.push([collectionResult]);
  }
  return values;
};

const generateTree = () => {
  const values = getValues();
  const tree = StandardMerkleTree.of(values, ["bytes"]);
  console.log("Merkle Root:", tree.root);
  fs.writeFileSync("merkle-tree.json", JSON.stringify(tree.dump()));
  return tree;
};

const getProof = async (tree, id, signer) => {
  for (const [i, v] of tree.entries()) {
    const proof = tree.getProof(i);
    const resultDecoded = abiCoder.decode(
      [
        "int8 power",
        "uint16 id",
        "bytes32 nameHash",
        "uint256 result",
        "uint256 timestamp",
      ],
      v[0]
    );
    if (resultDecoded.id === id) {
      const messageHash = ethers.utils.keccak256(
        ethers.utils.concat([tree.root, v[0]])
      );
      const signature = await signer.signMessage(
        ethers.utils.arrayify(messageHash)
      );
      const resultDecoded = abiCoder.decode(
        ["int8", "uint16", "bytes32", "uint256", "uint256"],
        v[0]
      );
      return [proof, resultDecoded, signature];
    }
  }
};

module.exports = { getValues, generateTree, getProof };
