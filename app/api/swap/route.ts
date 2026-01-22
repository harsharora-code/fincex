// import { headers } from "next/headers";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest) {
//     const data: {
//         quoteResponse: any
//     } = await req.json();

//     const {swapTranscation} = await (
//         await fetch("https://api.jup.ag/swap/v1/quote?", {
//             method: POST,
//             {
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     quoteResponse,
//                 })
//             }
//         })
//     )
// }