// @ts-check
import readline from 'node:readline'
import { colorize } from './colorize.mjs'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

/**
 * Create a simple select prompt
 * @param {{question: string, options: string[], pointer: any}} object - Options
 * @returns {Promise<string>}
 */
export async function selectPrompt({ question, options, pointer }) {
  if (question === undefined) throw new Error('No question was specified.')
  if (options === undefined) throw new Error('No options were specified.')
  if (pointer === undefined) throw new Error('No pointer was specified.')

  let selectIndex = 0
  let selectedOption = undefined

  const createSelect = () => {
    process.stdout.moveCursor(0, -(options.length - 1))
    process.stdout.cursorTo(0)
    process.stdout.clearScreenDown()

    for (let opt = 0; opt < options.length; opt++) {
      let option =
        opt === selectIndex
          ? `${colorize.cyan(pointer)} ${colorize.cyan(
              colorize.underline(options[opt])
            )}`
          : `  ${options[opt]}`
      process.stdout.write(
        `  ${option}\x1b[0m${opt !== options.length - 1 ? '\n' : ''}`
      )
    }
    process.stdout.write('\x1B[?25l')
  }

  return new Promise((resolve, reject) => {
    console.log(
      `${colorize.green('?')} ${question}${colorize.gray(
        '... (Press <up> / <down> to select, <return> to confirm)'
      )}\n\n`
    )

    readline.emitKeypressEvents(process.stdin)
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true)
      process.stdin.resume()
      process.stdin.on('keypress', function handler(_, { name, ctrl }) {
        if (name === 'down' && selectIndex < options.length - 1) {
          ++selectIndex
          createSelect()
        } else if (name === 'up' && selectIndex > 0) {
          --selectIndex
          createSelect()
        }

        if (name === 'return') {
          process.stdin.removeListener('keypress', handler)
          process.stdin.setRawMode(false)
          process.stdin.pause()
          process.stdout.write('\x1B[?25h')
          selectedOption = options[selectIndex]
          if (!options.includes(selectedOption))
            throw new Error('The selected option does not exist.')
          resolve(selectedOption)
        }

        if (name === 'escape' || (name === 'c' && ctrl)) {
          console.log('process.end')
          rl.close()
          process.stdin.removeListener('keypress', handler)
          process.stdin.setRawMode(false)
          process.stdin.pause()
          process.stdout.write('\x1B[?25h')
        }
      })
      createSelect()
    }
  })
}
