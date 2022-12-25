import { defineConfig } from 'vitepress'
import { generateSitemap as sitemap } from 'sitemap-ts'

export default defineConfig({
  lang: 'en-US',
  title: ' Wreathe-js',
  description: 'Just playing around.',
  appearance: true,
  lastUpdated: true,
  /* base: '/wreathe/', */
  outDir: '../dist',
  themeConfig: {
    logo: './wreathe-logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/getting-started/introduction' },
      { text: 'Configs', link: '/configs' },
      { text: 'Changelog', link: 'https://github.com/...' },
    ],
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/C5E2ChNE' },
      { icon: 'github', link: 'https://github.com/wreathe-js/wreathe' },
    ],
    sidebar: [
      {
        text: 'Getting started',
        collapsible: true,
        items: [
          { text: 'Introduction', link: '/guide/getting-started/introduction' },
          { text: 'Quick Start', link: '/guide/getting-started/quick-start' },
          {
            text: 'Configuration',
            link: '/guide/getting-started/configuration',
          },
          {
            text: 'Core Concepts',
            link: '/guide/getting-started/core-concepts',
          },
        ],
      },
      {
        text: 'Basic usage',
        collapsible: true,
        items: [
          { text: 'Routing', link: '/guide/basic-usage/routing' },
          { text: 'Responses', link: '/guide/basic-concept/responses' },
          { text: 'Pages', link: '/guide/basic-concept/pages' },
          { text: 'Title & meta', link: '/guide/basic-concept/title-and-meta' },
          { text: 'Links', link: '/guide/basic-concept/links' },
          { text: 'Manual visits', link: '/guide/basic-concept/manual-visits' },
          { text: 'Redirects', link: '/guide/basic-concept/redirects' },
          { text: 'Forms', link: '/guide/basic-concept/forms' },
          { text: 'File uploads', link: '/guide/basic-concept/file-uploads' },
          { text: 'Validation', link: '/guide/basic-concept/validation' },
          { text: 'Shared data', link: '/guide/basic-concept/shared-data' },
        ],
      },
      {
        text: 'Advanced usage',
        collapsible: true,
        items: [
          {
            text: 'Manual Installation',
            link: '/guide/advanced-usage/manual-installation',
          },
          {
            text: 'Migrating from Inertia.js',
            link: '/guide/advanced-usage/migrating',
          },
        ],
      },
    ],
    editLink: {
      pattern:
        'https://github.com/wreathe-js/wreathe-js.github.io/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message:
        'Released under the <a href="https://github.com/wreathe-js/wreathe/blob/main/LICENSE">MIT License</a>.',
    },
  },
  buildEnd() {
    sitemap({ hostname: 'http://localhost:5173/' })
  },
})
