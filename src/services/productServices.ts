import chalk from 'chalk';
import util from 'util';
import scrapedDataParser from '../helpers/scrapedDataParser';
import { ProductData, ProductDocument } from '../interfaces';
import { Product } from '../models/productModel';
import scrape from '../scraping/scraper';
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

                let chain = (Promise.resolve() as unknown) as Promise<ProductDocument>;

                products.forEach((prod) => {
                    chain = chain
                        .then(() => this.updatePriceHistory(prod))
                        .catch((err) => {
                            console.log(err);

                            // Saving unexpected error to DB for later
                            saveError({
                                name: `UpdateAllProductsError: ${err.name}`,
                                errorSimple: util.inspect(err, false, null, true),
                                errorDetailed: util.inspect(err, true, null, true),
                            });

                            return prod;
                        }); // Needs this catch so that a single error doesn't interrupt the whole chain
                });

                return chain;
            })
            .then((values) => {
                const timeDiff = Math.round((Date.now() - startTime) / 1000);
                console.log(
                    chalk.yellow(`Updated the prices of ${len} products in ${timeDiff} seconds`)
                );
                process.exit();
            })
            .catch((err) => {
                console.log(err);

                // Saving unexpected error to DB for later
                saveError({
                    name: `UpdateAllProductsError: ${err.name}`,
                    errorSimple: util.inspect(err, false, null, true),
                    errorDetailed: util.inspect(err, true, null, true),
                });
            });
    }
}
