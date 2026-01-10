import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from '@/app/db';

if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables");
}

const handler  = NextAuth({
    providers : [
        GoogleProvider ({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET, 
    callbacks : {
        async signIn({user, account, profile, email, credentials}) {
            if(account?.provider == 'google') {
                const email = user.email;
                if(!email) {
                    return false;
                }
                const userDb = await db.user.findFirst ({
                    where: {
                        username: email
                    }
                })
                if(userDb) {
                    return true;
                }
                await db.user.create({
                    data : {
                        username,
                        provider: "Google",
                        solWallet: {
                            publicKey : "",
                            privateKey: ""
                        },
                        inrWallet: {
                            create: {
                                balance: 0
                            }
                        }


                    }
                })
            }
            return false
        }
    }
})
export { handler as GET, handler as POST };