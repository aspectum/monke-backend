import { buildSchema } from 'graphql';

export default buildSchema(`
    type Price {
        price: Float
        date: String
    }

    type Product {
        url: String
        title: String
        imageUrl: String
        currency: String
        priceHistory: [Price]
    }

    type Alert {
        id: ID!
        ASIN: String
        targetPrice: Float
        updatedAt: String
        createdAt: String
        productDetails: Product
    }

    type RootQuery {
        getAlerts: [Alert]!
    } 

    schema {
        query: RootQuery
    }
`);
