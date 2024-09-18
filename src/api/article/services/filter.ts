// src/api/article/services/article.js

'use strict';

module.exports = {
  /**
   * Service to filter articles by multiple tags.
   * @param {Array} tagIds - Array of tag IDs to filter by.
   * @returns {Promise<Array>} - Filtered articles.
   */
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
};
