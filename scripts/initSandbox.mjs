#!/usr/bin/env node
// @ts-check
import { execa } from 'execa'
import { resolve } from 'node:path'
import {
  checkRequirements,
  clearConsole,
  colorize,
  createFolder,
  notifications,
  selectPrompt,
  symbols,
  writeJson,
} from './utils/index.mjs'

const __dirname = process.cwd()

async function init() {
  await clearConsole().then(async () => {
    process.stdout.write(
      `${colorize.bgMagenta(colorize.bold(' wreathe '))} ${colorize.dim(
        'sandbox-setup'
      )}\n\n`
    )

    await checkRequirements(['pnpm', 'php', 'composer', 'git'])

    process.stdout.write(
      `${notifications.info} ${colorize.underline(
        'This command will auto-install a sandbox environment in the workspace.'
      )}\n\n`
    )

    const uiFramework = await selectPrompt({
      question: `${colorize.bold('Select a UI Framework:')} `,
      options: ['Preact', 'React', 'Vue'],
      pointer: symbols.pointer,
    })

    process.stdout.write(
      `\n${colorize.green(
        symbols.success
      )} Selected Framework: ${uiFramework} ...\n\n`
    )

    const ui = uiFramework.toLowerCase()

    await createFolder(`./sandboxes/${ui}`)

    await writeJson(`./sandboxes/${ui}/package.json`, {
      name: `@wreathe-js/sandbox-${ui}`,
    })

    process.stdout.write(
      `${notifications.info} Installing sandbox with @preset/cli ...\n\n`
    )

    execa(
      'pnpm',
      [
        '--shell-mode',
        `--filter=@wreathe-js/sandbox-${ui}`,
        'exec',
        'preset',
        'apply',
        resolve(__dirname, 'packages', 'presets'),
        '--sandbox=true',
        `--ui=${ui}`,
      ],
      { env: { FORCE_COLOR: 'true' } }
    ).stdout?.pipe(process.stdout)
  })
}

init().catch((err) => {
  if (err instanceof Error)
    console.error(`${notifications.fail} ${err.name} - ${err.message}`)
})
