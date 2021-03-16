// After scraping, before parsing
export interface RawProductData {
    ASIN: string;
    url: string;
    title: string;
    imageUrl: string;
    price: string;
}

// After parsing
export interface ProductData {
    ASIN: string;
    url: string;
    title: string;
    imageUrl: string;
    price: number;
    currency: string;
    error?: Error;
}
