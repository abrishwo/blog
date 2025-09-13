module.exports = [
  {
    method: 'GET',
    path: '/data',
    handler: 'matomoController.index',
    config: {
      policies: [],
    },
  },
];
