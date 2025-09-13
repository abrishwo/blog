# Strapi Plugin - Matomo Dashboard

A plugin for Strapi that embeds a Matomo analytics dashboard into the admin panel.

## Configuration

To use this plugin, you need to configure it with your Matomo instance's details.
Create or edit the file `./config/plugins.js` in your Strapi project and add the following configuration:

```javascript
module.exports = ({ env }) => ({
  // ... other plugins
  'matomo-dashboard': {
    enabled: true,
    config: {
      matomoUrl: env('MATOMO_URL', 'https://your-matomo-instance.com'),
      matomoSiteId: env('MATOMO_SITE_ID', '1'),
      matomoAuthToken: env('MATOMO_AUTH_TOKEN', 'your-auth-token'),
    },
  },
});
```

It is recommended to use environment variables to store your Matomo credentials. Add the following to your `.env` file:

```
MATOMO_URL=https://your-matomo-instance.com
MATOMO_SITE_ID=1
MATOMO_AUTH_TOKEN=your-auth-token
```

### Configuration Options

- `matomoUrl` (string): The URL of your Matomo instance.
- `matomoSiteId` (string | number): The ID of the site you want to track in Matomo.
- `matomoAuthToken` (string): Your Matomo authentication token. You can find this in your Matomo dashboard under `Settings > Personal > Security`.

## Permissions

This plugin adds a new permission to your Strapi application:
- `plugin::matomo-dashboard.read`: Allows a user to see the Matomo dashboard page.

To enable the dashboard for a role, go to `Settings > Administration Panel > Roles`, select a role, and check the `read` permission for the `matomo-dashboard` plugin.
