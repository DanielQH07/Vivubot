import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        console.log(`✅ User registered: ${email}`);
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error('❌ Register error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check JWT_SECRET
        if (!process.env.JWT_SECRET) {
            console.error('❌ JWT_SECRET not configured');
            return res.status(500).json({ message: "Server configuration error" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`❌ Login attempt for non-existent user: ${email}`);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log(`🔍 Login attempt for user: ${user.username} (${email})`);
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`🔐 Password comparison result: ${isMatch}`);
        
        if (!isMatch) {
            console.log(`❌ Invalid password for user: ${email}`);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log(`✅ Login successful for user: ${email}`);

        res.status(200).json({ 
            token, 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email 
            },
            message: "Login successful"
        });

    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ error: err.message });
    }
};
