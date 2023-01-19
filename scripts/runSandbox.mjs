#!/usr/bin/env node
// @ts-check
import { shell } from '@tunnckocore/execa'
import minimist from 'minimist'
import { resolve } from 'node:path'
import { exists, notifications } from './utils/index.mjs'

async function run() {
  const __dirname = process.cwd()

  const { ui } = minimist(process.argv.slice(2))

  if (!ui) {
    console.error(
      `${notifications.fail} Please provide a value for the required ui flag: --ui preact|react|vue`
    )
    process.exit(1)
  }

  const dirExists = await exists(resolve(__dirname, 'sandboxes', ui))

  if (!dirExists) {
    console.error(
      `${notifications.fail} The sandbox directory ./sandboxes/${ui} does not exist.\n`
    )
    console.error(
      `${notifications.info} To setup a new sandbox run: pnpm run sandbox\n`
    )
    process.exit(1)
  }

  await shell(['pnpm run dev', 'php artisan serve'], {
    stdio: 'inherit',
    cwd: resolve(__dirname, 'sandboxes', ui),
  })
}

run()
