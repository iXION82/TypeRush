import { useMemo, useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { TypingNavbar } from "./typingNavbar";
import type { ScorePayload } from "../types/type";
import { createScoreAndUpdateUser } from "../controller/ScoreCreate";
import { fetchText } from "../controller/TextFetch";
import { useAuth } from "../context/AuthContext";
import { getLevelData } from "../utils/levelUtils";
import { useSettings } from "../context/SettingsContext";
type Mode = "time" | "words" | "zen";
type Level = 1 | 2 | 3 | null;
type State = "idle" | "playing" | "end";

export function TypingBox() {
    const { refreshProfile, user } = useAuth();
    const { settings } = useSettings();
    const userRef = useRef(user);
    useEffect(() => { userRef.current = user; }, [user]);
    const [text, setText] = useState("Loading...");
    const [fetchTrigger, setFetchTrigger] = useState(0);
    const words = useMemo(() => text.split(" "), [text]);

    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const [currentLetterIdx, setCurrentLetterIdx] = useState(0);
    const [typedWords, setTypedWords] = useState<string[]>([]);
    const [state, setState] = useState<State>("idle");
    const [stats, setStats] = useState({
        correctChar: 0,
        incorrectChar: 0
    });

    const [mode, setMode] = useState<Mode>("time");
    const [timer, setTimer] = useState(60);
    const [punctuation, setPunctuation] = useState(false);
    const [numbers, setNumbers] = useState(false);
    const [level, setLevel] = useState<Level>(2);

    const letterRefs = useRef<HTMLSpanElement[][]>([]);
    const caretRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const timerIntervalRef = useRef<number | null>(null);
    const scoreSubmittedRef = useRef(false);


    const getWordClass = (wordIdx: number) => {
        if (wordIdx < currentWordIdx) return "opacity-60";
        if (wordIdx === currentWordIdx) return "opacity-100";
        return "opacity-40";
    };

    const getLetterClass = (word: string, wordIdx: number, letterIdx: number) => {
        const typed = typedWords[wordIdx]?.[letterIdx];
        if (wordIdx < currentWordIdx) {
            return typed === word[letterIdx] ? "text-green-400" : "text-red-400";
        }
        if (wordIdx === currentWordIdx) {
            if (letterIdx === currentLetterIdx) return "text-amber-400";
            if (typed == null) return "text-zinc-400";
            return typed === word[letterIdx] ? "text-green-400" : "text-red-400";
        }
        return "text-zinc-400";
    };

    const clearTimer = useCallback(() => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    }, []);

    useLayoutEffect(() => {
        const caret = caretRef.current;
        const container = containerRef.current;
        if (!caret || !container) return;
        const letters = letterRefs.current[currentWordIdx];
        if (!letters) return;

        const prevLetter = letters[currentLetterIdx - 1];
        const currentLetter = letters[currentLetterIdx];

        let x = 0;
        let y = 0;

        if (prevLetter) {
            x = prevLetter.offsetLeft + prevLetter.offsetWidth;
            y = prevLetter.offsetTop + prevLetter.offsetHeight - caret.offsetHeight;
        } else if (currentLetter) {
            x = currentLetter.offsetLeft;
            y = currentLetter.offsetTop + currentLetter.offsetHeight - caret.offsetHeight;
        } else if (letters[0]) {
            x = letters[0].offsetLeft;
            y = letters[0].offsetTop + letters[0].offsetHeight - caret.offsetHeight;
        }

        caret.style.transform = `translate(${x - 1}px, ${y - 1}px)`;
        const visibleHeight = container.clientHeight;
        const caretHeight = caret.offsetHeight;
        const targetScroll = y - (visibleHeight / 2) + (caretHeight / 2);
        container.scrollTo({
            top: targetScroll > 0 ? targetScroll : 0,
            behavior: "smooth"
        });

    }, [currentWordIdx, currentLetterIdx, typedWords]);

    const startGameTimer = useCallback(() => {
        clearTimer();
        setState("playing");

        timerIntervalRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearTimer();
                    setState("end");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [clearTimer]);

    const getWordLimit = useCallback(() => {
        if (level === 1) return 25;
        if (level === 2) return 50;
        return 100;
    }, [level]);

    const startGameWords = useCallback(() => {
        clearTimer();
        setTimer(0);
        setState("playing");

        timerIntervalRef.current = setInterval(() => {

            setTimer(prev => prev + 1);
        }, 1000);
    }, [clearTimer]);
    const restartGame = () => {
        clearTimer();
        setState("idle");
        setCurrentWordIdx(0);
        setCurrentLetterIdx(0);
        setTypedWords([]);
        setStats({
            correctChar: 0,
            incorrectChar: 0
        });

        scoreSubmittedRef.current = false;

        if (mode === "time") {
            if (level === 1) setTimer(30);
            if (level === 2) setTimer(60);
            if (level === 3) setTimer(120);
        } else {
            setTimer(0);
        }
        setFetchTrigger(prev => prev + 1);
    };

    const difficultyMultiplier = useCallback(() => {
        let temp = 1;
        if (punctuation) temp += 0.5;
        if (numbers) temp += 0.5;
        return temp;
    }, [punctuation, numbers]);

    useEffect(() => {
        const loadText = async () => {
            let totalCount = 10000;
            if (mode === 'time') {
                totalCount = 650;
            } else if (mode === 'words') {
                totalCount = level === 1 ? 25 : level === 2 ? 50 : 100;
            }
            const newText = await fetchText({
                mode,
                count: totalCount,
                numbers,
                punctuation
            });
            setText(newText);
        };
        loadText();
    }, [mode, level, numbers, punctuation, fetchTrigger]);


    const getTimeElapsed = useCallback(() => {
        if (mode === "time") {
            if (level === 1) return 30;
            if (level === 2) return 60;
            if (level === 3) return 120;
            return 60;
        }
        return timer;
    }, [mode, level, timer]);


    const calculateStats = useCallback(() => {
        const timeElapsed = Math.max(1, getTimeElapsed());
        const minutes = timeElapsed / 60;
        const totalChars = stats.correctChar + stats.incorrectChar;

        const gross = (totalChars / 5) / minutes;
        const net = (stats.correctChar / 5) / minutes;
        const accuracy =
            totalChars === 0 ? 100 : (stats.correctChar / totalChars) * 100;

        const scoreVal = Math.ceil(net * (accuracy / 100) * difficultyMultiplier());

        return {
            gross: gross.toFixed(0),
            net: net.toFixed(0),
            accuracy: accuracy.toFixed(2),
            time: timeElapsed,
            score: scoreVal,
        };
    }, [stats, getTimeElapsed, difficultyMultiplier]);




    useEffect(() => {
        if (state === "end" || state === "idle") {
            clearTimer();
        }
    }, [state, clearTimer]);

    useEffect(() => {
        return () => {
            clearTimer();
        };
    }, [clearTimer]);

    useEffect(() => {
        if (state !== "end") return;
        if (scoreSubmittedRef.current) return;
        scoreSubmittedRef.current = true;

        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const result = calculateStats();
        const totalChars = stats.correctChar + stats.incorrectChar;
        const earnedExp = result.score;

        const currentExp = userRef.current?.exp ?? 0;
        const newTotalExp = currentExp + earnedExp;
        const { level: newLevel } = getLevelData(newTotalExp);

        const payload: ScorePayload = {
            scoreValue: result.score,
            accuracy: Number(result.accuracy),
            netWPM: Number(result.net),
            userId,
            gameMode: mode,
            punctuation,
            numbers,
            totalCharsTyped: totalChars,
            totalTimeTyped: result.time,
            exp: earnedExp,
            newLevel,
        };

        createScoreAndUpdateUser(payload).then(() => {
            refreshProfile();
        });
    }, [state]);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.length > 1 && e.key !== "Backspace" && e.key !== " ") return;

            if (state === "idle") {
                if (mode === "time") {
                    startGameTimer();
                } else if (mode === "words") {
                    startGameWords();
                } else if (mode === "zen") {
                    setState("playing");
                }
            } else if (state === "end") return;

            const currentTyped = typedWords[currentWordIdx] || "";
            const currentTargetWord = words[currentWordIdx];

            if (e.key === "Backspace") {
                if (currentLetterIdx > 0) {
                    const charDeleted = currentTyped[currentTyped.length - 1];
                    const charExpected = currentTargetWord[currentLetterIdx - 1];

                    if (charDeleted === charExpected) {
                        setStats((prev) => ({
                            ...prev,
                            correctChar: Math.max(0, prev.correctChar - 1),
                        }));
                    }

                    const updated = [...typedWords];
                    updated[currentWordIdx] = currentTyped.slice(0, -1);
                    setTypedWords(updated);
                    setCurrentLetterIdx((i) => i - 1);
                }
                return;
            }

            if (e.key === " ") {
                if (currentLetterIdx === 0 && currentTyped === "") return;

                const updated = [...typedWords];
                updated[currentWordIdx] = currentTyped;
                setTypedWords(updated);

                if (mode === "words") {
                    const limit = getWordLimit();
                    if (currentWordIdx + 1 >= limit) {
                        setState("end");
                        return;
                    }
                }

                setCurrentWordIdx((i) => i + 1);
                setCurrentLetterIdx(0);
                return;
            }

            const updated = [...typedWords];
            updated[currentWordIdx] = currentTyped + e.key;
            setTypedWords(updated);
            setCurrentLetterIdx((i) => i + 1);

            const charExpected = currentTargetWord[currentLetterIdx];

            if (charExpected && e.key === charExpected) {
                setStats((prev) => ({ ...prev, correctChar: prev.correctChar + 1 }));
            } else {
                setStats((prev) => ({ ...prev, incorrectChar: prev.incorrectChar + 1 }));
            }

            if (mode === "words") {
                const limit = getWordLimit();

                if (currentWordIdx === limit - 1) {

                    if (updated[currentWordIdx].length === currentTargetWord.length) {
                        setState("end");
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentLetterIdx, currentWordIdx, typedWords, words, state, mode, level, startGameTimer, startGameWords, getWordLimit]);
    const results = state === "end" ? calculateStats() : null;

    // Live stats — computed every render during play (cheap, no extra state)
    const liveStats = useMemo(() => {
        const totalChars = stats.correctChar + stats.incorrectChar;
        const accuracy = totalChars === 0 ? 100 : (stats.correctChar / totalChars) * 100;

        let elapsedSec: number;
        if (mode === "time") {
            const total = level === 1 ? 30 : level === 2 ? 60 : 120;
            elapsedSec = Math.max(1, total - timer);
        } else {
            elapsedSec = Math.max(1, timer);
        }
        const minutes = elapsedSec / 60;
        const wpm = Math.round((stats.correctChar / 5) / minutes);

        return { wpm, accuracy: accuracy.toFixed(1) };
    }, [stats, timer, mode, level]);

    return (
        <div className="flex items-center justify-center w-full">
            <div className="w-full max-w-5xl">
                <TypingNavbar
                    timer={timer}
                    setTimer={setTimer}
                    punctuation={punctuation}
                    setPunctuation={setPunctuation}
                    numbers={numbers}
                    setNumbers={setNumbers}
                    mode={mode}
                    setMode={setMode}
                    level={level}
                    setLevel={setLevel}
                    restartGame={restartGame}
                />
                <div
                    ref={containerRef}
                    className="
                        h-79
                        rounded-3xl
                        bg-zinc-900/70
                        backdrop-blur-xl
                        border border-zinc-700/40
                        shadow-2xl
                        px-10
                        py-8
                        text-xl
                        leading-relaxed
                        font-mono
                        overflow-hidden 
                        cursor-default
                        relative
                    ">
                    {state === "end" && results ? (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="
                                w-full
                                rounded-2xl
                                bg-zinc-900/90
                                backdrop-blur-2xl
                                border border-zinc-700/50
                                shadow-2xl
                                px-10
                                py-8
                                text-center
                                animate-fade-in
                            ">

                                <div className="mb-8">
                                    <div className="text-sm uppercase tracking-widest text-zinc-400">Total Score</div>
                                    <div className="text-5xl font-extrabold text-amber-400 mt-1 drop-shadow">{results.score}</div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                    <div className="rounded-xl bg-zinc-800/60 border border-zinc-700/40 py-4">
                                        <div className="text-xs uppercase tracking-wide text-zinc-400">Accuracy</div>
                                        <div className="text-xl font-semibold text-zinc-200">{results.accuracy}%</div>
                                    </div>
                                    <div className="rounded-xl bg-zinc-800/60 border border-zinc-700/40 py-4">
                                        <div className="text-xs uppercase tracking-wide text-zinc-400">Net WPM</div>
                                        <div className="text-xl font-semibold text-zinc-200">{results.net}</div>
                                    </div>
                                    <div className="rounded-xl bg-zinc-800/60 border border-zinc-700/40 py-4">
                                        <div className="text-xs uppercase tracking-wide text-zinc-400">Gross WPM</div>
                                        <div className="text-xl font-semibold text-zinc-200">{results.gross}</div>
                                    </div>
                                    <div className="rounded-xl bg-zinc-800/60 border border-zinc-700/40 py-4">
                                        <div className="text-xs uppercase tracking-wide text-zinc-400">Time</div>
                                        <div className="text-xl font-semibold text-zinc-200">{results.time}s</div>
                                    </div>
                                </div>

                                <button
                                    onClick={restartGame}
                                    className="
                                        px-8 py-3 rounded-xl bg-amber-500 text-black font-bold tracking-wide
                                        hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/30 active:scale-95
                                    ">
                                    Restart
                                </button>
                            </div>
                        </div>

                    ) : (<div className="relative select-none leading-relaxed wrap-break-word">
                        <span
                            ref={caretRef}
                            className={`
                                absolute
                                ${settings.caretStyle === 'line' ? 'w-0.5 h-[1em] bg-amber-500 rounded' :
                                    settings.caretStyle === 'block' ? 'w-[0.6em] h-[1em] bg-amber-500/50 rounded-sm' :
                                        'w-[0.6em] h-[0.14em] bg-amber-500 rounded-full translate-y-[0.1em]'}
                                animate-pulse
                                ${settings.smoothCaret ? 'transition-all duration-75 ease-out' : ''}
                                z-10
                            `}
                        />

                        {words.map((word, wordIdx) => {
                            const typed = typedWords[wordIdx] || "";
                            const extraLetters = typed.slice(word.length);

                            return (
                                <span
                                    key={wordIdx}
                                    className={`inline-block mr-3 mb-2 ${getWordClass(wordIdx)}`}>
                                    {word.split("").map((letter, letterIdx) => (
                                        <span
                                            key={letterIdx}
                                            ref={(el) => {
                                                if (!el) return;
                                                if (!letterRefs.current[wordIdx]) {
                                                    letterRefs.current[wordIdx] = [];
                                                }
                                                letterRefs.current[wordIdx][letterIdx] = el;
                                            }}
                                            className={`${getLetterClass(
                                                word,
                                                wordIdx,
                                                letterIdx
                                            )} transition-colors duration-150`}>
                                            {letter}
                                        </span>
                                    ))}
                                    {extraLetters.split("").map((letter, i) => (
                                        <span
                                            key={`extra-${i}`}
                                            ref={(el) => {
                                                if (!el) return;
                                                if (!letterRefs.current[wordIdx]) {
                                                    letterRefs.current[wordIdx] = [];
                                                }
                                                letterRefs.current[wordIdx][word.length + i] = el;
                                            }}
                                            className="text-red-400 opacity-80 transition-colors duration-150 border-b-2 border-red-500/50">
                                            {letter}
                                        </span>
                                    ))}
                                </span>
                            );
                        })}
                    </div>)}

                </div>

                <div className={`
                    mt-8 flex items-center justify-center gap-4
                    transition-all duration-1000 ease-out
                    ${state !== "end" && (settings.liveWpm || settings.liveAccuracy)
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"}
                `}>
                    {settings.liveWpm && (
                        <div className="
                            flex items-center gap-3
                            px-5 py-2.5 rounded-2xl
                            bg-zinc-900/80 backdrop-blur-xl
                            border border-zinc-700/50
                            shadow-xl shadow-amber-500/5
                        ">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">WPM</span>
                            <span className="text-amber-400 font-black tabular-nums text-xl leading-none drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">{liveStats.wpm}</span>
                        </div>
                    )}
                    {settings.liveAccuracy && (
                        <div className="
                            flex items-center gap-3
                            px-5 py-2.5 rounded-2xl
                            bg-zinc-900/80 backdrop-blur-xl
                            border border-zinc-700/50
                            shadow-xl shadow-emerald-500/5
                        ">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">ACC</span>
                            <span className="text-emerald-400 font-black tabular-nums text-xl leading-none drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">{liveStats.accuracy}%</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}