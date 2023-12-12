import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      pluginsFile: false
    },
    baseUrl: 'http://54.226.243.159:5173',
    supportFile: false,
    env: {
      "IMAGE_SNAPSHOT": "cypress/snapshots"
    },
  },
})
