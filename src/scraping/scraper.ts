import puppeteer from 'puppeteer';
import { ScrapingError } from '../helpers/customErrors';
import { RawProductData } from '../interfaces';

class Scraper {
    browser: puppeteer.Browser | null;
    context: puppeteer.BrowserContext | null;
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
                this.browser = await puppeteer.launch({
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-gpu',
                        '--disable-dev-shm-usage',
                        '--proxy-server="direct://"',
                        '--proxy-bypass-list=*',
                        '--no-zygote',
                    ],
                });

                this.context = await this.browser.createIncognitoBrowserContext();
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

            // Disabling images, css and custom fonts
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (
                    req.resourceType() === 'stylesheet' ||
                    req.resourceType() === 'font' ||
                    req.resourceType() === 'image'
                ) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

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
