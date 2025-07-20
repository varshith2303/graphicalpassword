//server\controllers\users_signup.js  
import { usertModel as User } from '../models/user.js';
import bcrypt from "bcryptjs";
import { commons, signup_messages as msg } from '../static/message.js';
import jwt from 'jsonwebtoken';
import { userAttemptsModel } from '../models/user_attempts.js';

const signup = async (req, res, next) => {
    let token;
    let existingUser;
    let hashedPassword;

    // Destructure and lowercase
    let { username, email, password, pattern, sets, sequence } = req.body;
    username = username?.toLowerCase();

    // 🔍 Debug log: request body
    console.log("📥 Received signup request:", { username, email, pattern, sets });

    // Validation
    if (!username || !email || !password || !pattern || !sets) {
        console.log("❌ Missing fields in request body");
        return res.status(406).json({
            message: commons.invalid_params,
            format: msg.format
        });
    }

    // Check if user exists
    try {
        existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("⚠ User already exists with email:", email);
            return res.status(409).json({ message: msg.user_already_exist });
        }
    } catch (err) {
        console.error("❌ DB error while checking existing user:", err);
        return res.status(500).json({ message: msg.db_user_failed, error: err.message });
    }

    // Hash password
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.error("❌ Password hashing failed:", err);
        return res.status(500).json({ message: msg.pass_hash_err, error: err.message });
    }

    // Create user
    const createdUser = new User({
        username,
        email,
        password: hashedPassword,
        sets,
        pattern,
        sequence: false
    });

    const attempts = new userAttemptsModel({
        username,
        email,
        attempts: 0
    });

    // Save user
    try {
        await createdUser.save();
        console.log("✅ User saved:", createdUser.email);
    } catch (err) {
        console.error("❌ Failed to save user to DB:", err);
        return res.status(500).json({ message: msg.db_save_err, error: err.message });
    }

    // Save user attempts
    try {
        await attempts.save();
        console.log("✅ Attempts record saved for:", email);
    } catch (err) {
        console.error("❌ Failed to save user attempts:", err);
        return res.status(500).json({ message: msg.db_save_err, error: err.message });
    }

    // JWT Token
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            process.env.TOKEN_KEY || 'default_token_key'
        );
    } catch (err) {
        console.error("❌ Token generation failed:", err);
        return res.status(500).json({ message: commons.token_failed, error: err.message });
    }

    // ✅ Respond success
    res.status(200).json({
        username: createdUser.username,
        userId: createdUser.id,
        email: createdUser.email,
        token
    });
};

export { signup as signupController };