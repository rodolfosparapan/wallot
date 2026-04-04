const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// With package exports enabled, Metro resolves the "import" condition for zustand
// which points to .mjs files containing import.meta — breaking web bundles.
// Explicitly set condition names to exclude "import" so Metro picks the
// "react-native" or "default" conditions (CJS builds) instead.
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'require', 'default'];

module.exports = config;
