import { VscLoading  } from "react-icons/vsc";

export default function Loading() {
    return (
        <div className="absolute top-0 left-0 w-screen h-screen bg-[#0a0a0a] backdrop-blur-xl">
            <div className="w-full h-full flex flex-col justify-center items-center absolute top-0 left-0 z-10">
                <div className="rounded-full animate-spin jsutify-center items-center text-6xl">
                    <VscLoading  />
                </div>
            </div>
        </div>
    )
}