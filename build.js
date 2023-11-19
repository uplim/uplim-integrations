const { GasPlugin } = require('esbuild-gas-plugin')

require('esbuild')
  .build({
    entryPoints: ['src/triplateContact.ts'],
    bundle: true,
    outfile: 'dist/triplateContact.js',
    plugins: [GasPlugin],
  })
  .catch(() => process.exit(1))
