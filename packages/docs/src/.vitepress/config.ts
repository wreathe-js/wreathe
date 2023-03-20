import { version } from '../../../core/package.json'
import { generateSitemap as sitemap } from 'sitemap-ts'
import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: ' Wreathe',
  description: 'Build classic server-side rendered applications',

  appearance: true,
  lastUpdated: true,
  cleanUrls: true,

  /* base: '/wreathe/', */
  outDir: '../dist',

  themeConfig: {
    logo: '/wreathe-logo.svg',
    nav: [
      {
        text: 'Guide',
        link: '/guide/getting-started/introduction',
        activeMatch: '/guide/',
      },
      {
        text: 'Advanced',
        link: '/advanced-usage/',
        activeMatch: '/advanced-usage/',
      },
      { text: 'API', link: '/api/', activeMatch: '/api/' },
      { text: 'Config', link: '/config/', activeMatch: '/config/' },
      {
        text: `v${version}`,
        items: [
          {
            text: 'Release Notes ',
            link: 'https://github.com/wreathe-js/wreathe/releases',
          },
          {
            text: 'Contributing ',
            link: 'https://github.com/wreathe-js/wreathe/blob/main/CONTRIBUTING.md',
          },
          {
            text: 'Preset ',
            link: 'https://github.com/wreathe-js/wreathe/blob/main/packages/presets/CHANGELOG.md',
          },
          {
            text: 'Discord ',
            link: 'https://discord.gg/C5E2ChNE',
          },
        ],
      },
    ],
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/C5E2ChNE' },
      { icon: 'github', link: 'https://github.com/wreathe-js/wreathe' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting started',
          items: [
            {
              text: 'Introduction',
              link: '/guide/getting-started/introduction',
            },
            { text: 'Quick Start', link: '/guide/getting-started/quick-start' },
            {
              text: 'Core Concepts',
              link: '/guide/getting-started/core-concepts',
            },
          ],
        },
        {
          text: 'Basic usage',
          items: [
            { text: 'Routing', link: '/guide/basic-usage/routing' },
            { text: 'Responses', link: '/guide/basic-usage/responses' },
            { text: 'Pages', link: '/guide/basic-usage/pages' },
            { text: 'Title & meta', link: '/guide/basic-usage/title-and-meta' },
            { text: 'Links', link: '/guide/basic-usage/links' },
            { text: 'Manual visits', link: '/guide/basic-usage/manual-visits' },
            { text: 'Redirects', link: '/guide/basic-usage/redirects' },
            { text: 'Forms', link: '/guide/basic-usage/forms' },
            { text: 'File uploads', link: '/guide/basic-usage/file-uploads' },
            { text: 'Validation', link: '/guide/basic-usage/validation' },
            { text: 'Shared data', link: '/guide/basic-usage/shared-data' },
          ],
        },
        {
          text: 'Advanced usage',
          items: [{ text: 'Overview', link: '/advanced-usage/' }],
        },
        {
          text: 'API',
          items: [{ text: 'API Reference', link: '/api/' }],
        },
        {
          text: 'Config',
          items: [{ text: 'Config Reference', link: '/config/' }],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            {
              text: 'Overview',
              link: '/api/',
            },
            {
              text: 'Preset CLI',
              link: '/api/preset-cli',
            },
          ],
        },
      ],
      '/config/': [
        {
          text: 'Config Reference',
          items: [
            {
              text: 'Overview',
              link: '/config/',
            },
          ],
        },
      ],
      '/advanced-usage/': [
        {
          text: 'Advanced usage',
          items: [
            {
              text: 'Manual Installation',
              link: '/advanced-usage/manual-installation',
            },
            {
              text: 'Events',
              link: '/advanced-usage/events',
            },
            {
              text: 'Testing',
              link: '/advanced-usage/testing',
            },
            {
              text: 'Partial reloads',
              link: '/advanced-usage/partial-reloads',
            },
            {
              text: 'Scroll management',
              link: '/advanced-usage/scroll-management',
            },
            {
              text: 'Authentication',
              link: '/advanced-usage/authentication',
            },
            {
              text: 'Authorization',
              link: '/advanced-usage/authorization',
            },
            {
              text: 'CSRF protection',
              link: '/advanced-usage/csrf-protection',
            },
            {
              text: 'Error handling',
              link: '/advanced-usage/error-handling',
            },
            {
              text: 'Asset versioning',
              link: '/advanced-usage/asset-versioning',
            },
            {
              text: 'Progress indicators',
              link: '/advanced-usage/progress-indicators',
            },
            {
              text: 'Remembering state',
              link: '/advanced-usage/remembering-state',
            },
            {
              text: 'Server-side Rendering (SSR)',
              link: '/advanced-usage/server-side-rendering',
            },
            {
              text: 'Migrating from Inertia.js',
              link: '/advanced-usage/migrating',
            },
          ],
        },
      ],
    },
    editLink: {
      pattern:
        'https://github.com/wreathe-js/wreathe/tree/main/packages/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message:
        'Released under the <a href="https://github.com/wreathe-js/wreathe/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2022-present <a href="/">wreathe-js</a>.',
    },
  },
  buildEnd() {
    sitemap({ hostname: 'http://localhost:5173/' })
  },
})
