import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { useState } from "react";
import { dummyTableData } from "../utils/data";

const ResultTable = ({ collectionsData, lastUpdatedTimestamp }) => {
  return (
    <TableContainer>
      <Table variant="striped" size="lg">
        <TableCaption>Last updated on {lastUpdatedTimestamp}</TableCaption>
        <Thead>
          <Tr>
            <Th isNumeric>Collection ID</Th>
            <Th isNumeric>Result</Th>
            <Th isNumeric>Power</Th>
          </Tr>
        </Thead>
        <Tbody>
          {collectionsData.map((collection) => (
            <Tr key={collection.id}>
              <Td>{collection.id}</Td>
              <Td>{collection.result}</Td>
              <Td>{collection.power}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ResultTable;
