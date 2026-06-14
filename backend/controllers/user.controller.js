
import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";
export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userService.createUser(req.body);

        const token = user.generateJwt();
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userModel.findOne({ email: req.body.email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const isValid = await user.isValidPassword(req.body.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = user.generateJwt();
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const profile = async (req, res) => {
    console.log(req.user);

    res.status(200).json({ user: req.user });
}

export const logout = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
