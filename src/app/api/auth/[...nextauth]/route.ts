import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { rsaUtils } from '@/lib/';
import * as db from '@/database';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                origin: {
                    label: "Origin",
                    type: "text",
                    placeholder: "Origin"
                },
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials, req) => {
                console.log("GERONIMO!")

                try {
                    const doc = await db.User.findOne({ email: credentials?.email });
                    
                    if(!doc) {
                        throw new Error('Credentials not found');
                    }

                    if (!credentials) {
                        throw new Error('Credentials not provided');
                    }

                    const passwordMatch = await bcrypt.compare(credentials.password, doc.password);
                    if(!passwordMatch) {
                        throw new Error('Invalid credentials');
                    }

                    return {
                        id: doc.id,
                        email: doc.email,
                        origin: doc.origin,
                        role: doc.role
                    };
                } catch(error) {
                    throw new Error('Unexpected error');
                }
            }
        })
    ],
    session: {
        strategy: 'jwt' as 'jwt',
        maxAge: 7 * 24 * 60 * 60 // 30 days in seconds
    },
    callbacks: {
        async jwt({ token, user, session }: { token: any, user?: any, session?: any }) {
            if(user) {
                token.authToken = rsaUtils.signToken({ id: user.id, email: user.email });
            }

            console.log("jwt callback", { token, user, session });
            return token;
        },
        async session({ token, user, session }: { token: any, user?: any, session?: any }) {
            session.user.authToken = token.authToken;
            
            console.log("session callback", { token, user, session });
            return session;
        }
    },
    debug: true,
    pages: {
        error: "/"
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };