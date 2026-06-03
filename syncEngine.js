const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const NEYNAR_API_URL = "https://api.neynar.com/v2";
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || "MOCK_KEY";

class NeynarIdentitySync {
    /**
     * Fetches detailed cryptographic identity maps for a target Farcaster ID.
     * @param {number} fid Farcaster User ID string.
     */
    async fetchUserIdentity(fid) {
        console.log(`[Neynar Sync] Querying identity mapping parameters for FID: ${fid}`);
        
        try {
            // Configuration parameters for the Neynar REST endpoint
            const response = await axios.get(`${NEYNAR_API_URL}/user/bulk?fids=${fid}`, {
                headers: {
                    'api_key': NEYNAR_API_KEY,
                    'accept': 'application/json'
                }
            });

            if (response.data && response.data.users) {
                const user = response.data.users[0];
                const identityMap = {
                    fid: user.fid,
                    username: user.username,
                    custodyAddress: user.custody_address,
                    verifiedAddresses: user.verified_addresses?.eth_addresses || []
                };
                
                console.log(`[Success] Synced Profile: @${identityMap.username} | Custody: ${identityMap.custodyAddress}`);
                return identityMap;
            }
        } catch (error) {
            console.error(`[RPC Error] Failed to retrieve Neynar social attributes:`, error.message);
        }
    }
}

const synchronizer = new NeynarIdentitySync();

// Express webhook endpoint for real-time Hub state notifications
app.post('/webhook/farcaster-event', async (req, res) => {
    const { type, data } = req.body;
    console.log(`[Webhook Received] Event Type: ${type}`);
    
    if (type === 'user.update') {
        await synchronizer.fetchUserIdentity(data.fid);
    }
    
    return res.status(200).json({ status: "Event acknowledged" });
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log(`Identity Sync Engine listening on port: ${PORT}`));

module.exports = NeynarIdentitySync;
