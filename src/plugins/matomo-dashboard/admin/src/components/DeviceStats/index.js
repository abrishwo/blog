import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import { Grid, GridItem } from '@strapi/design-system/Grid';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const Chart = ({ title, data }) => {
  if (!data || data.length === 0) {
    return <Typography>No data available for {title}.</Typography>;
  }

  const chartData = data.map(item => ({ name: item.label, value: item.nb_visits }));

  return (
    <Box>
      <Typography variant="delta" as="h3">{title}</Typography>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const DeviceStats = ({ os, browsers, types }) => {
  return (
    <Box background="neutral0" shadow="tableShadow" hasRadius padding={4} marginTop={4}>
      <Grid gap={4}>
        <GridItem col={4}>
          <Chart title="Operating Systems" data={os} />
        </GridItem>
        <GridItem col={4}>
          <Chart title="Browsers" data={browsers} />
        </GridItem>
        <GridItem col={4}>
          <Chart title="Device Types" data={types} />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default DeviceStats;
