import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TextAsset from '../models/text.js'; // Adjust path to where you saved the model

dotenv.config();

const sampleTexts = [
    {
        content: "the quiet river flows under pale moon while soft winds move through tall trees and carry calm thoughts across silent fields where shadows rest gently waiting for dawn light to rise slowly over distant hills bringing warmth hope and peace into tired hearts that listen closely to nature breathing steady rhythms teaching patience trust balance and quiet strength within every wandering soul who walks forward without fear learning from moments shared in stillness between stars clouds night air dreams drift freely finding meaning beyond noise haste doubt or hurry as time opens wide paths for gentle change growth healing rest",
        mode: 'time',
        wordCount: 650,
        includeNumbers: false,
        includePunctuation: false
    },
    {
        content: "Morning light spills, softly across the empty street, where footsteps echo slowly. Birds argue on wires, clouds drift lazily, and coffee steam curls upward like thoughts waking from sleep. Someone laughs, a door creaks, pages turn nearby, and the city stretches its arms with a patient sigh. Windows glow, buses hum, conversations tangle, yet calm hides between moments. Time pauses, listens, then moves on again. Small stories begin, unnoticed, but real. Hope walks quietly beside routine, waiting for courage to speak. Even silence, when trusted, can guide hearts home. Daylight grows, shadows thin, purpose sharpens, and meaning feels possible again.",
        mode: 'time',
        wordCount: 650,
        includeNumbers: false,
        includePunctuation: true
    },
    {
        content: "the year 2026 feels like a fresh page where goals meet effort and hours of practice turn into skill day 1 starts small day 2 adds focus day 3 builds rhythm until week 4 shows progress and month 5 proves consistency matters more than bursts of speed numbers mark time but growth comes from steady steps repeated 10 times again and again until results appear in ways once unseen by the mind that doubted at hour 24 when rest was needed yet belief stayed strong beyond 100 attempts lessons learned shaped confidence for the next level ahead step by step",
        mode: 'time',
        wordCount: 650,
        includeNumbers: true,
        includePunctuation: false
    },
    {
        content: "In 2026, progress feels measurable. Day 1 begins with intent, day 2 adds discipline, and by day 3, momentum appears. Hours stack up, 5 today, 10 tomorrow, until 100 attempts reshape habits. Some days dip, others rise, but the trend matters. At hour 24, rest is earned; at hour 48, clarity returns. Numbers track time, commas pause thought, and periods remind us to stop. Goals sharpen when effort repeats again and again. Even setbacks teach something useful. By month 6, confidence grows, plans adjust, and focus improves. The journey continues, step by step, with patience, data, belief, grit, and hope.",
        mode: 'time',
        wordCount: 650,
        includeNumbers: true,
        includePunctuation: true
    },
    {
        content: "the quiet river flows under pale moon while soft winds move through tall trees and carry calm thoughts across silent fields where shadows rest gently waiting for dawn light to rise slowly over distant hills bringing warmth hope and peace into tired hearts that listen closely to nature breathing steady rhythms teaching patience trust balance and quiet strength within every wandering soul who walks forward without fear learning from moments shared in stillness between stars clouds night air dreams drift freely finding meaning beyond noise haste doubt or hurry as time opens wide paths for gentle change growth healing rest",
        mode: 'words',
        wordCount: 100,
        includeNumbers: false,
        includePunctuation: false
    },
    {
        content: "Morning light spills, softly across the empty street, where footsteps echo slowly. Birds argue on wires, clouds drift lazily, and coffee steam curls upward like thoughts waking from sleep. Someone laughs, a door creaks, pages turn nearby, and the city stretches its arms with a patient sigh. Windows glow, buses hum, conversations tangle, yet calm hides between moments. Time pauses, listens, then moves on again. Small stories begin, unnoticed, but real. Hope walks quietly beside routine, waiting for courage to speak. Even silence, when trusted, can guide hearts home. Daylight grows, shadows thin, purpose sharpens, and meaning feels possible again.",
        mode: 'words',
        wordCount: 100,
        includeNumbers: false,
        includePunctuation: true
    },
    {
        content: "the year 2026 feels like a fresh page where goals meet effort and hours of practice turn into skill day 1 starts small day 2 adds focus day 3 builds rhythm until week 4 shows progress and month 5 proves consistency matters more than bursts of speed numbers mark time but growth comes from steady steps repeated 10 times again and again until results appear in ways once unseen by the mind that doubted at hour 24 when rest was needed yet belief stayed strong beyond 100 attempts lessons learned shaped confidence for the next level ahead step by step",
        mode: 'words',
        wordCount: 100,
        includeNumbers: true,
        includePunctuation: false
    },
    {
        content: "In 2026, progress feels measurable. Day 1 begins with intent, day 2 adds discipline, and by day 3, momentum appears. Hours stack up, 5 today, 10 tomorrow, until 100 attempts reshape habits. Some days dip, others rise, but the trend matters. At hour 24, rest is earned; at hour 48, clarity returns. Numbers track time, commas pause thought, and periods remind us to stop. Goals sharpen when effort repeats again and again. Even setbacks teach something useful. By month 6, confidence grows, plans adjust, and focus improves. The journey continues, step by step, with patience, data, belief, grit, and hope.",
        mode: 'words',
        wordCount: 100,
        includeNumbers: true,
        includePunctuation: true
    },
    {
        content: "quiet winds move through open fields carrying calm thoughts into tired minds where patience grows slowly and fear fades away with gentle breath",
        mode: 'words',
        wordCount: 25,
        includeNumbers: false,
        includePunctuation: false
    },
    {
        content: "Soft rain falls, gently tapping windows, calming restless minds. Streets shine briefly, conversations fade, and the evening breathes slowly, inviting rest, warmth, and quiet reflection.",
        mode: 'words',
        wordCount: 25,
        includeNumbers: false,
        includePunctuation: true
    },
    {
        content: "day 1 begins with hope day 2 adds effort day 3 builds trust until 25 attempts shape focus patience skill and steady progress forward",
        mode: 'words',
        wordCount: 25,
        includeNumbers: true,
        includePunctuation: false
    },
    {
        content: "In 2026, day 1 feels uncertain. By day 5, confidence grows. At 25 attempts, effort compounds, habits form, and progress finally feels real.",
        mode: 'words',
        wordCount: 25,
        includeNumbers: true,
        includePunctuation: true
    },
    {
        content: "soft light spreads across quiet rooms where thoughts drift slowly and minds find rest without hurry or noise learning patience balance and calm through steady breathing and gentle moments shared with silence that teaches strength clarity trust and peace within everyday motion",
        mode: 'words',
        wordCount: 50,
        includeNumbers: false,
        includePunctuation: false
    },
    {
        content: "The morning feels unhurried, calm, and wide open. Light enters softly, birds chatter nearby, and streets wake gently. People move with purpose, yet kindness slips through small gestures, brief smiles, shared space. Time flows, pauses, then continues, carrying hope forward without needing explanation.",
        mode: 'words',
        wordCount: 50,
        includeNumbers: false,
        includePunctuation: true
    },
    {
        content: "day 1 starts with focus day 2 brings effort day 3 tests patience until week 4 shows growth and hour 10 feels easier than hour 1 progress builds through repetition 20 times again until skill replaces doubt and confidence rises steadily forward",
        mode: 'words',
        wordCount: 50,
        includeNumbers: true,
        includePunctuation: false
    },
    {
        content: "By day 1, motivation sparks. At day 7, habits struggle. Around hour 20, fatigue appears, but by attempt 50, clarity forms. Numbers reveal effort, punctuation slows thought, and reflection guides adjustment. Progress is rarely instant, but consistency compounds quietly, turning small steps into measurable growth over time.",
        mode: 'words',
        wordCount: 50,
        includeNumbers: true,
        includePunctuation: true
    },
    {
        content: "1998 2024 500 100 12345 67890",
        mode: 'words',
        wordCount: 10,
        includeNumbers: true,
        includePunctuation: false
    },
    {
        content: "It was the best of times, it was the worst of times...",
        mode: 'zen',
        wordCount: 10000,
        includeNumbers: false,
        includePunctuation: true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('🔌 Connected to MongoDB');

        await TextAsset.insertMany(sampleTexts);
        console.log('✅ Data inserted successfully');

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedDB();