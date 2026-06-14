// This file contains code that we reuse between our tests.
import * as path from 'node:path'
import * as test from 'node:test'
const helper = require('fastify-cli/helper.js')

export type TestContext = {
  after: typeof test.after
}

const AppPath = path.join(__dirname, '..', 'src', 'app.ts')

// Fill in this config with all the configurations
// needed for testing the application
/**
 * Configuration function for tests.
 * @returns {object} The configuration object containing testing options.
 */
function config () {
  return {
    skipOverride: true // Register our application with fastify-plugin
  }
}

// Automatically build and tear down our instance
/**
 * Builds and initializes the application instance for testing.
 * Automatically handles teardown after the test completes.
 * @param {TestContext} t - The node:test context object.
 * @returns {Promise<any>} A promise that resolves to the fastify application instance.
 */
async function build (t: TestContext) {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath]

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app = await helper.build(argv, config())

  // Tear down our app after we are done
  // eslint-disable-next-line no-void
  t.after(() => void app.close())

  return app
}

export {
  config,
  build
}
