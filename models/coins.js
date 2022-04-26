const mongoose = require("mongoose");

const CoinsSchema = new mongoose.Schema({
    Year: {
        type: Date,
        default: 0,
        required: true,
        validate(value) {
            if (value < 0) throw new Error("Coins were mande at a point in time!");
        },
    },
    Denomination: {
        type: Number,
        default: 0.1,
        required: true,
        validate(value) {
            if (value < 0) throw new Error("Coins always should have a denomination");
        },
    },
    Pic: {
        type: String,
        required: false,
        trim: false,
        lowercase: false,
    },
    History: {
        type: String,
        required: false,
        trim: false,
        lowercase: false,
    },
    Value: {
        type: Number,
        default: 0,
        required: false,
    },
});

const Coins = mongoose.model("Coins", CoinsSchema);

module.exports = Coins;