"use client";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PrimaryButton, TabButton } from "./Button";
import { TokenBalance, useTokens } from "../api/hooks/useTokens";
import { TokenList } from "./TokenList";
import { Swap } from "./Swap";

type Tab = "tokens" | "add_funds" | "swap" | "send"|  "withdraw"
const tabs : {id: Tab; name: string}[] = [
    {id: "tokens", name: "Tokens"}, 
    {id: "add_funds", name: "Add Funds"}, 
    {id: "send", name: "Send"},
    {id: "withdraw", name: "Withdraw"},
     {id: "swap", name: "Swap"}, 
]
 export const ProfileCard = ({publicKey}: {
    publicKey: String
}) => {
    const session  = useSession();
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<Tab>("tokens");
    const {tokenBalances, loading} = useTokens(publicKey);

    if(session.status == "loading") {
        return <div>
            Loading....
        </div>
    }

    if(!session.data?.user) {
        router.push("/");
        return null;
    }

        return <div className="pt-8 flex justify-center">
        <div className="max-w-4xl bg-black rounded shadow w-full">
            <Greeting 
                image={session.data?.user?.image ?? ""} 
                name={session.data?.user?.name ?? ""} 
            />
        
    
         <div className="w-full flex px-10">
            
         
          {tabs.map(tab => <TabButton key={tab.id} active={tab.id === selectedTab} onClick={() => {
                    setSelectedTab(tab.id)
                }}>{tab.name}</TabButton>)}
            </div>
             <div className={`${selectedTab === "tokens" ? "visible" : "hidden"}`}><Assets publicKey={publicKey} tokenBalances={tokenBalances} loading={loading} /> </div>
             <div className={`${selectedTab === "swap" ? "visible" : "hidden"}`}><Swap publicKey={publicKey} tokenBalances={tokenBalances}
              /> </div>

            {/* <Assets publicKey={publicKey}/> */}
           
            
           
        </div>
        
    </div>

}

function Assets({publicKey, tokenBalances, loading}: {
    publicKey: String;
    tokenBalances: {
        totalBalances: number, 
        tokens: TokenBalance[]
    } | null;
    loading: boolean;
}) {
    const [copied, setCopied] = useState(false);


    useEffect(() => {
       if(copied) {
        let timeout = setTimeout(() => {
                setCopied(false)
            }, 3000)
             return () => {
                clearTimeout(timeout);
            }
       }
    }, [copied])
    return <div className="text-slate-500 mt-4">
     Account Assets
         <br />
          <div className="flex justify-between pt-2">
            <div className="flex">
            <div className="text-4xl font-bold text-white">
                ${tokenBalances?.totalBalance.toFixed(2)}
            </div>
            <div className="text-white font-bold text-2xl flex flex-col justify-end pb-0 pl-2">
                USD

            </div>

          </div>
          </div>
         <div>
            <PrimaryButton onClick={() => {
                navigator.clipboard.writeText(publicKey)
                setCopied(true)
            }}>{copied ? "copied": "Your Wallet Address"}</PrimaryButton>
         </div>
         <div>
              <TokenList tokens={tokenBalances?.tokens || []}/>
         </div>
    </div>
}

function Greeting({
    image, name
}: {
    image: string, name: string
}) {
    return <div className="flex p-12">
        <img src={image} className="rounded-full w-16 h-16 mr-4" />
        <div className="text-2xl font-semibold flex flex-col justify-center">
           Welcome back, {name}
        </div>
    </div>
}