import chalk from 'chalk';
import { UpdateAllProductsError } from '../helpers/customErrors';
import scrapedDataParser from '../helpers/scrapedDataParser';
import { ProductData, ProductDocument } from '../interfaces';
import { Product } from '../models/productModel';
import { scraper } from '../scraping/scraper';
import { saveError } from './errorServices';

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
        return scraper.scrape(url).then((data) => {
            // Is null in case of timeout
            if (data === null) {
                return null;
            }
            return scrapedDataParser(data);
        });
    }

    // update priceHistory
    static updatePriceHistory(product: ProductDocument) {
        return this.scrapeUrl(product.url)
            .then((data) => {
                if (data === null) {
                    console.log(
                        `Updating price for ${chalk.red(product.title)} failed. Trying again later.`
                    );
                    return null;
                }

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
            })
            .then((result) => {
                // If it failed, return the product to try again, else return null and move on
                if (result === null) {
                    return product;
                }
                return null;
            });
    }

    // Recursive function to try again in case of failure
    static updateTheseProducts(
        products: ProductDocument[],
        tries: number
    ): Promise<ProductDocument[]> {
        return scraper
            .closeBrowser() // Closing and opening browser
            .then(() => scraper.checkBrowser())
            .then(() => {
                return Promise.all(
                    products.map((prod, index) => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(this.updatePriceHistory(prod));
                            }, Math.floor(index / 5) * 10000); // Scrape a batch of 5 every 10 seconds
                        });
                    })
                ) as Promise<Array<ProductDocument | null>>;
            })
            .then((values) => {
                const failures = values.filter((val) => val !== null) as ProductDocument[];

                // If everyone succeeded, OR
                // Max number of attempts (recursion limit)
                if (failures.length === 0 || tries > 3) {
                    return failures;
                }
                console.log(`${failures.length} products failed to update prices. Trying again.`);
                return this.updateTheseProducts(failures, tries + 1);
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
                return this.updateTheseProducts(products, 1);
            })
            .then((failures) => {
                const timeDiff = Math.round((Date.now() - startTime) / 1000);
                if (failures.length === 0) {
                    console.log(
                        chalk.yellow(`Updated the prices of ${len} products in ${timeDiff} seconds`)
                    );
                } else {
                    console.log(chalk.red(`Failed to update all products in ${timeDiff} seconds`));
                    // Don't throw this, but save it to DB
                    const e = new UpdateAllProductsError(failures);
                    saveError(e);
                }
                return scraper.closeBrowser();
            })
            .then(() => process.exit())
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }
}
