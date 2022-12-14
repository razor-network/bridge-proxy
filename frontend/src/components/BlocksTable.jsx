import {
  VStack,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Box,
  Text,
  TableCaption,
  Tbody,
  Tag,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import moment from "moment";

const BlocksTable = ({ blocks }) => {
  const [blocksData, setBlocksData] = useState([]);
  const abiCoder = new ethers.utils.AbiCoder();

  useEffect(() => {
    if (blocks && blocks.length > 0) {
      let blocksData = [];
      blocks.map(({ message, signature }) => {
        const [epoch, requestId, timestamp, values] = abiCoder.decode(
          [
            "uint256",
            "uint32",
            "uint256",
            "tuple[](int8 power, uint16 collectionId, bytes32 name, uint256 value)",
          ],
          message
        );

        let ids = values.map(({ collectionId }) => collectionId);
        let results = values.map(({ value }) => value.toNumber());
        let power = values.map(({ power }) => power);

        blocksData.push({
          epoch: epoch.toNumber(),
          requestId,
          timestamp: timestamp.toNumber(),
          message,
          signature,
          ids,
          results,
          power,
        });
      });
      setBlocksData(blocksData);
    } else {
      setBlocksData([]);
    }
  }, [blocks]);

  return (
    <VStack>
      <Heading size="xl" mt="5">
        Last finalised blocks
      </Heading>

      <Box
        w="100%"
        h="auto"
        my="60px"
        borderRadius="10px"
        border="1px solid lightgrey"
        boxShadow="xl"
      >
        <TableContainer>
          <Table variant="simple" colorScheme="twitter">
            <TableCaption>All Finalized Blocks</TableCaption>
            <Thead>
              <Tr>
                <Th>Epoch</Th>
                <Th>Request Id</Th>
                <Th>Timestamp</Th>
                <Th>Collection Ids</Th>
                <Th>Values</Th>
                <Th>Power</Th>
                <Th>Signature</Th>
                <Th>MessageData</Th>
              </Tr>
            </Thead>
            <Tbody>
              {blocksData?.map((row, index) => {
                return (
                  <Tr key={index + 1}>
                    <Td>{row.epoch}</Td>
                    <Td>{row.requestId}</Td>
                    <Td>
                      <Tag>{moment(row.timestamp * 1000).fromNow() || ""}</Tag>
                    </Td>
                    <Td>{row.ids.join(", ")}</Td>
                    <Td>{row.results.join(", ")}</Td>
                    <Td>{row.power.join(", ")}</Td>
                    <Td className="custom-ellipsis">{row.signature}</Td>
                    <Td className="custom-ellipsis">{row.message}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </VStack>
  );
};

export default BlocksTable;
