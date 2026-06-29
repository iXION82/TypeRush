import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Score from '../models/Score.js';
import Leaderboard from '../models/Leaderboard.js';

dotenv.config();

const fakeUsers = [
    { name: "NoviceTyper", email: "novice@example.com", password: "password123", wpm: 25, accuracy: 85, score: 350 },
    { name: "SlowPoke", email: "slow@example.com", password: "password123", wpm: 15, accuracy: 70, score: 120 },
    { name: "KeyboardSmasher", email: "smasher@example.com", password: "password123", wpm: 12, accuracy: 55, score: 80 },
    { name: "Beginner101", email: "beginner@example.com", password: "password123", wpm: 32, accuracy: 92, score: 500 },
    { name: "SleepyFingers", email: "sleepy@example.com", password: "password123", wpm: 18, accuracy: 78, score: 190 },
    { name: "OneFingerWonder", email: "onefinger@example.com", password: "password123", wpm: 20, accuracy: 80, score: 250 },
    { name: "StillLearning", email: "learning@example.com", password: "password123", wpm: 28, accuracy: 88, score: 400 },
];

const modes = ['time-30', 'time-60', 'time-120', 'words-25', 'words-50', 'words-100'];

const seedLeaderboard = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('🔌 Connected to MongoDB');

        for (const userData of fakeUsers) {
            let user = await User.findOne({ email: userData.email });
            
            if (!user) {
                user = new User({
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    avaPic: Math.floor(Math.random() * 11) + 1,
                    exp: userData.score,
                    level: 1,
                    totalCharsTyped: 1000,
                    totalTimeTyped: 300,
                    gamesPlayed: 5
                });
                await user.save();
                console.log(`👤 Created user: ${user.name}`);
            }

            for (const mode of modes) {
                const modeWpm = Math.max(5, userData.wpm + (Math.floor(Math.random() * 10) - 5));
                const modeAcc = Math.min(100, Math.max(50, userData.accuracy + (Math.floor(Math.random() * 10) - 5)));
                const modeScore = Math.floor(userData.score * (modeAcc / 100));

                const score = new Score({
                    scoreValue: modeScore,
                    netWPM: modeWpm,
                    accuracy: modeAcc,
                    userId: user._id,
                    gameMode: mode,
                    punctuation: false,
                    numbers: false
                });
                await score.save();

                const category = `${mode}-puncFalse-numFalse`;
                let leaderboard = await Leaderboard.findOne({ category });
                if (!leaderboard) {
                    leaderboard = new Leaderboard({ category, topScores: [] });
                }

                leaderboard.topScores.push({
                    scoreId: score._id as any,
                    scoreValue: score.scoreValue,
                    userId: user._id as any
                });
                
                // Sort descending and keep top 20
                leaderboard.topScores.sort((a, b) => b.scoreValue - a.scoreValue);
                if (leaderboard.topScores.length > 20) {
                    leaderboard.topScores = leaderboard.topScores.slice(0, 20) as any;
                }
                
                await leaderboard.save();
            }
            console.log(`🏆 Added scores & leaderboard entries for: ${user.name}`);
        }

        console.log('✅ Leaderboard seeded successfully with low score data!');
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error seeding leaderboard:', error);
        process.exit(1);
    }
};

seedLeaderboard();
