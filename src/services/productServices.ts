import { Product } from '../models/productModel';
import scrape from '../scraping/scraper';
import scrapedDataParser from '../helpers/scrapedDataParser';
import { ProductData, ProductDocument } from '../interfaces';

// Defining product services
export default class ProductServices {
    static findProductByASIN(ASIN: string) {
        return Product.findById(ASIN).then((product) => {
            return product;
        });
        // return ProductRepository.findProductById(ASIN).then((product) => {
        //     console.log(product);
        //     return product;
        // });
    }

    static createProduct(productData) {
        return ProductRepository.createProduct(productData).then((product) => {
            console.log(product);
            return product;
        });
    }

    static scrapeUrl(url) {
        return scrape(url).then((productData) =>
            // Processing scraped data
            scrapedDataParser(productData)
        );
    }
}
