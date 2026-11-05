const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Firebase Auth can load duplicate SDK instances through package exports in Metro.
// Resolve its CommonJS entry consistently on native platforms.
config.resolver.unstable_enablePackageExports = false;
if (!config.resolver.sourceExts.includes("cjs")) {
  config.resolver.sourceExts.push("cjs");
}

module.exports = config;
