'use strict';

/**
 * system-config service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::system-config.system-config');
