import React from 'react';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import { Flex } from '@strapi/design-system/Flex';

const SummaryBox = ({ label, value }) => (
  <Box padding={4} background="neutral0" shadow="tableShadow" hasRadius>
    <Flex direction="column" gap={1}>
      <Typography variant="beta">{value}</Typography>
      <Typography textColor="neutral600">{label}</Typography>
    </Flex>
  </Box>
);

const VisitsSummary = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <Box marginBottom={4}>
      <Typography variant="delta" as="h3">Today's Summary</Typography>
      <Box marginTop={2}>
        <Grid gap={4}>
          <GridItem col={4}>
            <SummaryBox label="Total Visits" value={data.nb_visits} />
          </GridItem>
          <GridItem col={4}>
            <SummaryBox label="Unique Visitors" value={data.nb_uniq_visitors} />
          </GridItem>
          <GridItem col={4}>
            <SummaryBox label="Page Views" value={data.nb_pageviews} />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default VisitsSummary;
