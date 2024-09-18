// @ts-nocheck
'use strict';

/**
 * article service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::article.article',

    {
        async filterByTags(tagIds) {
            try {
              const articles = await strapi.entityService.findMany('api::article.article', {
                filters: {
                  tags: {
                    id: {
                      $in: tagIds,
                    },
                  },
                },
                populate: '*', // Customize this based on your needs
              });
        
              return articles;
            } catch (error) {
              throw new Error('Error filtering articles by tags');
            }
          },
    }
);

