const axios = require('axios');

async function fetchTokenHolders(tokenAddress, decimals, totalSupply) {
    try {
        const endpoint = process.env.HELIUS_URL;
        const axiosConfig = { headers: { "Content-Type": "application/json" } };
        const requestData = {
            jsonrpc: "2.0",
            id: "my-id",
            method: "getTokenLargestAccounts",
            params: {
                mintAddress: tokenAddress
            }
        };

        const response = await axios.post(endpoint, requestData, axiosConfig);
        if (!response.data || !response.data.result || !response.data.result.value) {
            return [];
        }

        const holders = response.data.result.value
            .map(holder => {
                const balance = holder.amount / Math.pow(10, decimals);
                return {
                    address: holder.address,
                    balance: balance,
                    percentage: totalSupply ? (balance / totalSupply) * 100 : 0
                };
            })
            .sort((a, b) => b.balance - a.balance)
            .slice(0, 5);

        return holders;
    } catch (error) {
        console.error("Error fetching token holders:", error);
        return [];
    }
}

module.exports = { fetchTokenHolders }; 