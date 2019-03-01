/**
 * Inspired by
 * - https://github.com/rozzzly/vscode-prompt-debug/blob/7a29b8927f6191639c6cb931ac250e218219fc74/test/jest-test-runner.ts
 * - after reading https://stackoverflow.com/q/49615315/1238150
 */
import path from 'path'

import { runCLI } from 'jest' // eslint-disable-line
import sourceMapSupport from 'source-map-support'

const rootDir = path.resolve(__dirname, '../../')
const fromRoot = (...subPaths) => path.resolve(rootDir, ...subPaths)

const jestConfig = {
  colors: true,
  moduleFileExtensions: ['js'],
  rootDir,
  roots: ['<rootDir>/src'],
  runInBand: true, // Required due to the way the "vscode" module is injected.
  setupTestFrameworkScriptFile: fromRoot(
    'dist/test/jest-vscode-framework-setup.js',
  ),
  testEnvironment: fromRoot('dist/test/jest-vscode-environment.js'),
  testRegex: '\\.(test|spec)\\.js$',
  verbose: true,
}

/**
 * Collect failure messages from Jest test results.
 *
 * @param results Jest test results.
 */
function collectTestFailureMessages(results) {
  const failures = results.testResults.reduce((acc, testResult) => {
    if (testResult.failureMessage) acc.push(testResult.failureMessage)
    return acc
  }, [])

  return failures
}

/**
 * Forward writes to process.stdout and process.stderr to console.log.
 *
 * For some reason this seems to be required for the Jest output to be streamed
 * to the Debug Console.
 */
function forwardStdoutStderrStreams() {
  const logger = line => {
    console.log(line) // tslint:disable-line:no-console
    return true
  }

  process.stdout.write = logger
  process.stderr.write = logger
}

export async function run(_testRoot, callback) {
  // Enable source map support. This is done in the original Mocha test runner,
  // so do it here. It is not clear if this is having any effect.
  sourceMapSupport.install()

  // Forward logging from Jest to the Debug Console.
  forwardStdoutStderrStreams()

  try {
    const { results } = await runCLI(jestConfig, [rootDir])
    const failures = collectTestFailureMessages(results)

    if (failures.length > 0) {
      callback(null, failures)
      return
    }

    callback(null)
  } catch (e) {
    callback(e)
  }
}
