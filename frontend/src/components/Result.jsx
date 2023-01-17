import { Button, Heading, Tooltip, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { useEffect } from "react";
import { useAccount, useSigner, useNetwork } from "wagmi";

import ResultHandler from "../abis/ResultHandler.json";
import ResultManagerABI from "../abis/ResultManager.json";
import {
  chainContracts,
  moonbaseAlpha,
  polygonMumbai,
  sCalypsoTestnet,
} from "../utils/chains";
import { config } from "../utils/config";
import { dummyTableData } from "../utils/data";
import BlocksTable from "./BlocksTable";
import ResultTable from "./ResultTable";

const Result = () => {
  const account = useAccount();
  const { data: signer } = useSigner();
  const [collectionsData, setCollectionsData] = useState(dummyTableData);
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState(0);
  const [blocks, setBlocks] = useState(null);
  const { chain: currentChain } = useNetwork();

  const fetchAllResult = async () => {
    console.log("Fetching collection result");
    const data = [];

    try {
      if (currentChain?.id === 280) {
        setBlocks(null);
        const contract = new ethers.Contract(
          config.RESULT_HANDLER_ADDRESS_ZKSYNC,
          ResultHandler.abi,
          signer
        );

        const activeCollectionIds = await contract.getActiveCollections();

        for (let i = 0; i < activeCollectionIds.length; i++) {
          const result = await contract.getResultFromID(activeCollectionIds[i]);
          data.push({
            id: activeCollectionIds[i],
            result: result[0].toNumber(),
            power: result[1],
          });
        }
        const timestamp = await contract.lastUpdatedTimestamp();
        setLastUpdatedTimestamp(timestamp.toNumber());
        setCollectionsData(data);
      } else if (
        currentChain?.id === sCalypsoTestnet.id ||
        currentChain?.id === polygonMumbai.id ||
        currentChain?.id === moonbaseAlpha.id
      ) {
        setBlocks(null);
        let data = [];
        let resultManagerAddress = chainContracts[currentChain.id];
        const contract = new ethers.Contract(
          resultManagerAddress,
          ResultManagerABI,
          signer
        );

        const latestEpoch = await contract.latestEpoch();
        console.log({
          latestEpoch,
        });
        const timestamp = await contract.lastUpdatedTimestamp();
        setLastUpdatedTimestamp(timestamp.toNumber());

        // * Fetching data from last block
        const lastBlock = await contract.blocks(latestEpoch);
        const { message } = lastBlock;
        const abiCoder = new ethers.utils.AbiCoder();
        const [epoch, _, values] = abiCoder.decode(
          [
            "uint32",
            "uint256",
            "tuple[](int8 power, uint16 collectionId, bytes32 name, uint256 value)",
          ],
          message
        );
        let ids = values.map(({ collectionId }) => collectionId);
        let results = values.map(({ value }) => value.toNumber());
        let power = values.map(({ power }) => power);

        for (let i = 0; i < ids.length; i++) {
          data.push({
            id: ids[i],
            result: results[i],
            power: power[i],
          });
        }
        setCollectionsData(data);

        // * fetching last numBlocks data
        let numBlocks = 10;
        let baseRequestId =
          latestEpoch - numBlocks >= 1 ? latestEpoch - numBlocks : 1;
        let blocksData = [];
        for (let i = latestEpoch; i > baseRequestId; i--) {
          const block = await contract.blocks(i);
          blocksData.push({
            message: block.message,
            signature: block.signature,
          });
        }
        setBlocks(blocksData);
      }
    } catch (error) {
      console.log("error occured while fetching data");
      console.log(error);
    }
  };

  useEffect(() => {
    if (account.isConnected && account.address) {
      fetchAllResult();
    }
  }, [signer]);

  return (
    <VStack>
      <Heading size="2xl" mb="5">
        Razor collection result bridge
      </Heading>
      <ResultTable
        collectionsData={collectionsData}
        lastUpdatedTimestamp={lastUpdatedTimestamp}
      />
      <Tooltip
        shouldWrapChildren
        isDisabled={account.address}
        label="Please connect metamask to fetch result"
      >
        <Button
          colorScheme="teal"
          onClick={fetchAllResult}
          disabled={!account.address}
        >
          Fetch Result
        </Button>
      </Tooltip>
      <BlocksTable blocks={blocks} />
    </VStack>
  );
};

export default Result;
