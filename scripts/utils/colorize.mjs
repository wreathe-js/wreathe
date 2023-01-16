// @ts-check
import util from 'util'

/**
 * Colorize Node.js terminal output
 * https://github.com/jrson83/colorize-node
 */
export const colorize = Object.fromEntries(
  Object.entries(util.inspect.colors).map(([color, code]) => [
    color,
    (/** @type {any} */ str) => {
      if (!code) return
      if (!process.stdout.hasColors()) return str
      return `\x1b[${code[0]}m${str}\x1b[${code[1]}m`
    },
  ])
)
