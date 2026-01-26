import { motion, AnimatePresence } from "framer-motion";
import { Toggle, ModeButton, LevelGroup } from "./typingNavbarComponents";

type Mode = "time" | "words" | "zen";
type Level = 1 | 2 | 3 | null;

type TypingNavbarProps = {
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  punctuation: boolean;
  setPunctuation: React.Dispatch<React.SetStateAction<boolean>>;
  numbers: boolean;
  setNumbers: React.Dispatch<React.SetStateAction<boolean>>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  level: Level;
  setLevel: React.Dispatch<React.SetStateAction<Level>>;
};

export function TypingNavbar({
  timer,
  setTimer,
  punctuation,
  setPunctuation,
  numbers,
  setNumbers,
  mode,
  setMode,
  level,
  setLevel,
}: TypingNavbarProps) {
  const isZen = mode === "zen";
  return (
    <div className="flex items-center justify-center gap-6 select-none my-5 h-16">
      <AnimatePresence mode="popLayout">
        {!isZen && (
          <motion.div
            key="timer-display"
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="px-6 py-3 rounded-xl border border-neutral-700 bg-neutral-900 text-white"
          >
            {timer}s
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="flex items-center gap-6 px-8 py-3 border border-neutral-700 bg-neutral-900 rounded-full overflow-hidden"
      >
        <AnimatePresence mode="popLayout">
          {!isZen && (
            <motion.div
              key="toggles"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-6 overflow-hidden whitespace-nowrap"
            >
              <Toggle
                label="Punctuation"
                active={punctuation}
                onClick={() => setPunctuation((p) => !p)}
              />
              <Toggle
                label="Numbers"
                active={numbers}
                onClick={() => setNumbers((n) => !n)}
              />
              <div className="w-px h-4 bg-neutral-700 mx-2" />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div layout className="flex gap-4">
          <ModeButton
            label="Time"
            active={mode === "time"}
            onClick={() => {
              setMode("time");
              setLevel(1);
              setTimer(60);
            }}
          />
          <ModeButton
            label="Words"
            active={mode === "words"}
            onClick={() => {
              setMode("words");
              setLevel(1);
            }}
          />
          <ModeButton
            label="Zen"
            active={mode === "zen"}
            onClick={() => {
              setMode("zen");
              setLevel(null);
            }}
          />
        </motion.div>

        <AnimatePresence mode="popLayout">
          {!isZen && (
            <motion.div
              key="level-group"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-6 overflow-hidden whitespace-nowrap">
              <div className="w-px h-4 bg-neutral-700 mx-2" />

              {mode === "time" ? (
                <LevelGroup
                  key="time-levels"
                  values={[30, 60, 120]}
                  active={level}
                  onSelect={(newLevel) => {
                    setLevel(newLevel as Level);
                    if (newLevel === 1) setTimer(30);
                    if (newLevel === 2) setTimer(60);
                    if (newLevel === 3) setTimer(120);
                  }}
                />
              ) : (
                <LevelGroup
                  key="word-levels"
                  values={[25, 50, 100]}
                  active={level}
                  onSelect={(v) => {
                    setLevel(v as Level);
                    setTimer(0);
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}