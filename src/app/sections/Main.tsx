import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Main() {
    const { data: session } = useSession();

    useEffect(() => {
        if(!session) {
            signIn();
        }
    }, []);

    return (
        <div className="w-full flex items-center justify-center scroll-smooth">
            <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="text-4xl font-bold text-[#f0f0f0]">Hello World</div>
            </div>
        </div>
    );
}