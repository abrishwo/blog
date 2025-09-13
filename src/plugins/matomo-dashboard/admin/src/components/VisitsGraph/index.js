import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';

const VisitsGraph = ({ data }) => {
  if (!data) {
    return <Typography>No graph data available.</Typography>;
  }

  const chartData = Object.keys(data).map(date => ({
    date,
    visits: data[date].nb_visits,
  }));

  return (
    <Box background="neutral0" shadow="tableShadow" hasRadius padding={4}>
      <Typography variant="delta" as="h3">Visits Over Last 30 Days</Typography>
      <Box marginTop={4} style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="visits" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default VisitsGraph;
