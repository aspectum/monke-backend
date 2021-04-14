import { chromium, ChromiumBrowser, ChromiumBrowserContext } from 'playwright-chromium';
import { ScrapingError } from '../helpers/customErrors';
import { RawProductData } from '../interfaces';

class Scraper {
    browser: ChromiumBrowser | null;
    context: ChromiumBrowserContext | null;
    timeout!: NodeJS.Timeout;

    constructor() {
        this.browser = null;
        this.context = null;
        this.refreshTimeout();
    }

    // Setting up playwright
    // Create new browser and context
    async checkBrowser() {
        try {
            if (this.browser === null) {
                this.browser = await chromium.launch({
                    headless: true,
                    chromiumSandbox: false,
                    args: ['--disable-gpu', '--no-sandbox'],
                });

                this.context = await this.browser.newContext();

                // Disabling images, css and custom fonts
                await this.context.route(
                    /(\.png$)|(\.jpg$)|(\.jpeg$)|(\.gif$)|(\.css$)|(\.woff$)|(\.woff2$)/,
                    (route) => {
                        route.abort();
                    }
                );
            }
        } catch (err) {
            throw err;
        }
    }

    // Close browser to release resources
    async closeBrowser() {
        if (this.context !== null) {
            await this.context.close();
            this.context = null;
        }
        if (this.browser !== null) {
            await this.browser.close();
            this.browser = null;
        }
    }

    // Scrape amazon page for ebook data
    async scrape(amzUrl: string): Promise<RawProductData> {
        try {
            // Refreshes timeout each scrape call
            this.refreshTimeout();

            await this.checkBrowser();

            const page = await this.context!.newPage();

            await page.goto(amzUrl, { timeout: 60000 });

            try {
                const data = await page.evaluate(() => {
                    const ASINElement = document.querySelector(
                        'input[name^="ASIN"]'
                    ) as HTMLInputElement;
                    const urlElement = document.querySelector(
                        'link[rel="canonical"]'
                    ) as HTMLLinkElement;
                    const titleElement = document.querySelector(
                        'span#productTitle'
                    ) as HTMLSpanElement;
                    const imageElement = document.querySelector(
                        'img.a-dynamic-image'
                    ) as HTMLImageElement;
                    // let price = document.querySelector('span.a-color-price').innerText;
                    const priceElement = document.querySelector(
                        '.kindle-price span'
                    ) as HTMLSpanElement; // ebook only, but it's more reliable

                    return {
                        ASIN: ASINElement.value,
                        url: urlElement.href,
                        title: titleElement.innerText,
                        imageUrl: imageElement.src,
                        price: priceElement.innerText,
                    };
                });

                await page.close();

                return data;
            } catch (err) {
                throw new ScrapingError(amzUrl);
            }
        } catch (err) {
            throw err;
        }
    }

    refreshTimeout() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.closeBrowser, 120000); // Closes browser in 2 minutes
    }
}

export const scraper = new Scraper();
