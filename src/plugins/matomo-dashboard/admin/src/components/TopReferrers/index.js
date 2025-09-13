import React from 'react';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';

const TopReferrers = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography>No referrer data available.</Typography>;
  }

  return (
    <Box background="neutral0" shadow="tableShadow" hasRadius padding={4}>
      <Typography variant="delta" as="h3">Top Referrers (Last 30 days)</Typography>
      <Box marginTop={2}>
        <Table colCount={2} rowCount={data.length + 1}>
          <Thead>
            <Tr>
              <Th><Typography>Referrer</Typography></Th>
              <Th><Typography>Visits</Typography></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((referrer) => (
              <Tr key={referrer.label}>
                <Td><Typography textColor="neutral800">{referrer.label}</Typography></Td>
                <Td><Typography textColor="neutral800">{referrer.nb_visits}</Typography></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default TopReferrers;
