import { Button, Heading, Tooltip, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { useEffect } from "react";
import { useAccount, useSigner } from "wagmi";

import ResultHandler from "../abis/ResultHandler.json";
import { config } from "../utils/config";
import { dummyTableData } from "../utils/data";
import ResultTable from "./ResultTable";

const Result = () => {
  const account = useAccount();
  const { data: signer } = useSigner();
  const [collectionsData, setCollectionsData] = useState(dummyTableData);
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState(0);

  const fetchAllResult = async () => {
    console.log("Fetching collection result");
    const data = [];

    try {
      const contract = new ethers.Contract(
        config.RESULT_HANDLER_ADDRESS,
        ResultHandler.abi,
        signer
      );
      const collectionsResult = await contract.getAllResult();
      const [collectionIds, results, power, timestamp] = collectionsResult;

      for (let i = 0; i < collectionIds.length; i++) {
        data.push({
          id: collectionIds[i],
          result: results[i].toNumber(),
          power: power[i],
        });
      }
      setLastUpdatedTimestamp(timestamp.toNumber());
      setCollectionsData(data);
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
