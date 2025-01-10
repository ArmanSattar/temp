const axios = require('axios');
const { Connection, PublicKey } = require('@solana/web3.js');
const Token = require('../models/Token');
const { checkAuthorities } = require('./checkAuthorities');
const { fetchTokenHolders } = require('./fetchTokenHolders');

async function getSupply(mintAddress) {
    try {
        const endpoint = process.env.HELIUS_URL;
        const connection = new Connection(endpoint);
        const tokenSupplyInfo = await connection.getTokenSupply(new PublicKey(mintAddress));
        return tokenSupplyInfo.value;
    } catch (error) {
        console.error("Error fetching token supply for mint address:", mintAddress, error);
        return null;
    }
}

async function fetchMetadata(uri) {
    try {
        const response = await axios.get(uri);
        return response.data;
    } catch (error) {
        console.error("Error fetching metadata from URI:", uri, error);
        return null;
    }
}

async function fetchTokens(walletAddress, userId) {
    const endpoint = process.env.HELIUS_URL;
    const axiosConfig = { headers: { "Content-Type": "application/json" } };
    const requestData = {
        jsonrpc: "2.0",
        id: 'my-id',
        method: "getAssetsByAuthority",
        params: {
            authorityAddress: walletAddress,
            page: 1,
            limit: 1000
        },
    };
    const tokenIds = [];

    try {
        const response = await axios.post(endpoint, requestData, axiosConfig);
        const connection = new Connection(endpoint);

        for (const asset of response.data.result.items) {
            const { id: tokenAddress } = asset;
            let token = await Token.findOne({ tokenAddress });
            const authorities = await checkAuthorities(connection, tokenAddress);
            const metadataUri = asset.content?.json_uri;
            const metadataJson = await fetchMetadata(metadataUri);
            const description = metadataJson?.description || asset.content?.metadata?.description;

            if (!token) {
                const tokenSupply = await getSupply(tokenAddress);
                if (!tokenSupply) {
                    continue;
                }
                const topHolders = await fetchTokenHolders(tokenAddress, tokenSupply.decimals, tokenSupply.uiAmount);

                token = new Token({
                    tokenAddress,
                    program: 1,
                    programName: asset?.ownership?.ownership_model,
                    tokenName: asset.content?.metadata?.name,
                    tokenSymbol: asset.content?.metadata?.symbol,
                    tokenPictureUrl: asset.content?.files[0]?.uri,
                    tokenSupply: tokenSupply.uiAmount || 0,
                    decimals: tokenSupply.decimals || 0,
                    metadata: {
                        name: asset.content?.metadata?.name,
                        symbol: asset.content?.metadata?.symbol,
                        uri: asset.content?.json_uri,
                    },
                    mutable: asset.mutable,
                    user: userId,
                    description: description,
                    freezeAddress: authorities.hasFreezeAuthority,
                    mintAuthority: authorities.hasMintAuthority,
                    mintAccount: authorities.mintAuthority,
                    freezeAccount: authorities.freezeAccount,
                    creator: asset.authorities[0]?.address,
                    topHolders
                });

                await token.save();
            } else {
                const topHolders = await fetchTokenHolders(tokenAddress, token.decimals, token.tokenSupply);
                await Token.updateOne({ tokenAddress }, {
                    $set: {
                        program: 1,
                        programName: asset?.ownership?.ownership_model,
                        tokenName: asset.content?.metadata?.name,
                        tokenSymbol: asset.content?.metadata?.symbol,
                        tokenPictureUrl: asset.content?.files[0]?.uri,
                        metadata: {
                            name: asset.content?.metadata?.name,
                            symbol: asset.content?.metadata?.symbol,
                            uri: asset.content?.json_uri,
                        },
                        mutable: asset.mutable,
                        user: userId,
                        description: description,
                        freezeAddress: authorities.hasFreezeAuthority,
                        mintAuthority: authorities.hasMintAuthority,
                        mintAccount: authorities.mintAuthority,
                        freezeAccount: authorities.freezeAccount,
                        topHolders,
                        creator: asset.authorities[0]?.address
                    }
                });
            }

            tokenIds.push(token._id.toString());
        }
    } catch (error) {
        console.error("Error fetching assets with Axios:", error);
    }
    return tokenIds;
}

module.exports = { fetchTokens, getSupply, fetchMetadata }; 