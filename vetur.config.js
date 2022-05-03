module.exports = {
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'vetur.experimental.templateInterpolationService': true,
  },
  projects: [
    {
      root: './web',
      globalComponents: ['./web/components/**/*.vue'],
    },
  ],
};
