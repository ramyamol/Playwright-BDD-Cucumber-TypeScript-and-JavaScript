// cucumber.js

module.exports = {
  default: {
    require: [
      'features/support/**/*.ts',
      'tests/support/**/*.ts',
      'features/step-definitions/**/*.ts'
    ],

    requireModule: ['ts-node/register'],

    paths: ['features/**/*.feature'],

    format: [
      'progress',
      'allure-cucumberjs/reporter'
    ],

    formatOptions: {
      resultsDir: 'allure-results'
    },

    publishQuiet: true
  }
};
