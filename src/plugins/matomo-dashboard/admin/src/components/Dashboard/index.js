import React from 'react';
import { Box } from '@strapi/design-system/Box';
import VisitsSummary from '../VisitsSummary';
import TopPages from '../TopPages';
import TopReferrers from '../TopReferrers';
import TopKeywords from '../TopKeywords';
import VisitsGraph from '../VisitsGraph';
import DeviceStats from '../DeviceStats';
import { Grid, GridItem } from '@strapi/design-system/Grid';

const Dashboard = ({ data }) => {
  if (!data) {
    return null;
  }

  const {
    visitsSummary,
    topPages,
    topReferrers,
    topKeywords,
    liveVisitors,
    osStats,
    browserStats,
    deviceTypes,
    visitsGraphData,
  } = data;

  return (
    <Box>
      <VisitsSummary data={visitsSummary} />
      <Box marginTop={4}>
        <Grid gap={4}>
          <GridItem col={12}>
            <VisitsGraph data={visitsGraphData} />
          </GridItem>
          <GridItem col={12}>
            <DeviceStats os={osStats} browsers={browserStats} types={deviceTypes} />
          </GridItem>
          <GridItem col={4}>
            <TopPages data={topPages} />
          </GridItem>
          <GridItem col={4}>
            <TopReferrers data={topReferrers} />
          </GridItem>
          <GridItem col={4}>
            <TopKeywords data={topKeywords} />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
