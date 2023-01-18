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
  /* https://github.com/unjs/unbuild/issues/112#issuecomment-1331769536 */
  hooks: {
    'rollup:dts:options'(_ctx, options) {
      if (Array.isArray(options.plugins)) {
        const esbuildPlugin = options.plugins.find(
          (p) => (p as any).name === 'esbuild'
        )
        ;(esbuildPlugin as any).renderChunk = () => null
      }
    },
  },
})
