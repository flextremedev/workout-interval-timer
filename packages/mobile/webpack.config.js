/* eslint-disable */
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          // Ensure that all packages starting with @interval-timer are transpiled.
          '@interval-timer',
        ],
      },
    },
    argv
  );
  return config;
};
