const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    tools: path.resolve(__dirname, "./src/tools.ts"),
    canvas: path.resolve(__dirname, "./src/canvas.ts"),
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public", "static", "bundle"),
  },
};
