import chalk from 'chalk';
import scrapedDataParser from '../helpers/scrapedDataParser';
import { ProductData, ProductDocument } from '../interfaces';
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

    // update priceHistory
    static updatePriceHistory(product: ProductDocument) {
        return this.scrapeUrl(product.url).then((data) => {
            console.log(`Updating price for ${chalk.green(product.title)}`); // TODO: remove
            const date = new Date();
            product.priceHistory.push({
                price: data.price,
                date,
            });
            if (data.price < product.lowestPrice.price) {
                product.lowestPrice = {
                    price: data.price,
                    date,
                };
            }
            return product.save();
        });
    }

    // update each product
    static updateAllProducts() {
        console.log(chalk.bgCyan('Updating product prices'));
        const startTime = Date.now();
        let len: number;
        return Product.find({})
            .exec()
            .then((products) => {
                len = products.length;
                return Promise.all(
                    products.map((prod, index) => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(this.updatePriceHistory(prod));
                            }, Math.floor(index / 5) * 10000); // Scrape a batch of 5 every 10 seconds
                        });
                    })
                );
            })
            .then((values) => {
                const timeDiff = Math.round((Date.now() - startTime) / 1000);
                console.log(
                    chalk.bgGreen(`Updated the prices of ${len} products in ${timeDiff} seconds`)
                );
            });
    }
}
