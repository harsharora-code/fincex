import { Connection } from "@solana/web3.js"
import axios from "axios";

let LAST_UPDATED: number | null = null;
let prices: {[key: string]: {
    price: string;
}} = {};

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // after 60s token will refresh
const access_key = process.env.ACCESS_KEY;

export const SUPPORTED_TOKENS : {
    name: String,
    mint: String,
    native: boolean
}[] = [{
    name: "USDC",
    mint : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native: false
},
{
    name: "USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    native: false
},
{
    name: "SOL",
    mint: "So11111111111111111111111111111111111111111",
    native: true
}
]

export const connection = new Connection("https://api.mainnet-beta.solana.com");

export async function getSupportedTokens() {
    if(!LAST_UPDATED || new Date().getTime() - LAST_UPDATED < TOKEN_PRICE_REFRESH_INTERVAL) {

        try {
             const response = await axios.get(`https://api.coinlayer.com/api/live?access_key=${access_key}`);
          prices = response.data.rates;

          LAST_UPDATED = new Date().getTime();

        } catch(e) {
            console.log(e);
        }
          
    }
    return SUPPORTED_TOKENS.map(s => ({
        ...s,
        prices: prices[s.name],
    }))
}
getSupportedTokens();