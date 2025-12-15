import { Page, Browser, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class Registration {
  constructor(private page: Page, private browser: Browser) {}

  async registerAndCheckout(email?: string, password = 'Test@123'): Promise<{ email: string; password: string }> {
    // This method performs a registration + add-to-cart flow.
    // It intentionally does NOT close the browser/page — caller is responsible for lifecycle.
    try {
      email = email ?? `ramya${Date.now()}@bh.in`;

      await this.page.goto('https://demowebshop.tricentis.com/', { waitUntil: 'domcontentloaded', timeout: 20000 });

      // helper to click when visible and enabled
      const clickWhenVisible = async (locator: any, timeout = 8000) => {
        await locator.waitFor({ state: 'visible', timeout });
        await locator.click();
      };

      await clickWhenVisible(this.page.getByRole('link', { name: 'Register' }));

      // choose gender and fill form fields
      const female = this.page.getByLabel('Female');
      if (await female.count() > 0) await female.check();

      await this.page.getByLabel('First name:').fill('Ramya');
      await this.page.getByLabel('Last name:').fill('Ms');
      await this.page.getByLabel('Email:').fill(email);
      await this.page.locator('#Password').fill('Test@123');
      await this.page.getByLabel('Confirm password:').fill('Test@123');

      await clickWhenVisible(this.page.getByRole('button', { name: 'Register' }));

      // Wait for registration success message
      await expect(this.page.locator('body')).toContainText('Your registration completed', { timeout: 10000 });

      // continue navigation
      const continueBtn = this.page.getByRole('button', { name: 'Continue' });
      if (await continueBtn.isVisible().catch(() => false)) await continueBtn.click();

      // search for the product and navigate to the product page
      const search = this.page.locator('#small-searchterms');
      await search.fill('Health Book');
      await search.press('Enter');

      // Wait for a product title in results (use a robust selector)
      const product = this.page.locator('a:has-text("Health Book")').first();
      await product.waitFor({ state: 'visible', timeout: 10000 });
      await product.click();

      // add to cart
      await clickWhenVisible(this.page.locator('#add-to-cart-button-22'));

      await expect(this.page.locator('p.content')).toHaveText('The product has been added to your shopping cart', { timeout: 10000 });
      console.log("🛒Product added to shopping cart");
      // logout
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

      // screenshot on failure
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join('screenshots', `failure-${timestamp}.png`);

      // Make sure screenshots folder exists
      fs.mkdirSync('screenshots', { recursive: true });

      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📷 Screenshot saved to: ${screenshotPath}`);

      throw error; // Rethrow so test fails
    } finally {
      // Do not close browser here - caller/test should handle lifecycle.
    }
    // return email & password so a calling test can verify login
    return { email, password };
  }
}
