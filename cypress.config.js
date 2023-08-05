const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://ext-mycologix.dev.nac.net",
    defaultCommandTimeout: 7000,
    setupNodeEvents(on, config) {},
  },
  env: {
    username: "zbasarir",
    password: "Agawam1907!",
  },
});
