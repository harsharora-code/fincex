
import { NextRequest, NextResponse } from "next/server";
import { getAssociatedTokenAddress, getAccount, getMint } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { SUPPORTED_TOKENS, connection, getSupportedTokens } from "@/app/lib/constants";


export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const searchQuery = searchParams.get("address");
    const supportedTokens = await getSupportedTokens();
  const balances = await Promise.all(SUPPORTED_TOKENS.map(token => getAccountBalance(token, address)))

  return NextResponse.json({
    tokens: supportedTokens.map((token, index) => ({
        ...token,
        balances: balances[index].toFixed(2),
    }))
  })

}

 async function getAccountBalance(token: {   // token, address need to check balance
    name: String,
    mint: String,
    native: boolean
}, address: String) {
    if(token.native) {
        let balance = await connection.getBalance(new PublicKey(address));
        return balance / LAMPORTS_PER_SOL;


    }

    const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), new PublicKey(address));
    const account = await getAccount(connection, ata);
    const mint  = await getMint(connection, new PublicKey(token.mint));
    return Number(account.amount)/ (10 ** mint.decimals )

}