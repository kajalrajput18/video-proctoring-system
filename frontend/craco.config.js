module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.ignoreWarnings = [
        {
          module: /@mediapipe/,
        },
        {
          module: /@tensorflow/,
        }
      ];
      return webpackConfig;
    },
  },
};