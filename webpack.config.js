module.exports = {
  module: {
    rules: [
      {
        test: /\.(mp3|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
};