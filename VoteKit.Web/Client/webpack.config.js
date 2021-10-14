const path = require("path");
const fs = require("fs");
const { env, argv } = require("process");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dev = env.NODE_ENV === "development" || argv.includes("--dev");

class StatsPlugin {
  apply(compiler) {
    compiler.hooks.done.tapAsync("Stats Plugin", (stats, next) => {
      let entrypoints = stats.toJson({
        assets: true,
        chunks: false,
      }).entrypoints;

      let assets = Object.keys(entrypoints).reduce(
        (assets, current) => ({
          ...assets,
          [current]: entrypoints[current].assets.map((a) => a.name),
        }),
        {}
      );

      fs.writeFile(path.resolve(__dirname, "../wwwroot/client/assets.json"), Buffer.from(JSON.stringify(assets, null, "  "), "utf8"), next);
    });
  }
}

module.exports = {
  mode: dev ? "development" : "production",
  entry: {
    dashboard: "./src/dashboard/index.tsx",
    feed: "./src/feed/index.tsx"
  },
  output: {
    path: path.resolve(__dirname, "../wwwroot/client"),
    publicPath: dev ? "/client/" : "/client/",
    //filename: "[contenthash].js",
    chunkFilename: "[contenthash].js",
    filename: "[name].js"
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          //transpileOnly: true,
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { url: false }
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, "../public")],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      //filename: "[contenthash].css"
    }),
    //new StatsPlugin()
  ],
  cache: { type: "filesystem" },
};

if (require.main == module) {
  const compiler = require("webpack")(module.exports);

  function onResult(err, stats) {
    if (err) {
      console.error(err.stack || err);

      if (err.details) {
        console.error(err.details);
      }

      if (!dev) {
        process.exit(-1);
      }

      return;
    }

    console.log(
      stats.toString({
        chunks: false,
        colors: true,
      })
    );
  }

  if (dev) {
    compiler.watch({}, onResult);
  } else {
    compiler.run(onResult);
  }
}
