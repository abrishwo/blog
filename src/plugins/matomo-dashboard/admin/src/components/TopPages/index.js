import React from 'react';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';

const TopPages = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography>No page data available.</Typography>;
  }

  return (
    <Box background="neutral0" shadow="tableShadow" hasRadius padding={4}>
      <Typography variant="delta" as="h3">Top Pages (Last 30 days)</Typography>
      <Box marginTop={2}>
        <Table colCount={3} rowCount={data.length + 1}>
          <Thead>
            <Tr>
              <Th><Typography>Page URL</Typography></Th>
              <Th><Typography>Visits</Typography></Th>
              <Th><Typography>Unique Visitors</Typography></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((page) => (
              <Tr key={page.label}>
                <Td><Typography textColor="neutral800">{page.label}</Typography></Td>
                <Td><Typography textColor="neutral800">{page.nb_visits}</Typography></Td>
                <Td><Typography textColor="neutral800">{page.nb_uniq_visitors}</Typography></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default TopPages;
