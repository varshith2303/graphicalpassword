//server\controllers\users_login.js 
import { usertModel as User } from '../models/user.js';
import bcrypt from "bcryptjs";
import { login_messages as msg, commons } from '../static/message.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../util/util.js';
import { userAttemptsModel } from '../models/user_attempts.js';
import { nanoid } from 'nanoid';

const login = async (req, res, next) => {
    let token;
    let existingUser;
    let isValidPassword = false;
    let isValidPattern = false;
    let { username, password, pattern } = req.body;
    username = username.toLowerCase();

    if (!username || !password || !pattern || !Array.isArray(pattern)) {
        return res.status(406).json({
            message: commons.invalid_params,
            format: msg.format
        });
    }

    try {
        existingUser = await User.findOne({ username: username });
    } catch (err) {
        return res.status(401).json({ message: msg.db_user_failed });
    }

    if (!existingUser) {
        return res.status(401).json({ message: msg.user_not_exist });
    }

    let currentAttempts = await userAttemptsModel.findOne({ username: username });

    if (currentAttempts?.attempts >= Number(process.env.MAX_ATTEMPTS)) {
        return res.status(500).json({
            status: "blocked",
            message: "Your account has been blocked, please check email."
        });
    }

    const patternString = pattern.join("-");
    console.log("pattern string, db string pattern",patternString,existingUser.pattern);

    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
        isValidPattern = await bcrypt.compare(patternString, existingUser.pattern);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: msg.db_pass_failed });
    }

    if (!isValidPassword || !isValidPattern) {
        const newAttempts = (currentAttempts?.attempts || 0) + 1;

        if (!currentAttempts) {
            // Create new attempts document if it doesn't exist
            currentAttempts = await userAttemptsModel.create({
                username,
                email: existingUser.email,
                attempts: newAttempts,
                token: ""
            });
        } else {
            await userAttemptsModel.findOneAndUpdate(
                { username: username },
                { attempts: newAttempts }
            );
        }

        if (newAttempts >= Number(process.env.MAX_ATTEMPTS)) {
            await userAttemptsModel.findOneAndUpdate(
                { username: username },
                {
                    attempts: newAttempts,
                    token: nanoid(32),
                }
            );
            sendEmail(existingUser.email);  // Use existingUser email
            return res.status(500).json({
                status: "blocked",
                message: "Your account has been blocked, please check email."
            });
        }

        return res.status(500).json({ message: msg.invalid_credentials });
    }

    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.TOKEN_KEY
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: commons.token_failed });
    }

    await userAttemptsModel.findOneAndUpdate({ username: username }, { attempts: 0 });

    res.status(200).json({
        username: existingUser.username,
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    });
};

export { login as loginController };