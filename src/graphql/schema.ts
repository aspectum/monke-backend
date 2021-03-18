import { buildSchema } from 'graphql';

export default buildSchema(`
    input AlertData {
        url: String
        targetPrice: Float
    }

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
    }

    type Alert {
        id: ID!
        targetPrice: Float
        updatedAt: String
        createdAt: String
        product: Product
    }

    type RootQuery {
        getAlerts: [Alert]!
        getSingleAlert(id: ID!): Alert
    }

    type RootMutation {
        createAlert(alertData: AlertData!): Alert!
        editAlert(id: ID!, newPrice: Float): Alert!
        deleteAlert(id: ID!): Alert!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
