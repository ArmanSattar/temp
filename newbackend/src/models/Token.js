const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    tokenAddress: {
        type: String,
        required: true,
        unique: true
    },
    program: Number,
    programName: String,
    tokenName: String,
    tokenSymbol: String,
    tokenPictureUrl: String,
    tokenSupply: Number,
    decimals: Number,
    metadata: {
        name: String,
        symbol: String,
        uri: String
    },
    mutable: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectOwner'
    },
    description: String,
    freezeAddress: Boolean,
    mintAuthority: Boolean,
    mintAccount: String,
    freezeAccount: String,
    creator: String,
    topHolders: [{
        address: String,
        balance: Number,
        percentage: Number
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Token', tokenSchema); 