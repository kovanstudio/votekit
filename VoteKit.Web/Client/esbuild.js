const esbuild = require("esbuild");
const chokidar = require("chokidar");
const { sassPlugin } = require("esbuild-sass-plugin");
const { env, argv } = require("process");

const dev = env.NODE_ENV == "development" || argv.includes("--dev");

let config = {
  entryPoints: ["src/dashboard/index.tsx", "src/feed/index.tsx"],
  bundle: true,
  outdir: "../wwwroot/client/dashboard",
  external: ["/images/*"],
  treeShaking: true,
  plugins: [sassPlugin({})],
  define: {
    "process.env.NODE_ENV": dev ? '"development"' : '"production"',
  },
  inject: ["src/react-shim.js"],
};

if (!dev) {
  esbuild.buildSync(config);
} else {
  esbuild.build({
    ...config,
    minify: false,
    sourcemap: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error('[esbuild] watch build failed:', error)
        else console.log('[esbuild] watch build succeeded')
      },
    }
  }).then(res => {
    console.log("[esbuild] initial build complete");
  })
}
