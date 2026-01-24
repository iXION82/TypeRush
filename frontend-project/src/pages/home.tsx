import { Navbar } from "../components/navbar";
import { TypingBox } from "../components/typingBox";

export function Home() {
    return (
        <div className="
            min-h-screen
            flex flex-col
            bg-linear-to-br
            from-neutral-950
            via-zinc-900
            to-black
            text-gray-200">
            <Navbar />

            <main className="flex-1 flex items-center justify-center px-4">
                <TypingBox />
            </main>
        </div>
    );
}
