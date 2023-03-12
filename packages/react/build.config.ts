import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/server'],
  clean: true,
  declaration: true,
  externals: ['react-dom'],
  rollup: {
    emitCJS: true,
    esbuild: {
      minify: true,
    },
  },
})
