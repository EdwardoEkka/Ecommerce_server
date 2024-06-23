const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    id:Number,
    title:String,
    price:Number,
    description:String,
    category:String,
    image:String,
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
