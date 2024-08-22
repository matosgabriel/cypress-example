import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    "baseUrl": "https://erickwendel.github.io/vanilla-js-web-app-example/",

    // did not clean the context after each scenario
    "testIsolation": false
  },
});
