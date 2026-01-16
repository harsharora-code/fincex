
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
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBMfDxr1PrxlKVnOBktTGlNgXSVYUT0LB7Q&s",
    price : "1"
   
},
{
    name: "USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    native: false,
    image: "https://img.freepik.com/premium-psd/green-circle-with-large-t-it-that-is-labeled-t_767610-17.jpg?semt=ais_hybrid&w=740&q=80",
    price: "1",
},
{
    name: "SOL",
    mint: "So11111111111111111111111111111111111111111",
    native: true,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTOOhDi1KrwwS7G_H1yvSkMoiPhO3anGP8_w&s",
    price: "180",

    
}
]