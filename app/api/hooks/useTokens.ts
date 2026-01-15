import { TokenDetails } from "@/app/lib/constants";
import axios from "axios";
import { useEffect, useState } from "react";

export interface TokenBalance extends TokenDetails {
    balance: string;
    usdBalance: string;
}

export function useTokens(address : String) {

    const [tokenBalances, setTokenBalances] = useState<{
           totalBalance: number,
           tokens: TokenBalance[]
    } | null> (null);
     const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios.get(`/api/tokens?address=${address}`)
        .then(res => {
            setTokenBalances(res.data);
            setLoading(false);
        })
    })
    return {
        loading, tokenBalances
    }

}