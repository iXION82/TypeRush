import { useState } from 'react';
import { Navbar } from '../components/navbar';
import { ArrowLeft, Save, FileText, CheckCircle2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function AdminTextPage() {
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [mode, setMode] = useState<'time' | 'words' | 'zen'>('words');
    const [includeNumbers, setIncludeNumbers] = useState(false);
    const [includePunctuation, setIncludePunctuation] = useState(false);
    const [language, setLanguage] = useState('english');
    const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            setStatus({ type: 'error', message: 'Text content cannot be empty.' });
            return;
        }

        try {
            await api.post('/text/add', {
                content,
                mode,
                includeNumbers,
                includePunctuation,
                language
            });

            setStatus({ type: 'success', message: 'Text added successfully!' });
            setContent('');

            setTimeout(() => {
                setStatus({ type: 'idle', message: '' });
            }, 3000);
        } catch (error) {
            console.error('Failed to add text:', error);
            setStatus({ type: 'error', message: 'Failed to add text to the database.' });
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
                <Navbar />

                <main className="max-w-md mx-auto px-6 py-12 flex flex-col pt-32">
                    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 flex flex-col gap-6 items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-br from-zinc-100 to-zinc-500 bg-clip-text text-transparent mb-2">Admin Access</h2>
                            <p className="text-sm text-zinc-500">Please enter the admin password to access the database management panel.</p>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (password === 'admin123') setIsAuthenticated(true);
                                else setStatus({ type: 'error', message: 'Incorrect password' });
                            }}
                            className="w-full flex flex-col gap-4"
                        >
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setStatus({ type: 'idle', message: '' }); }}
                                placeholder="Enter password..."
                                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3 text-zinc-200 focus:outline-none focus:border-amber-500/50 text-center tracking-widest"
                            />
                            {status.type === 'error' && (
                                <p className="text-red-400 text-xs">{status.message}</p>
                            )}
                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all"
                            >
                                Verify Access
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-12 flex flex-col pt-24">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-3 rounded-full hover:bg-zinc-800/80 transition-colors text-zinc-400 hover:text-zinc-100 mt-1"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-br from-zinc-100 to-zinc-500 bg-clip-text text-transparent flex items-center gap-3">
                            <FileText className="w-8 h-8 text-amber-400" />
                            Add Custom Text
                        </h1>
                        <p className="text-zinc-400 mt-1 text-sm">
                            Add new typing content directly into the database.
                        </p>
                    </div>
                </div>

                <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        { }
                        <div className="flex flex-col gap-2">
                            <label className="text-sm uppercase tracking-widest text-zinc-400 font-bold ml-1">
                                Text Passage
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Type or paste the passage here..."
                                className="w-full h-48 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 text-zinc-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-y transition-all placeholder:text-zinc-600"
                            />
                            <div className="text-xs text-zinc-500 self-end mr-1 font-mono">
                                {content.trim() ? content.trim().split(/\s+/).length : 0} words
                            </div>
                        </div>

                        { }
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            { }
                            <div className="flex flex-col gap-2">
                                <label className="text-sm uppercase tracking-widest text-zinc-400 font-bold ml-1">
                                    Target Mode
                                </label>
                                <select
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value as any)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3 text-zinc-200 focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
                                >
                                    <option value="words">Words Mode</option>
                                    <option value="time">Time Mode</option>
                                    <option value="zen">Zen Mode</option>
                                </select>
                            </div>

                            { }
                            <div className="flex flex-col gap-2">
                                <label className="text-sm uppercase tracking-widest text-zinc-400 font-bold ml-1">
                                    Language
                                </label>
                                <input
                                    type="text"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    placeholder="english"
                                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3 text-zinc-200 focus:outline-none focus:border-amber-500/50"
                                />
                            </div>

                            { }
                            <div className="sm:col-span-2 flex items-center gap-6 mt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${includePunctuation ? 'bg-amber-500 border-amber-500' : 'bg-zinc-800 border-zinc-600 group-hover:border-zinc-400'}`}>
                                        {includePunctuation && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                                    </div>
                                    <span className="text-sm text-zinc-300 select-none">Has Punctuation</span>
                                    <input type="checkbox" className="hidden" checked={includePunctuation} onChange={(e) => setIncludePunctuation(e.target.checked)} />
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${includeNumbers ? 'bg-amber-500 border-amber-500' : 'bg-zinc-800 border-zinc-600 group-hover:border-zinc-400'}`}>
                                        {includeNumbers && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                                    </div>
                                    <span className="text-sm text-zinc-300 select-none">Has Numbers</span>
                                    <input type="checkbox" className="hidden" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} />
                                </label>
                            </div>

                        </div>

                        { }
                        <div className="flex items-center justify-between mt-4 pt-6 border-t border-zinc-800/50">
                            <div className="flex-1">
                                {status.type === 'success' && (
                                    <span className="text-emerald-400 text-sm flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> {status.message}
                                    </span>
                                )}
                                {status.type === 'error' && (
                                    <span className="text-red-400 text-sm flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> {status.message}
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold flex items-center gap-2 hover:bg-amber-400 transition-all hover:-translate-y-0.5"
                            >
                                <Save className="w-5 h-5" />
                                Save to Database
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
