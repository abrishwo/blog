import React from 'react';
import { useQuery } from 'react-query';
import { useFetchClient, LoadingIndicatorPage } from '@strapi/helper-plugin';
import { Layout, HeaderLayout, ContentLayout } from '@strapi/design-system/Layout';
import { Main } from '@strapi/design-system/Main';
import { Typography } from '@strapi/design-system/Typography';
import { Alert } from '@strapi/design-system/Alert';
import Dashboard from '../../components/Dashboard';
import pluginId from '../../pluginId';

const HomePage = () => {
  const { get } = useFetchClient();

  const { isLoading, error, data } = useQuery(
    ['matomo-data'],
    async () => {
      const { data } = await get(`/matomo-dashboard/data`);
      return data;
    }
  );

  if (isLoading) {
    return <LoadingIndicatorPage>Loading Matomo data...</LoadingIndicatorPage>;
  }

  if (error) {
    return (
      <Layout>
        <Main>
          <HeaderLayout title="Matomo Dashboard" subtitle="Failed to load dashboard" />
          <ContentLayout>
            <Alert
              title="Error"
              variant="danger"
              onClose={() => {}}
              closeLabel="Close"
            >
              {error.message}
            </Alert>
          </ContentLayout>
        </Main>
      </Layout>
    );
  }

  return (
    <Layout>
      <Main>
        <HeaderLayout
          title="Matomo Dashboard"
          subtitle="Real-time analytics from your Matomo instance"
        />
        <ContentLayout>
          <Dashboard data={data} />
        </ContentLayout>
      </Main>
    </Layout>
  );
};

export default HomePage;
