const { GasPlugin } = require("esbuild-gas-plugin");

require("esbuild")
  .build({
    entryPoints: ["src/sendNotificationToDiscord.ts"],
    bundle: true,
    outfile: "dist/sendNotificationToDiscord.js",
    plugins: [GasPlugin],
  })
  .catch(() => process.exit(1));
