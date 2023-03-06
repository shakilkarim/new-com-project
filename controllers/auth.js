const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { hashPassword, comparePassword } = require('../helpers/auth.js');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        // 1. destructure name,email,password
        const {name, email, password, address} = req.body;

        // 2.all fields require validation
        if (!name.trim()) {
            return res.json({ error: 'Name is required' });
        }
        if (!email) {
            return res.json({ error: 'Email is required' });
        }
        if (!password || password.length < 6) {
            return res.json({ error: 'password must be at least 6 character long' });
        }
        // 3. check if email is taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ error: 'email is taken' });
        }
        // 4.hash Password
        const hashpassword = await hashPassword(password);

        // 5.register user
        const user = await new User({
            name,
            email,
            password: hashpassword,
        }).save();
        // 6.Create signed jwt
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        // 7.send response
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            },
            token,
        });
    } catch (err) {
        console.log(err);
    }
};
exports.login = async (req, res) => {
    try {
        // Destructure name, email,password from req.body
        const { email, password } = req.body;

        // 2.all fields require validation
        if (!email) {
            return res.json({ error: 'email is taken' });
        }
        if (!password || password.length < 6) {
            return res.json({ error: 'Password must be at least 6 characters long' });
        }
        // 3.Check if email is taken
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: 'user not found' });
        }
        // 4.compare Password
        const match = comparePassword(password, user.password);
        if (!match) {
            return res.json({ error: 'password is wrong' });
        }
        // 5.jwt token create
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        // 6.send response
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            },
            token,
        });
    } catch (err) {
        console.log(err);
    }
};
exports.profileUpdate = (req, res) => {
    try {
        const { name, password, address } = req.body;

        const user = User.findById(req.user._id);
        // check password length
        if (password && password.length < 6) {
            return res.json({
                err: 'password is required and should be use 6 characters',
            });
            // hashPassword
            const hashpassword = password ? hashPassword(password) : undefined;

            const update = User.findByIdAndUpdate(
                req.user._id,

                {
                    name: name || user.name,
                    password: hashpassword || user.password,
                    address: address || user.address,
                },
                { new: true }
            );
            update.password = undefined;
            res.json(update);
        }
    } catch (err) {
        console.log(err);
    }
};
