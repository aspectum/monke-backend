import scrapedDataParser from '../helpers/scrapedDataParser';
import { ProductData } from '../interfaces';
import { Product } from '../models/productModel';
import scrape from '../scraping/scraper';

// Defining product services
export default class ProductServices {
    static findProductByASIN(ASIN: string) {
        return Product.findById(ASIN).exec();
    }

    // Create product from scraped data (after parsing)
    static createProduct(productData: ProductData) {
        const { ASIN, url, title, imageUrl, currency, price } = productData;
        const newProd = new Product({
            _id: ASIN,
            url,
            title,
            imageUrl,
            currency,
            priceHistory: [
                {
                    price,
                },
            ],
            lowestPrice: {
                price,
            },
        });

        return newProd.save();
    }

    // Scraping and parsing url
    static scrapeUrl(url: string) {
        return scrape(url).then(scrapedDataParser);
    }
}
