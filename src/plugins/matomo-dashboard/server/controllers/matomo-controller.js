'use strict';

module.exports = ({ strapi }) => ({
  async index(ctx) {
    try {
      const data = await strapi
        .plugin('matomo-dashboard')
        .service('matomoService')
        .getDashboardData();

      ctx.body = data;
    } catch (error) {
      if (error.message.includes('must be configured')) {
        return ctx.badRequest(error.message);
      }
      ctx.throw(500, error.message);
    }
  },
});
