import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/server'],
  clean: true,
  declaration: true,
  externals: [
    '@wreathe-js/core',
    'axios',
    'esbuild',
    'rollup',
    'typescript',
    'unbuild',
    'vite',
    'vue',
  ],
  rollup: {
    emitCJS: true,
    esbuild: {
      minify: true,
    },
  },
})
