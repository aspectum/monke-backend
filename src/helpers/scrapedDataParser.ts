import { RawProductData, ProductData } from '../interfaces';
import { ProductValidationError } from './customErrors';

interface AmazonLocaleTable {
    [key: string]: string[];
}

const scrapedDataParser = (scrapedData: RawProductData): ProductData => {
    const re = /[0-9]+[.,]+[0-9]+/;
    // url_code: [Country, URL, ISO currency code, currency symbol]
    const amzCountries: AmazonLocaleTable = {
        br: ['Brazil', 'amazon.com.br', 'BRL', 'R$'],
        ca: ['Canada', 'amazon.ca', 'CAD', '$'],
        mx: ['Mexico', 'amazon.com.mx', 'MXN', '$'],
        com: ['United States', 'amazon.com', 'USD', '$'],
        cn: ['China', 'amazon.cn', 'CNY', '¥'],
        in: ['India', 'amazon.in', 'INR', '₹'],
        jp: ['Japan', 'amazon.co.jp', 'JPY', '¥'],
        sg: ['Singapore', 'amazon.sg', 'SGD', '$'],
        tr: ['Turkey', 'amazon.com.tr', 'TRY', '₺'],
        ae: ['United Arab Emirates', 'amazon.ae', 'AED', 'د.إ'],
        sa: ['Saudi Arabia', 'amazon.sa', 'SAR', '﷼'],
        fr: ['France', 'amazon.fr', 'EUR', '€'],
        de: ['Germany', 'amazon.de', 'EUR', '€'],
        it: ['Italy', 'amazon.it', 'EUR', '€'],
        nl: ['Netherlands', 'amazon.nl', 'EUR', '€'],
        pl: ['Poland', 'amazon.pl', 'PLN', 'zł'],
        es: ['Spain', 'amazon.es', 'EUR', '€'],
        se: ['Sweden', 'amazon.se', 'EUR', '€'],
        uk: ['United Kingdom', 'amazon.co.uk', 'GBP', '£'],
        au: ['Australia', 'amazon.com.au', 'AUD', '$'],
    };

    try {
        const priceValue = +scrapedData.price.match(re)![0].replace(',', '.'); // Getting price value from string
        const trimmedTitle = scrapedData.title.trim(); // Trimming white spaces from title
        const countryCode = scrapedData.url.split('/')[2].split('.').pop() as string; // Getting country code from url
        const currency = amzCountries[countryCode][2]; // Getting currency

        return {
            ...scrapedData,
            price: priceValue,
            title: trimmedTitle,
            currency,
        };
    } catch (err) {
        // If something goes wrong (e.g. price text doesn't match RE

        throw new ProductValidationError(scrapedData);
    }
};

export default scrapedDataParser;
