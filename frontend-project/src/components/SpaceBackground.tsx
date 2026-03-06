import { useEffect, useRef, useCallback } from "react";
import { useSettings, THEME_CONFIGS } from "../context/SettingsContext";

interface Star {
    x: number;
    y: number;
    radius: number;
    baseAlpha: number;
    alpha: number;
    twinkle: boolean;
    twinkleSpeed: number;
    twinklePhase: number;
    color: string;
}

interface ConstellationLine {
    from: number;
    to: number;
}

interface ConstellationGroup {
    lines: ConstellationLine[];
    alpha: number;
}

interface ShootingStar {
    x: number;
    y: number;
    length: number;
    speed: number;
    angle: number;
    alpha: number;
    life: number;
    maxLife: number;
}

const STAR_COUNT = 260;
const GLOW_RADIUS = 160;
const SCROLL_SPEED = 0.15;
const SHOOTING_STAR_INTERVAL_MIN = 8000;
const SHOOTING_STAR_INTERVAL_MAX = 14000;

const STAR_COLORS = [
    "255, 255, 255",
    "255, 248, 220",
    "200, 220, 255",
    "255, 223, 186",
    "220, 235, 255",
];

function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function createStars(width: number, height: number): Star[] {
    const fieldHeight = height * 2;
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        const sizeBucket = Math.random();
        const radiusRange = sizeBucket < 0.5 ? [0.2, 0.7] : sizeBucket < 0.8 ? [0.6, 1.2] : [1.0, 2.2];
        const baseAlpha = sizeBucket < 0.5 ? randomBetween(0.15, 0.4) : sizeBucket < 0.8 ? randomBetween(0.35, 0.7) : randomBetween(0.6, 1.0);

        stars.push({
            x: Math.random() * width,
            y: Math.random() * fieldHeight,
            radius: randomBetween(radiusRange[0], radiusRange[1]),
            baseAlpha,
            alpha: baseAlpha,
            twinkle: Math.random() < 0.18,
            twinkleSpeed: randomBetween(0.008, 0.025),
            twinklePhase: Math.random() * Math.PI * 2,
            color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
    }
    return stars;
}

const MAX_LINK_DIST = 120;
const MAX_CONSTELLATIONS = 10;
const CONSTELLATION_SPAWN_MIN = 3000;
const CONSTELLATION_SPAWN_MAX = 6000;

function spawnOneConstellation(stars: Star[], usedIndices: Set<number>): ConstellationGroup | null {
    const brightStars = stars
        .map((s, i) => ({ ...s, idx: i }))
        .filter(s => s.radius > 0.6 && !usedIndices.has(s.idx));

    if (brightStars.length < 4) return null;

    const seed = brightStars[Math.floor(Math.random() * brightStars.length)];
    const chain = [seed];
    usedIndices.add(seed.idx);

    const chainLen = Math.floor(randomBetween(4, 6));
    for (let i = 1; i < chainLen; i++) {
        const last = chain[chain.length - 1];
        const candidates = brightStars
            .filter(s => !usedIndices.has(s.idx))
            .map(s => ({ ...s, dist: Math.hypot(s.x - last.x, s.y - last.y) }))
            .filter(s => s.dist < MAX_LINK_DIST && s.dist > 15)
            .sort((a, b) => a.dist - b.dist);

        if (candidates.length === 0) break;
        const pick = candidates[0];
        chain.push(pick);
        usedIndices.add(pick.idx);
    }

    if (chain.length < 3) return null;

    const lines: ConstellationLine[] = [];
    for (let i = 0; i < chain.length - 1; i++) {
        lines.push({ from: chain[i].idx, to: chain[i + 1].idx });
    }
    // Close the shape
    lines.push({ from: chain[chain.length - 1].idx, to: chain[0].idx });

    return { lines, alpha: 0 };
}

export function SpaceBackground() {
    const { settings } = useSettings();
    const themeConfig = THEME_CONFIGS[settings.theme];

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const constellationsRef = useRef<ConstellationGroup[]>([]);
    const usedStarIndicesRef = useRef<Set<number>>(new Set());
    const mouseRef = useRef({ x: -9999, y: -9999, active: false });
    const smoothMouseRef = useRef({ x: -9999, y: -9999 });
    const shootingStarsRef = useRef<ShootingStar[]>([]);
    const animFrameRef = useRef<number>(0);
    const lastShootingRef = useRef(0);
    const lastConstellationRef = useRef(0);
    const nextConstellationDelay = useRef(
        randomBetween(CONSTELLATION_SPAWN_MIN, CONSTELLATION_SPAWN_MAX)
    );
    const scrollOffsetRef = useRef(0);
    const fieldHeightRef = useRef(0);
    const nextShootingDelay = useRef(
        randomBetween(SHOOTING_STAR_INTERVAL_MIN, SHOOTING_STAR_INTERVAL_MAX)
    );

    // Store themeConfig in a ref so canvas draw loop always reads latest
    const themeConfigRef = useRef(themeConfig);
    useEffect(() => {
        themeConfigRef.current = themeConfig;
    }, [themeConfig]);

    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.scale(dpr, dpr);

        fieldHeightRef.current = h * 2;
        starsRef.current = createStars(w, h);
        usedStarIndicesRef.current = new Set();
        constellationsRef.current = [];
        // Spawn 2 initial constellations
        for (let i = 0; i < 2; i++) {
            const group = spawnOneConstellation(starsRef.current, usedStarIndicesRef.current);
            if (group) constellationsRef.current.push(group);
        }
        scrollOffsetRef.current = 0;
        lastConstellationRef.current = 0;
    }, []);

    useEffect(() => {
        initCanvas();

        const handleResize = () => initCanvas();

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);

        const draw = (timestamp: number) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const currentTheme = themeConfigRef.current;
            const w = window.innerWidth;
            const h = window.innerHeight;
            const fieldH = fieldHeightRef.current;

            const smooth = smoothMouseRef.current;
            const target = mouseRef.current;
            const lerpFactor = 0.08;

            if (target.active) {
                smooth.x += (target.x - smooth.x) * lerpFactor;
                smooth.y += (target.y - smooth.y) * lerpFactor;
            } else {
                smooth.x += (-9999 - smooth.x) * 0.03;
                smooth.y += (-9999 - smooth.y) * 0.03;
            }

            const mx = smooth.x;
            const my = smooth.y;

            scrollOffsetRef.current += SCROLL_SPEED;
            if (scrollOffsetRef.current >= fieldH) {
                scrollOffsetRef.current -= fieldH;
            }
            const scrollY = scrollOffsetRef.current;

            // Periodically spawn new constellations
            if (timestamp - lastConstellationRef.current > nextConstellationDelay.current) {
                lastConstellationRef.current = timestamp;
                nextConstellationDelay.current = randomBetween(CONSTELLATION_SPAWN_MIN, CONSTELLATION_SPAWN_MAX);
                if (constellationsRef.current.length < MAX_CONSTELLATIONS) {
                    const group = spawnOneConstellation(starsRef.current, usedStarIndicesRef.current);
                    if (group) constellationsRef.current.push(group);
                }
            }

            ctx.clearRect(0, 0, w, h);

            // Theme-driven background gradient
            const gradient = ctx.createRadialGradient(
                w * 0.5, h * 0.4, 0,
                w * 0.5, h * 0.4, Math.max(w, h) * 0.8
            );
            for (const stop of currentTheme.gradient) {
                gradient.addColorStop(stop.stop, stop.color);
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            // Theme-driven nebula 1
            const nebula1 = ctx.createRadialGradient(
                w * 0.2, h * 0.6, 0, w * 0.2, h * 0.6, w * 0.35
            );
            nebula1.addColorStop(0, currentTheme.nebula1);
            nebula1.addColorStop(1, currentTheme.nebula1.replace(/[\d.]+\)$/, '0)'));
            ctx.fillStyle = nebula1;
            ctx.fillRect(0, 0, w, h);

            // Theme-driven nebula 2
            const nebula2 = ctx.createRadialGradient(
                w * 0.75, h * 0.3, 0, w * 0.75, h * 0.3, w * 0.3
            );
            nebula2.addColorStop(0, currentTheme.nebula2);
            nebula2.addColorStop(1, currentTheme.nebula2.replace(/[\d.]+\)$/, '0)'));
            ctx.fillStyle = nebula2;
            ctx.fillRect(0, 0, w, h);

            const stars = starsRef.current;

            const getWrappedY = (starY: number) => {
                let sy = starY - scrollY;
                if (sy < -20) sy += fieldH;
                if (sy > h + 20) sy -= fieldH;
                return sy;
            };

            // Theme-driven constellation lines with slow fade-in
            for (const group of constellationsRef.current) {
                // Slowly fade in the constellation
                if (group.alpha < 1) {
                    group.alpha = Math.min(1, group.alpha + 0.004);
                }

                // Parse the base constellation color and apply group alpha
                const baseColor = currentTheme.constellationColor;
                const alphaMatch = baseColor.match(/([\d.]+)\)$/);
                const baseAlpha = alphaMatch ? parseFloat(alphaMatch[1]) : 0.15;
                const finalAlpha = baseAlpha * group.alpha;

                ctx.beginPath();
                ctx.strokeStyle = baseColor.replace(/[\d.]+\)$/, `${finalAlpha.toFixed(3)})`);
                ctx.lineWidth = 0.5;
                for (const line of group.lines) {
                    const s1 = stars[line.from];
                    const s2 = stars[line.to];
                    const y1 = getWrappedY(s1.y);
                    const y2 = getWrappedY(s2.y);
                    // Skip lines where stars are on opposite sides of the scroll wrap
                    if (Math.abs(y1 - y2) > h * 0.5) continue;
                    ctx.moveTo(s1.x, y1);
                    ctx.lineTo(s2.x, y2);
                }
                ctx.stroke();
            }

            const nearbyStars: { sx: number; sy: number; dist: number; color: string }[] = [];

            for (const star of stars) {
                const sx = star.x;
                const sy = getWrappedY(star.y);

                if (sy < -20 || sy > h + 20) continue;

                if (star.twinkle) {
                    star.twinklePhase += star.twinkleSpeed;
                    star.alpha = star.baseAlpha * (0.5 + 0.5 * Math.sin(star.twinklePhase));
                }

                const dist = Math.hypot(sx - mx, sy - my);
                let glowBoost = 0;
                if (dist < GLOW_RADIUS) {
                    glowBoost = (1 - dist / GLOW_RADIUS) * 0.6;
                    nearbyStars.push({ sx, sy, dist, color: star.color });
                }

                const finalAlpha = Math.min(1, star.alpha + glowBoost);
                const finalRadius = star.radius + glowBoost * 1.2;

                if (finalRadius > 1.0 && finalAlpha > 0.5) {
                    ctx.beginPath();
                    const glowGrad = ctx.createRadialGradient(
                        sx, sy, 0, sx, sy, finalRadius * 3.5
                    );
                    glowGrad.addColorStop(0, `rgba(${star.color}, ${finalAlpha * 0.25})`);
                    glowGrad.addColorStop(1, `rgba(${star.color}, 0)`);
                    ctx.fillStyle = glowGrad;
                    ctx.arc(sx, sy, finalRadius * 3.5, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.beginPath();
                ctx.arc(sx, sy, finalRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${star.color}, ${finalAlpha})`;
                ctx.fill();
            }

            // Draw faint lines from cursor to nearby stars
            for (const ns of nearbyStars) {
                const lineAlpha = (1 - ns.dist / GLOW_RADIUS) * 0.2;
                const lineGrad = ctx.createLinearGradient(mx, my, ns.sx, ns.sy);
                lineGrad.addColorStop(0, `rgba(${ns.color}, ${lineAlpha * 0.6})`);
                lineGrad.addColorStop(1, `rgba(${ns.color}, ${lineAlpha})`);
                ctx.beginPath();
                ctx.strokeStyle = lineGrad;
                ctx.lineWidth = 0.6;
                ctx.moveTo(mx, my);
                ctx.lineTo(ns.sx, ns.sy);
                ctx.stroke();
            }

            if (timestamp - lastShootingRef.current > nextShootingDelay.current) {
                lastShootingRef.current = timestamp;
                nextShootingDelay.current = randomBetween(
                    SHOOTING_STAR_INTERVAL_MIN, SHOOTING_STAR_INTERVAL_MAX
                );

                const angle = randomBetween(0.3, 0.8);
                shootingStarsRef.current.push({
                    x: randomBetween(-100, w * 0.7),
                    y: randomBetween(-50, h * 0.3),
                    length: randomBetween(80, 160),
                    speed: randomBetween(8, 14),
                    angle,
                    alpha: 0,
                    life: 0,
                    maxLife: randomBetween(40, 70),
                });
            }

            shootingStarsRef.current = shootingStarsRef.current.filter(ss => {
                ss.life++;
                ss.x += Math.cos(ss.angle) * ss.speed;
                ss.y += Math.sin(ss.angle) * ss.speed;

                const progress = ss.life / ss.maxLife;
                ss.alpha = progress < 0.2
                    ? progress / 0.2
                    : 1 - (progress - 0.2) / 0.8;
                ss.alpha = Math.max(0, Math.min(1, ss.alpha)) * 0.7;

                const tailX = ss.x - Math.cos(ss.angle) * ss.length;
                const tailY = ss.y - Math.sin(ss.angle) * ss.length;

                const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
                grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
                grad.addColorStop(0.7, `rgba(255, 255, 255, ${ss.alpha * 0.3})`);
                grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

                ctx.beginPath();
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(ss.x, ss.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${ss.alpha})`;
                ctx.fill();

                return ss.life < ss.maxLife;
            });

            animFrameRef.current = requestAnimationFrame(draw);
        };

        animFrameRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [initCanvas, settings.backgroundAnimation]);

    // When animation is disabled, render a static themed gradient instead of the canvas
    if (!settings.backgroundAnimation) {
        const bg = themeConfig.gradient;
        return (
            <div
                className="fixed inset-0 w-full h-full"
                style={{
                    zIndex: 0,
                    background: `radial-gradient(ellipse at 50% 40%, ${bg[0].color} 0%, ${bg[1].color} 40%, ${bg[2].color} 100%)`,
                }}
            />
        );
    }

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
