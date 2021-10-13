const mongoose = require('mongoose')

const addMedicinesSchema = mongoose.Schema({
    c_name: String,
    c_batch_no: String,
    d_expiry_date: String,
    n_balance_qty:Number,
    c_packaging:String,
    c_unique_code:Number,
    c_schemes:String,
    n_mrp:Number,
    c_manufacturer:String,
    hsn_code:Number,
});

const orderItemDetails = new mongoose.Schema({
    c_unique_id: Number,
    quantity: Number,
    c_name: String
});

const placeOrderSchema = mongoose.Schema({
    medicines: {
        type: [orderItemDetails]
    }
});

const Medicines = mongoose.model('Medicines', addMedicinesSchema);
const PlaceOrder = mongoose.model('OrderPlaced', placeOrderSchema);

module.exports = { Medicines, PlaceOrder };