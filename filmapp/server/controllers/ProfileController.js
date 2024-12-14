import dotenv from "dotenv";
import { pool } from '../helpers/db.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const getProfile = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decodedUser.id;

        console.log(`Fetching profile for user ID: ${userId}`);

        const result = await pool.query('SELECT id, username FROM accounts WHERE id = $1', [userId]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('Profile not found');
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send('Server error');
    }
};

const getProfileByIdOrUsername = async (req, res) => {
    try {
        const { username } = req.params;

        console.log(`Fetching profile for username: ${username}`);

        let result;
        if (isNaN(username)) {
            // by username
            result = await pool.query('SELECT id, username FROM accounts WHERE username = $1', [username]);
        } else {
            // by id
            result = await pool.query('SELECT id, username FROM accounts WHERE id = $1', [username]);
        }

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('Profile not found');
        }
    } catch (error) {
        console.error('Error fetching profile by username:', error);
        res.status(500).send('Server error');
    }
};

export { getProfile, getProfileByIdOrUsername };

