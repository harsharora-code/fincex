import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { VersionedTransaction, Keypair, Connection} from "@solana/web3.js"
import { prisma as db } from "@/app/db"


export async function POST(req: NextRequest) {

    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const data: {
        quoteResponse: any
    } = await req.json();
     if (!data.quoteResponse) {
    return NextResponse.json(
      { error: "quoteResponse missing" },
      { status: 400 }
    );
  }
const session  = await getServerSession(authConfig);
if(!session?.user) {
    return NextResponse.json({
        msg: "You have not logged in"
    }, 
    {
        status: 401
    }
)
}

const solWallet = await db.solWallet.findFirst({
    where: {
        userId: session.user.uid
    }
})

if(!solWallet) {
    return NextResponse.json({
        msg: "Could not find associated solana wallet"
    }, 
    {
        status: 401
    }
)

}
const swapResponse = await (
await fetch('https://api.jup.ag/swap/v1/swap', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    quoteResponse: data.quoteResponse,
    userPublicKey: solWallet.publicKey.toString(),

    // ADDITIONAL PARAMETERS TO OPTIMIZE FOR TRANSACTION LANDING
    // See next guide to optimize for transaction landing
    dynamicComputeUnitLimit: true,
    dynamicSlippage: true,
    prioritizationFeeLamports: {
          priorityLevelWithMaxLamports: {
            maxLamports: 1000000,
            priorityLevel: "veryHigh"
          }
        }
    })
})
).json();
console.log("Swap response:", swapResponse);

const transactionBase64 = swapResponse.swapTransaction;
if (!swapResponse?.swapTransaction) {
  console.error("Swap API error:", swapResponse);
  return NextResponse.json(
    { error: "Swap transaction not returned", details: swapResponse },
    { status: 400 }
  );
}
var transaction = VersionedTransaction.deserialize(Buffer.from(transactionBase64, 'base64'));
const privateKey = getPrivateKeyFromDb(solWallet.privateKey);
transaction.sign([privateKey]);
// const latestBlockHash = await connection.getLatestBlockhash();

const transactionBinary = transaction.serialize();
console.log(transactionBinary);
const signature = await connection.sendRawTransaction(transactionBinary, {
    maxRetries: 2,
    skipPreflight: true
});
const confirmation = await connection.confirmTransaction({signature,}, "finalized");

if (confirmation.value.err) {
    throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}\nhttps://solscan.io/tx/${signature}/`);
} else console.log(`Transaction successful: https://solscan.io/tx/${signature}/`);

return NextResponse.json({
    signature
})
function getPrivateKeyFromDb(privateKey: string) {
    const arr = privateKey.split(",").map(x => Number(x));
    const privateKeyUnitArr = Uint8Array.from(arr);
    const keyPair  = Keypair.fromSecretKey(privateKeyUnitArr);
    return keyPair;
}
}