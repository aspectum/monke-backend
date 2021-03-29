import { buildSchema } from 'graphql';

export default buildSchema(`
    type Price {
        price: Float
        date: String
    }

    type Product {
        ASIN: String
        url: String
        title: String
        imageUrl: String
        currency: String
        priceHistory: [Price]
        lowestPrice: Price
    }

    type Alert {
        id: ID!
        title: String
        targetPrice: Float
        wasNotified: Boolean
        updatedAt: String
        createdAt: String
        product: Product
    }

    type RootQuery {
        getAlerts: [Alert]!
        getSingleAlert(id: ID!): Alert
    }

    type RootMutation {
        createAlert(url: String!, targetPrice: Float!): Alert!
        editAlert(id: ID!, newTitle: String, newPrice: Float): Alert!
        deleteAlert(id: ID!): Alert!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
