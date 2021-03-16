import { Product } from '../models/productModel';
import scrape from '../scraping/scraper';
import scrapedDataParser from '../helpers/scrapedDataParser';
import { ProductData } from '../interfaces';

// Defining product services
export default class ProductServices {
    static findProductByASIN(ASIN: string) {
        return Product.findById(ASIN).exec();
    }

    static createProduct(productData: ProductData) {
        const { ASIN, url, title, imageUrl, currency, price } = productData;
        const newProd = new Product({
            _id: ASIN,
            url,
            title,
            imageUrl,
            currency,
            price_history: [
                {
                    price,
                },
            ],
        });

        return newProd.save();
    }

    static scrapeUrl(url: string) {
        return scrape(url).then((productData) => {
            // Processing scraped data
            return scrapedDataParser(productData);
        });
    }
}
