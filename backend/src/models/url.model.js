const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: true,
            trim: true
        },

        shortCode: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        clicks: {
            type: Number,
            default: 0
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        isCustom: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Url", urlSchema);