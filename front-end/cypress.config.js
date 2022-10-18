const { defineConfig } = require("cypress");

module.exports = defineConfig({
  responseTimeout: 30000,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
    specPattern: "./cypress/e2e/**/*.cy.js",
  },
});
