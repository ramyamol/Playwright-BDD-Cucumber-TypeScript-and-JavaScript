import { setWorldConstructor } from "@cucumber/cucumber";
import { Page, Browser } from "playwright";

export class PlaywrightWorld {
    browser!: Browser;
    page!: Page;

    attach: any;

    constructor(options: any) {
        this.attach = options.attach;
    }
}

setWorldConstructor(PlaywrightWorld);

