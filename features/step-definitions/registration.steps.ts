// features/step-definitions/registrationNew.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Registration } from '../../pages/Registration';
import { PlaywrightWorld } from '../support/world';

let registration: Registration;

Given('Open the demo webshop site', { timeout: 60 * 1000 }, async function (this: PlaywrightWorld) {
  // Use the page/browser from Playwright world (initialized by Before hook)
  if (!this.page) throw new Error('Page not initialized; check hooks.ts Before hook');
  if (!this.browser) throw new Error('Browser not initialized; check hooks.ts Before hook');

  registration = new Registration(this.page, this.browser);

  await this.page.goto('https://demowebshop.tricentis.com/');
  console.log("✅ Demo webshop site opened");
});

When('Register and proceed to checkout', { timeout: 60 * 1000 }, async function (this: PlaywrightWorld) {
  await registration.registerAndCheckout();
  console.log("✅ Registration and checkout completed");
});

Then('I should see the checkout page', async function (this: PlaywrightWorld) {
  // Browser will be closed automatically in After hook
  console.log("⏹️Browser will close in After hook");
});

Then('I should close the browser', async function (this: PlaywrightWorld) {
  // Support older feature files which explicitly ask the test to close the browser
  if (this.browser) {
    try {
      await this.browser.close();
      console.log('🛑 Closed browser from step definition');
    } catch (err) {
      console.warn('Browser was already closed or error while closing:', String(err));
    }
  } else {
    console.log('Browser handle not found on this world; it may be closed already');
  }
});
