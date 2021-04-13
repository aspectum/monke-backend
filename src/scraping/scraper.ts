import { chromium } from 'playwright-chromium';
import { ScrapingError } from '../helpers/customErrors';
import { RawProductData } from '../interfaces';

// Scrape amazon page for ebook data
const scrape = async (amzUrl: string): Promise<RawProductData> => {
    let browser = null;

    try {
        // Setting up playwright
        browser = await chromium.launch({
            headless: true,
            chromiumSandbox: false,
        });
        const page = await browser.newPage();

        // Disabling images, css and custom fonts
        page.route(
            /(\.png$)|(\.jpg$)|(\.jpeg$)|(\.gif$)|(\.css$)|(\.woff$)|(\.woff2$)/,
            (route) => {
                route.abort();
            }
        );

        await page.goto(amzUrl, { timeout: 60000 });

        try {
            const data = await page.evaluate(() => {
                const ASINElement = document.querySelector(
                    'input[name^="ASIN"]'
                ) as HTMLInputElement;
                const urlElement = document.querySelector(
                    'link[rel="canonical"]'
                ) as HTMLLinkElement;
                const titleElement = document.querySelector('span#productTitle') as HTMLSpanElement;
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
            await browser.close();

            return data;
        } catch (err) {
            throw new ScrapingError(amzUrl);
        }
    } catch (err) {
        throw err;
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};

// scrape('https://www.amazon.com.br/dp/B017OMXR7O/').then(console.log);

export default scrape;
