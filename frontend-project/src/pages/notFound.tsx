import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden">
            <Navbar />

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/3 rounded-full blur-3xl" />
            </div>

            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 -mt-16">
                <div className="text-center">
                    <h1 className="text-[10rem] sm:text-[14rem] font-black leading-none bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-800 bg-clip-text text-transparent select-none tracking-tighter">
                        404
                    </h1>

                    <div className="relative -mt-8 mb-8">
                        <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-zinc-200 mb-3">
                        Page Not Found
                    </h2>
                    <p className="text-zinc-500 max-w-md mx-auto mb-10 leading-relaxed">
                        Looks like you've typed your way to a page that doesn't exist.
                        Even the fastest typists take a wrong turn sometimes.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 rounded-xl border border-zinc-700/50 text-zinc-300 font-medium flex items-center gap-2 hover:bg-zinc-800/60 hover:border-zinc-600 transition-all hover:-translate-y-0.5"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold flex items-center gap-2 hover:bg-amber-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/20"
                        >
                            <Home className="w-4 h-4" />
                            Back to Home
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
