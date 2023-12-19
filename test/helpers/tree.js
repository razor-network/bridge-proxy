const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");
const { ethers } = require("hardhat");

const abiCoder = new ethers.utils.AbiCoder();

const timestamp = Math.floor(Date.now() / 1000);
const timestampBN = ethers.BigNumber.from(timestamp);

const getValues = (power, ids, namesHash, result, timestamp) => {
  let values = [];
  for (let i = 0; i < ids.length; i++) {
    const value = ethers.BigNumber.from(result[i]);
    const collectionResult = abiCoder.encode(
      ["int8", "uint16", "bytes32", "uint256", "uint256"],
      [power[i], ids[i], namesHash[i], value, timestamp[i]]
    );
    values.push([collectionResult]);
  }
  return values;
};

const generateTree = (power, ids, namesHash, result, timestamp) => {
  const values = getValues(power, ids, namesHash, result, timestamp);
  const tree = StandardMerkleTree.of(values, ["bytes"]);
  console.log("Merkle Root:", tree.root);
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
