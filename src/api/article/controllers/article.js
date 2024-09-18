// @ts-nocheck
'use strict';

/**
 * article controller
 */


const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article',

    {
        async filterByTags(ctx) {
            try {
              const { tags } = ctx.query; // Get tags from the query string
        
              if (!tags) {
                return ctx.badRequest('Tags parameter is missing');
              }
        
              // Convert tags to an array if it's a single value
              const tagIds = Array.isArray(tags) ? tags : [tags];
        
              // Use the service method to fetch filtered articles
              const articles = await strapi.service('api::article.article').filterByTags(tagIds);
        
              return ctx.send(articles);
            } catch (error) {
              ctx.throw(500, error.message || 'Internal server error');
            }
          },
    }
);
