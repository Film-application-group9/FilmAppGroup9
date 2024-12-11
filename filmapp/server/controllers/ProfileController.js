import dotenv from "dotenv";
import decodeTokenUser from '../helpers/jwt_decode.js';

dotenv.config();

const getProfile = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const decodedUser = decodeTokenUser(authHeader);
        const userId = decodedUser.id;

        // mock user profile
        const userProfile = {
            userId,
            username: "testuser",
            email: "testuser@example.com",
            bio: "This is a test user."
        };

        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send('Server error');
    }
};
const getProfileByUsername = async (req, res, next) => {
    try {
        const { username } = req.params;

        // mock user profile
        const userProfile = {
            userId: 1,
            username,
            email: `${username}@example.com`,
            bio: `My name is ${username} and this is my profile`
            
        };

        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send('Server error');
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const decodedUser = decodeTokenUser(authHeader);
        const userId = decodedUser.id;
        const { username, email, bio } = req.body;

        // mock updated profile
        const updatedProfile = {
            userId,
            username,
            email,
            bio
        };

        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Server error');
    }
};

export { getProfile, updateProfile, getProfileByUsername };