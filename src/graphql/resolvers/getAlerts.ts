export default () => {
    // https://stackoverflow.com/questions/49047259/how-to-parse-graphql-request-string-into-an-object
    // import { parse } from 'graphql';
    // console.log(parse(req.body.query).definitions[0].selectionSet.selections[0]);

    const priceHistory = [
        {
            price: 54.23,
            date: '2021-03-08T19:55:13.096Z',
        },
        {
            price: 54.23,
            date: '2021-03-08T19:55:13.096Z',
        },
        {
            price: 54.23,
            date: '2021-03-08T19:55:13.096Z',
        },
    ];

    const product = {
        url: 'https://www.amazon.com.br/Poppy-War-Novel-English-ebook/dp/B072L58JW6',
        title: 'The Poppy War: A Novel (English Edition)',
        imageUrl: 'https://m.media-amazon.com/images/I/41Zuy1tdP9L._SY346_.jpg',
        currency: 'BRL',
        priceHistory,
    };

    const alert = {
        id: '604681218e22a462394db81b',
        ASIN: 'B072L58JW6',
        targetPrice: 49.98,
        createdAt: '2021-03-08T19:55:13.096Z',
        updatedAt: '2021-03-11T20:57:19.347Z',
        productDetails: product,
    };

    return [alert];
};
