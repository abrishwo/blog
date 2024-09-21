'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('custom-sidebar')
      .service('myService')
      .getWelcomeMessage();
  },
});
