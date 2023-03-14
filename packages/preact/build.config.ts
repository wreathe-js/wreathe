import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/server'],
  clean: true,
  declaration: true,
  externals: ['preact-render-to-string'],
  rollup: {
    emitCJS: true,
    esbuild: {
      minify: true,
    },
  },
})
