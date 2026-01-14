"use client";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PrimaryButton } from "./Button";
import { useTokens } from "../api/hooks/useTokens";
export const ProfileCard = ({publicKey}: {
    publicKey: String
}) => {
    const session  = useSession();
    const router = useRouter();

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

            <Assets publicKey={publicKey}/>
            <div className="w-full flex px-10">
                
            </div>
            
           
        </div>
        
    </div>

}

function Assets({publicKey}: {
    publicKey: String
}) {
    const [copied, setCopied] = useState(false);

    const {tokenBalances, loading} = useTokens(publicKey);

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
          <div className="flex justify-between">
            <div>
                {tokenBalances?.totalBalance}
            </div>

          </div>
         <div>
            <PrimaryButton onClick={() => {
                navigator.clipboard.writeText(publicKey)
                setCopied(true)
            }}>{copied ? "copied": "Your Wallet Address"}</PrimaryButton>
         </div>
         <div>
            {JSON.stringify(tokenBalances?.tokens)}
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