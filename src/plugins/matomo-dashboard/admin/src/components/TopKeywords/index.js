import React from 'react';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';

const TopKeywords = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography>No keyword data available.</Typography>;
  }

  return (
    <Box background="neutral0" shadow="tableShadow" hasRadius padding={4}>
      <Typography variant="delta" as="h3">Top Keywords (Last 30 days)</Typography>
      <Box marginTop={2}>
        <Table colCount={2} rowCount={data.length + 1}>
          <Thead>
            <Tr>
              <Th><Typography>Keyword</Typography></Th>
              <Th><Typography>Visits</Typography></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((keyword) => (
              <Tr key={keyword.label}>
                <Td><Typography textColor="neutral800">{keyword.label}</Typography></Td>
                <Td><Typography textColor="neutral800">{keyword.nb_visits}</Typography></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default TopKeywords;
