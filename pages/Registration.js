const fs = require('fs');
const path = require('path');

class Registration {
  constructor(page, browser) {
    this.page = page;
    this.browser = browser;
  }

  async registerAndCheckout(email, password = 'Test@123') {
    try {
      email = email || `ramya${Date.now()}@bh.in`;

      await this.page.goto('https://demowebshop.tricentis.com/', { waitUntil: 'domcontentloaded', timeout: 20000 });

      const clickWhenVisible = async (locator, timeout = 8000) => {
        await locator.waitFor({ state: 'visible', timeout });
        await locator.click();
      };

      await clickWhenVisible(this.page.getByRole('link', { name: 'Register' }));

      const female = this.page.getByLabel('Female');
      if ((await female.count()) > 0) await female.check();

      await this.page.getByLabel('First name:').fill('Ramya');
      await this.page.getByLabel('Last name:').fill('Ms');
      await this.page.getByLabel('Email:').fill(email);
      await this.page.locator('#Password').fill(password);
      await this.page.getByLabel('Confirm password:').fill(password);

      await clickWhenVisible(this.page.getByRole('button', { name: 'Register' }));
      await this.page.locator('body').waitFor({ state: 'visible', timeout: 10000 });

      const continueBtn = this.page.getByRole('button', { name: 'Continue' });
      if (await continueBtn.isVisible().catch(() => false)) await continueBtn.click();

      const search = this.page.locator('#small-searchterms');
      await search.fill('Health Book');
      await search.press('Enter');

      const product = this.page.locator('a:has-text("Health Book")').first();
      await product.waitFor({ state: 'visible', timeout: 10000 });
      await product.click();

      await clickWhenVisible(this.page.locator('#add-to-cart-button-22'));
      await this.page.locator('p.content').waitFor({ state: 'visible', timeout: 10000 });

      const logout = this.page.getByRole('link', { name: 'Log out' });
      if (await logout.isVisible().catch(() => false)) await logout.click();

      const popup = this.page.locator('.ui-resizable-handle.ui-resizable-ne');
      if (await popup.isVisible({ timeout: 2000 }).catch(() => false)) {
        await popup.click().catch(() => {});
        const closeBtn = this.page.getByRole('button', { name: 'close' });
        if (await closeBtn.isVisible().catch(() => false)) await closeBtn.click().catch(() => {});
      }

    } catch (error) {
      console.error('❌Error during registration or checkout:', error);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join('screenshots', `failure-${timestamp}.png`);
      fs.mkdirSync('screenshots', { recursive: true });
      await this.page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
      console.log(`📷 Screenshot saved to: ${screenshotPath}`);

      throw error;
    } finally {
      // Caller should manage browser lifecycle.
    }

    return { email, password };
  }
}

module.exports = { Registration };
