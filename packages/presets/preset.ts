export default definePreset({
  name: 'wreathe-js',
  options: {
    // ...
  },
  handler: async () => {
    await extractTemplates()
    // ...
  },
})
