'use strict';

/**
 * article router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::article.article',

    {
        method: 'GET',
        path: '/articles/filter',
        handler: 'article.filterByTags', 
        config: {
          // @ts-ignore
          auth: false,
        },
    }
);

