import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from "react-router-dom";
import { setAccessToken } from "../auth/tokenService";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';

const RegisterPage = () => {

    const navigate = useNavigate();
    const [name, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            setIsLoading(true);

            const res = await api.post("/auth/register", {
                name,
                email,
                password
            });

            const { accesstoken, user } = res.data;
            setAccessToken(accesstoken);
            localStorage.setItem("userId", user._id);

            navigate("/");

        }catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else if (
                typeof err === "object" &&
                err !== null &&
                "response" in err
            ) {
                const axiosError = err as {
                    response?: { data?: { message?: string } };
                };
                setError(
                    axiosError.response?.data?.message || "Registration failed"
                );
            } else {
                setError("Registration failed");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-black/50 p-4">
            <div className="
                w-full 
                max-w-md 
                rounded-3xl 
                bg-zinc-900/70 
                backdrop-blur-xl 
                border border-zinc-700/40 
                shadow-2xl 
                p-8 
                sm:p-10
                font-mono
                relative
                overflow-hidden
            ">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-zinc-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="mb-8 text-center relative z-10">
                    <h1 className="text-3xl font-bold text-zinc-100 mb-2 tracking-tight">
                        Create <span className="text-amber-400">Account</span>
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Join the leaderboard. Start typing.
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5 relative z-10">
                    {error && (
                            <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded">
                                {error}
                            </div>
                        )}
                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-zinc-400 ml-1">
                            Username
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setUsername(e.target.value)}
                                className="
                                    w-full 
                                    bg-zinc-800/50 
                                    border border-zinc-700/50 
                                    text-zinc-200 
                                    text-sm 
                                    rounded-xl 
                                    pl-12 pr-4 py-3
                                    outline-none 
                                    focus:border-amber-500/50 
                                    focus:ring-1 focus:ring-amber-500/50 
                                    placeholder:text-zinc-600
                                    transition-all 
                                    duration-200
                                "
                                placeholder="command_line_hero"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-zinc-400 ml-1">
                            Email
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="
                                    w-full 
                                    bg-zinc-800/50 
                                    border border-zinc-700/50 
                                    text-zinc-200 
                                    text-sm 
                                    rounded-xl 
                                    pl-12 pr-4 py-3
                                    outline-none 
                                    focus:border-amber-500/50 
                                    focus:ring-1 focus:ring-amber-500/50 
                                    placeholder:text-zinc-600
                                    transition-all 
                                    duration-200
                                "
                                placeholder="user@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-zinc-400 ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="
                                    w-full 
                                    bg-zinc-800/50 
                                    border border-zinc-700/50 
                                    text-zinc-200 
                                    text-sm 
                                    rounded-xl 
                                    pl-12 pr-12 py-3
                                    outline-none 
                                    focus:border-amber-500/50 
                                    focus:ring-1 focus:ring-amber-500/50 
                                    placeholder:text-zinc-600
                                    transition-all 
                                    duration-200
                                "
                                placeholder="Create a password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                     <div className="space-y-1">
                        <label className="text-xs uppercase tracking-widest text-zinc-400 ml-1">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="
                                    w-full 
                                    bg-zinc-800/50 
                                    border border-zinc-700/50 
                                    text-zinc-200 
                                    text-sm 
                                    rounded-xl 
                                    pl-12 pr-12 py-3
                                    outline-none 
                                    focus:border-amber-500/50 
                                    focus:ring-1 focus:ring-amber-500/50 
                                    placeholder:text-zinc-600
                                    transition-all 
                                    duration-200
                                "
                                placeholder="Confirm password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="
                            w-full 
                            flex items-center justify-center gap-2
                            px-8 py-3.5 
                            rounded-xl 
                            bg-amber-500 
                            text-black 
                            font-bold 
                            tracking-wide
                            hover:bg-amber-400 
                            disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed
                            transition-all 
                            shadow-lg shadow-amber-500/20 
                            active:scale-95
                            mt-4
                        "
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Creating...</span>
                        ) : (
                            <>
                                Register <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center relative z-10">
                    <p className="text-zinc-500 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-zinc-300 font-semibold hover:text-amber-400 transition-colors">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;