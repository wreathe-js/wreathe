// @ts-check
import isCommand from 'is-command'
import fs from 'node:fs/promises'
import { colorize } from './colorize.mjs'

/**
 * Checks if a directory exists
 * @param {string} dir - The directory to check
 * @returns {Promise<boolean>}
 */
export const exists = (dir) =>
  fs
    .access(dir)
    .then(() => true)
    .catch(() => false)

/**
 * Creates a sandbox/ui directory in workspace
 * @param {string} dir - The directory to check
 * @returns {Promise<void>}
 */
export async function createFolder(dir) {
  try {
    if (!(await exists(dir))) {
      await fs.mkdir(dir, { recursive: true })
    } else {
      console.error(
        `${colorize.bgRed(
          ' FAIL '
        )} Sandbox ${dir} already exists. Please delete the directory and try again.`
      )
      process.exit(1)
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(`${err.name}: ${err.message}`)
    }
  }
}

/**
 * Clears the terminal
 * @returns {Promise<void>}
 */
export async function clearConsole() {
  await new Promise((resolve) => {
    process.stdout.write(
      process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H',
      resolve
    )
  })
}

/**
 * Checks for the sandbox system requirements
 * @param {string[]} requirement - The requirement to check
 * @returns {Promise<void>}
 */
export async function checkRequirements(requirement) {
  const reqResponse = []
  if (Array.isArray(requirement) && requirement.length) {
    for (const req of requirement) {
      const is = await isCommand(req)
      if (!is) requirementError(req)
      reqResponse.push(is)
    }
  }
}

/**
 * Throws an requirement error
 * @param {string} str - The requirement to check
 * @returns {void}
 */
export function requirementError(str) {
  console.error(
    `${colorize.bgRed(' FAIL ')} ${colorize.underline(
      str
    )} was not found, please install ${colorize.underline(str)} first\n`
  )
  process.exit(1)
}

/**
 * Write json data to a file
 * @param {string} path - The path to write
 * @param {object} data - The json object to write
 * @returns {Promise<void>}
 */
export async function writeJson(path, data) {
  try {
    const json = JSON.stringify(data, null, 2)
    await fs.writeFile(path, json, 'utf-8')
  } catch (err) {
    if (err instanceof Error) console.error(`${err.name} ${err.message}`)
  }
}
