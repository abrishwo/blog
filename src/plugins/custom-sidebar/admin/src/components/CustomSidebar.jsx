import React from 'react';
import { Box } from '@strapi/design-system/Box';
import { Link } from '@strapi/design-system/Link';
import { Text } from '@strapi/design-system/Text';
import { useHistory } from 'react-router-dom';

const CustomSidebar = () => {
  const history = useHistory();

  return (
    <Box as="nav" background="neutral100" padding={4}>
      <Link to="/dashboard">
        <Text as="h4" marginBottom={2}>Dashboard</Text>
      </Link>
      <Link to="/posts">
        <Text as="h4" marginBottom={2}>Posts</Text>
      </Link>
      <Link to="/system">
        <Text as="h4" marginBottom={2}>System</Text>
      </Link>
      <Link to="/users">
        <Text as="h4" marginBottom={2}>Users</Text>
      </Link>
    </Box>
  );
};

export default CustomSidebar;
