export default interface ParsedData {
    ASIN: string;
    url: string;
    title: string;
    imageUrl: string;
    price: number;
    currency: string;
    error?: Error;
}
