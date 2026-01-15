import { Connection } from "@solana/web3.js"
import axios from "axios";

let LAST_UPDATED: number | null = null;
let prices: {[key: string]: {
    price: string;
}} = {};

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // after 60s token will refresh
const access_key = process.env.ACCESS_KEY!;


export interface TokenDetails {
    name: string;
    mint : string;
    native: boolean;
    image:   string;
    price?: string;
}
export const SUPPORTED_TOKENS : TokenDetails[] = [{
    name: "USDC",
    mint : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native: false,
    image: "",
    price : "1"
   
},
{
    name: "USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    native: false,
    image: "",
    price: "1",
},
{
    name: "SOL",
    mint: "So11111111111111111111111111111111111111111",
    native: true,
    image: "",
    price: "180",

    
}
]

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