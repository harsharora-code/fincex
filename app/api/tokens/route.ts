
import { NextRequest, NextResponse } from "next/server";
import { getAssociatedTokenAddress, getAccount, getMint } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { SUPPORTED_TOKENS, connection, getSupportedTokens } from "@/app/lib/constants";


export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const address = searchParams.get("address");
    const supportedTokens = await getSupportedTokens();
  const balances = await Promise.all(SUPPORTED_TOKENS.map(token => getAccountBalance(token, address)))
  

const tokens = supportedTokens.map((token, index) => {
  const balance = Number(balances[index] ?? 0);
  const price =
    token.name === "USDC"
      ? 1
      : Number(token.prices ?? 0);

  return {
    ...token,
    balances: balance,
    usdBalance: (balance * price),
  };
});

const totalBalance = tokens.reduce(
  (acc, val) => acc + Number(val.usdBalance),
  0
);

return NextResponse.json({
  tokens,
  totalBalance: totalBalance,
});

// const tokens = supportedTokens.map((token, index) => ({
//         ...token,
//         balances: balances[index].toFixed(2),
//         usdBalance: (balances[index] * Number(token.price)).toFixed(2)
//     }));

//   return NextResponse.json({

//     tokens,
//     totalBalance: tokens.reduce(
//       (acc, val) => acc + Number(val.usdBalance),
//     0 
//   )

//   })

}

 async function getAccountBalance(token: {   // token, address need to check balance
    name: string;
    mint: string;
    native: boolean;
}, address: string) {
    if(token.native) {
        let balance = await connection.getBalance(new PublicKey(address));
        return balance / LAMPORTS_PER_SOL;

}

    const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), new PublicKey(address));

    try {

    const account = await getAccount(connection, ata);
    const mint  = await getMint(connection, new PublicKey(token.mint));
    return Number(account.amount)/ (10 ** mint.decimals );

    } catch(e) {
        return 0;
    }

}