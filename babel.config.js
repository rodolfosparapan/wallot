module.exports = function (api) {
  const platform = api.caller((caller) => caller?.platform);
  api.cache.using(() => platform);
  const isWeb = platform === 'web';
  return {
    presets: [
      ['babel-preset-expo', isWeb ? { reanimated: false, worklets: false } : {}],
    ],
    plugins: isWeb ? [] : ['react-native-worklets/plugin'],
  };
};