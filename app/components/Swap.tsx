"use client"
import { assert } from "console";
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens"
import { useEffect } from "react";
import { ReactNode, use, useState } from "react"
import { Slabo_13px } from "next/font/google";
import { TokenBalance } from "@solana/web3.js";

export function Swap({publicKey, tokenBalances}: {
    publicKey: string;
    tokenBalances: {
        totalBalance: Number;
        token: TokenBalance;
    } | null;
} ) {
    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);
    const [baseAmount, setBaseAmount] = useState<string>();
    const [quoteAmount, setQuoteAmount] = useState<string>();

    useEffect(() => {
        if(!baseAmount) {
            return; 
        }

    },  [baseAsset, quoteAsset, baseAmount])

    return <div className="p-12 bg-slate-50">
          <div className="text-2xl font-bold pb-4">
            Swap Tokens
        </div>
        <SwapInputRow 
        amount={baseAmount}
        onAmountChange={(value : string) => {
            setBaseAmount(value);
        }}
         onSelect={(asset) => {
            setBaseAsset(asset)
        }} selectedToken={baseAsset} title={"You Pay"}
         topBorderEnabled={true}
         bottomBorderEnabled={false}
         subtitle={<div className="text-slate-500 pt-1 text-sm pl-1 flex">
                <div className="font-normal pr-1">
                    Current Balance:
                </div>
                <div className="font-semibold">
                    {tokenBalances?.tokens.find(x => x.name === baseAsset.name)?.balance} {baseAsset.name}
                </div>
            </div>}
        />
        <div className="flex justify-center"> 
            <div onClick={() => {
                let baseAssetTemp = baseAsset;
                setBaseAsset(quoteAsset);
                setQuoteAsset(baseAssetTemp);
            }}>

            </div>
            <div className="cursor-pointer rounded-full w-10 h-10 border absolute mt-[-20px] bg-white flex justify-center pt-2">
            <SwapIcon/>
            </div>

        </div>

        <SwapInputRow amount={quoteAmount} onSelect={(asset) => {
            setQuoteAsset(asset)
        }} selectedToken={quoteAsset} title={"You Recive"}
            topBorderEnabled={false} 
            bottomBorderEnabled={true}
            subtitle={<div className="text-slate-500 pt-1 text-sm pl-1 flex">
                <div className="font-normal pr-1">
                    Current Balance:
                </div>
                
            </div>}
            />
    </div>
    
}

export function SwapInputRow({onSelect, selectedToken, title, topBorderEnabled, bottomBorderEnabled, subtitle, amount, onAmountChange} : {
    onSelect : (asset: TokenDetails) => void;
    selectedToken: TokenDetails;
    title: string;
    topBorderEnabled: boolean;
    bottomBorderEnabled: boolean;
    subtitle: ReactNode;
    amount?: string;
    onAmountChange?: (value: string) => void;
}) {
    return <div className={`border flex justify-between p-6 ${topBorderEnabled ? "rounded-t-xl" : ""} ${bottomBorderEnabled ? "rounded-b-xl" : ""}`}>
        <div>
        <div className="text-xs font-semibold mb-1">
        {title}
        </div>
        <AssetSelector selectedToken={selectedToken} onSelect={onSelect}/>
        {subtitle}
        </div>
        <div>
            <input
            onChange={(e) => {
                onAmountChange?.(e.target.value);
            }} 
            placeholder="0" type="text" className="p-6 outline-none text-4xl" dir="rtl" value={amount}></input>
        </div>
    </div>

}

function AssetSelector({selectedToken, onSelect}: {
    selectedToken: TokenDetails;
    onSelect: (asset: TokenDetails) => void;
}) {
    return <div>
        <select onChange={(e) => {
            const selectedToken = SUPPORTED_TOKENS.find(x => x.name === e.target.value);
            if(selectedToken) {
                onSelect(selectedToken);
            }
        }} id="token-swap" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            {SUPPORTED_TOKENS.map(token => <option selected={selectedToken.name == token.name}>
                {token.name}
            </option>)}

        </select>
    </div>
}

function SwapIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
</svg>

    
}