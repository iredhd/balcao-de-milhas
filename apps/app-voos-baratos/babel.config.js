module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['expo-router/babel'],
    env: {
      production: {
        plugins: [
          'react-native-paper/babel',
        ],
      },
    },
    overrides: [
      {
        test: '../../node_modules/axios-hooks',
        plugins: [
          ["@babel/plugin-transform-private-methods", { "loose": true }]
        ]
      }
    ]
  };
};
