import Nightmare from 'nightmare';
import { ScrapingError } from '../helpers/customErrors';
import { RawProductData } from '../interfaces';

// Scrape amazon page for ebook data
const scrape = async (amzUrl: string): Promise<RawProductData> => {
    const nightmare = new Nightmare({
        gotoTimeout: 60000,
        show: true,
        webPreferences: {
            images: false,
        },
    } as any);
    try {
        const data = ((await nightmare
            .goto(amzUrl)
            .evaluate(() => {
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
            })
            .end()) as unknown) as RawProductData;

        return data;
    } catch (err) {
        throw new ScrapingError(amzUrl);
    }
};

export default scrape;
