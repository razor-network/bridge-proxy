import { Button, Heading, Tooltip, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { useEffect } from "react";
import { useAccount, useSigner, useNetwork } from "wagmi";

import ResultHandler from "../abis/ResultHandler.json";
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
      if (currentChain?.id === 1211818568165862) {
        setBlocks(null);
        const contract = new ethers.Contract(
          config.RESULT_HANDLER_ADDRESS_SCHAINV3,
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
      } else if (currentChain?.id === 4) {
        setBlocks(null);
        const contract = new ethers.Contract(
          config.RESULT_HANDLER_ADDRESS_RINKEBY,
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
      } else if (currentChain?.id === 280) {
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
      } else if (currentChain?.id === 132333505628089) {
        const contract = new ethers.Contract(
          config.RESULT_MANAGER_ADDRESS_SCHAINV2,
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

        const lastRequestId = await contract.lastRequestId();
        let numBlocks = 10;
        let baseRequestId =
          lastRequestId - numBlocks >= 1 ? lastRequestId - numBlocks : 1;
        let blocksData = [];
        for (let i = lastRequestId; i > baseRequestId; i--) {
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
    </VStack>
  );
};

export default Result;
