'use strict';

const axios = require('axios');

const getApiClient = (config) => {
  if (!config.matomoUrl || !config.matomoSiteId || !config.matomoAuthToken) {
    throw new Error('Matomo URL, Site ID and Auth Token must be configured in the plugin settings.');
  }

  const { matomoUrl, matomoSiteId, matomoAuthToken } = config;

  const client = axios.create({
    baseURL: matomoUrl,
  });

  const buildParams = (method) => {
    return {
      module: 'API',
      method,
      idSite: matomoSiteId,
      period: 'day',
      date: 'today',
      format: 'json',
      token_auth: matomoAuthToken,
    };
  };

  return {
    get: async (method, params = {}) => {
      try {
        const response = await client.get('/index.php', {
          params: { ...buildParams(method), ...params },
        });
        return response.data;
      } catch (error) {
        strapi.log.error(`Error fetching Matomo data for method ${method}:`, error);
        throw new Error(`Could not fetch data from Matomo for method ${method}.`);
      }
    },
  };
};


module.exports = ({ strapi }) => ({
  async getDashboardData() {
    const config = strapi.config.get('plugin.matomo-dashboard');
    const apiClient = getApiClient(config);

    const [
      visitsSummary,
      visitsGraphData,
      topPages,
      topReferrers,
      topKeywords,
      liveVisitors,
      osStats,
      browserStats,
      deviceTypes,
    ] = await Promise.all([
      apiClient.get('VisitsSummary.get'),
      apiClient.get('VisitsSummary.get', { period: 'day', date: 'last30' }),
      apiClient.get('Actions.getPageUrls', { period: 'month', date: 'today' }),
      apiClient.get('Referrers.getReferrerType', { period: 'month', date: 'today' }),
      apiClient.get('Referrers.getKeywords', { period: 'month', date: 'today' }),
      apiClient.get('Live.getLastVisitsDetails', { period: 'day', date: 'today', minTimestamp: Math.floor(Date.now() / 1000) - 300 }), // last 5 minutes
      apiClient.get('DevicesDetection.getOsFamilies'),
      apiClient.get('DevicesDetection.getBrowsers'),
      apiClient.get('DevicesDetection.getType'),
    ]);

    return {
      visitsSummary,
      visitsGraphData,
      topPages,
      topReferrers,
      topKeywords,
      liveVisitors,
      osStats,
      browserStats,
      deviceTypes,
    };
  },
});
