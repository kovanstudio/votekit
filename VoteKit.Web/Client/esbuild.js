const esbuild = require("esbuild");
const chokidar = require("chokidar");
const { sassPlugin } = require("esbuild-sass-plugin");
const { env, argv } = require("process");

const dev = env.NODE_ENV == "development" || argv.includes("--dev");

const cache = new Map();

function build() {
  Promise.all([
    esbuild.build({
      entryPoints: ["src/dashboard/index.tsx"],
      bundle: true,
      outdir: "../wwwroot/client/dashboard",
      external: ["/images/*"],
      treeShaking: "ignore-annotations",
      plugins: [sassPlugin({})],
      define: {
        "process.env.NODE_ENV": dev ? '"development"' : '"production"',
      },
      inject: ["src/react-shim.js"],
      minify: !dev,
      sourcemap: dev,
    }),
    esbuild.build({
      entryPoints: ["src/feed/index.tsx"],
      bundle: true,
      outdir: "../wwwroot/client/feed",
      external: ["/images/*"],
      treeShaking: "ignore-annotations",
      plugins: [sassPlugin({})],
      define: {
        "process.env.NODE_ENV": dev ? '"development"' : '"production"',
      },
      inject: ["src/react-shim.js"],
      minify: !dev,
      sourcemap: dev,
    })
  ])
    .then(() => console.log("  ✔ Built client assets"))
    .catch((e) => console.error(e.message));
}

if (dev) {
  const watcher = chokidar.watch("src", { ignoreInitial: true });

  watcher.on("ready", build);
  watcher.on("change", build);
} else {
  build();
}
