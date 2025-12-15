import { Before, After, Status } from '@cucumber/cucumber';
import { chromium, Browser } from '@playwright/test';
import { PlaywrightWorld } from '../../features/support/world';

Before(async function (this: PlaywrightWorld, scenario) {
  console.log(`Running scenario: ${scenario.pickle.name}`);
  
  // Initialize browser and page for this scenario
  this.browser = await chromium.launch({ headless: false });
  const context = await this.browser.newContext();
  this.page = await context.newPage();
});

After(async function (this: PlaywrightWorld, scenario) {
  // Capture screenshot on failure
  if (scenario.result?.status === Status.FAILED) {
    if (this.page) {
      const timestamp = new Date().getTime();
      const screenshotPath = `screenshots/failure-${scenario.pickle.name}-${timestamp}.png`;
      const screenshot = await this.page.screenshot({ path: screenshotPath, type: 'png' });
      this.attach(screenshot, 'image/png');
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    }
  }
  
  // Clean up browser
  if (this.browser) {
    await this.browser.close();
  }
});
