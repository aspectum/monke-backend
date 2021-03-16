import { Schema, model } from 'mongoose';

import { ProductDocument } from '../interfaces';

// Defining the model for the products
const productSchema = new Schema<ProductDocument>({
    _id: {
        type: String,
    },
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    priceHistory: [
        {
            _id: false,
            price: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

export default model('Product', productSchema);
