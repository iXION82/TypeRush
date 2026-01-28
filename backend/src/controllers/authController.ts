import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            scoreIds: []
        });

        await newUser.save();

        const accesstoken = generateAccessToken(newUser._id.toString())
        const refreshToken = generateRefreshToken(newUser._id.toString());

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/api/auth/refresh",
        });

        res.status(201).json({ accesstoken, user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/api/auth/refresh",
        });

        res.status(200).json({ accessToken, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const refreshAccessToken = (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token" });
    }
    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        ) as { userId: string; role: string };
        const newAccessToken = generateAccessToken(decoded.userId);
        res.json({ accessToken: newAccessToken });
    } catch {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};
