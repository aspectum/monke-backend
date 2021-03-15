import puppeteer from 'puppeteer';

const scrape = async (amzUrl: string) => {
    // Setting up puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Disabling images, css and custom fonts
    await page.setRequestInterception(true);
    page.on('request', req => {
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

    await page.goto(amzUrl);

    const data = await page.evaluate(() => {
        const ASINElement = document.querySelector('input[name^="ASIN"]') as HTMLInputElement;
        const urlElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        const titleElement = document.querySelector('span#productTitle') as HTMLSpanElement;
        const imageElement = document.querySelector('img.a-dynamic-image') as HTMLImageElement;
        // let price = document.querySelector('span.a-color-price').innerText;
        const priceElement = document.querySelector('.kindle-price span') as HTMLSpanElement; // ebook only, but it's more reliable

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
};

module.exports = scrape;
