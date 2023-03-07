import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/server'],
  clean: true,
  declaration: true,
  externals: [
    '@wreathe-js/core',
    'axios',
    'react',
    'react@dom',
    'typescript',
    'unbuild',
  ],
  rollup: {
    emitCJS: true,
    esbuild: {
      minify: true,
    },
  },
})
