const { PublicKey } = require('@solana/web3.js');

async function checkAuthorities(connection, mintAddress) {
    try {
        const mintInfo = await connection.getParsedAccountInfo(new PublicKey(mintAddress));
        if (!mintInfo.value || !mintInfo.value.data || !mintInfo.value.data.parsed) {
            return {
                hasMintAuthority: false,
                hasFreezeAuthority: false,
                mintAuthority: null,
                freezeAccount: null
            };
        }

        const { mintAuthority, freezeAuthority } = mintInfo.value.data.parsed.info;

        return {
            hasMintAuthority: !!mintAuthority,
            hasFreezeAuthority: !!freezeAuthority,
            mintAuthority: mintAuthority || null,
            freezeAccount: freezeAuthority || null
        };
    } catch (error) {
        console.error("Error checking authorities for mint address:", mintAddress, error);
        return {
            hasMintAuthority: false,
            hasFreezeAuthority: false,
            mintAuthority: null,
            freezeAccount: null
        };
    }
}

module.exports = { checkAuthorities }; 