import { Connection } from "@solana/web3.js"
import axios from "axios";
import { SUPPORTED_TOKENS } from "./tokens";
let LAST_UPDATED: number | null = null;
let prices: {[key: string]: {
    price: string;
}} = {};

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // after 60s token will refresh
const access_key = process.env.ACCESS_KEY!;

export const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/LHM3AM5UJnB6WkbyMX_2O");

export async function getSupportedTokens() {
    if(!LAST_UPDATED || new Date().getTime() - LAST_UPDATED < TOKEN_PRICE_REFRESH_INTERVAL) {

       try {
    const response = await axios.get(
      "https://api.coinlayer.com/api/live",
      {
        params: {
          access_key: access_key,
        },
      }
    );

    prices = response.data?.rates;
     LAST_UPDATED = new Date().getTime();
   
  } catch (e: any) {
    console.error("Coinlayer error:", e.response?.data || e.message);

  
    if (prices) return prices;

    throw e;
  }
          
    }
    return SUPPORTED_TOKENS.map(s => ({
        ...s,
        prices: prices[s.name],
    }))
}
getSupportedTokens();