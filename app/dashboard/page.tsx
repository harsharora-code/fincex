import { getServerSession } from "next-auth"
import {ProfileCard} from "../components/ProfileCard"
import {prisma as db} from "@/app/db"
import { authConfig } from "../lib/auth"
import { error } from "console";

async function getuserWallet() {
    const session = await getServerSession(authConfig);
    const userWallet = await db.solWallet.findFirst({
        where: {
            userId: session?.user?.uid
        },
        select : {
            publicKey: true
        },
    })
    if(!userWallet) {
        return {
            error : "No solana wallet associated to the user"
        }
    }
    return {error: null, userWallet}
}

export default async function dashboard() {

    const userWallet = await getuserWallet();

    if(userWallet?.error || !userWallet.userWallet?.publicKey)  {
        return <>
            No solana wallet found
        </>
    }
    return <div>
        <ProfileCard publicKey={userWallet.userWallet?.publicKey}/>
    </div>
}