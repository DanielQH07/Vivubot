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

        // Generate JWT token after successful registration
        if (!process.env.JWT_SECRET) {
            console.error('❌ JWT_SECRET not configured');
            return res.status(500).json({ message: "Server configuration error" });
        }

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        console.log(`✅ User registered: ${email}`);
        res.status(201).json({ 
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                hasPreferences: newUser.hasPreferences
            }
        });
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
                email: user.email,
                hasPreferences: user.hasPreferences
            },
            message: "Login successful"
        });

    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const updatePreferences = async (req, res) => {
    // Lấy userId từ req.user (được đặt bởi authMiddleware)
    const userId = req.user.id;

    // Lấy TẤT CẢ các trường liên quan đến preferences từ req.body
    // Đây là nơi quan trọng nhất: đảm bảo bạn trích xuất tất cả các trường mà frontend gửi lên.
    const {
        travelStyle,
        locationType,
        cuisineType,
        budgetLevel,
        travelTime,
        customTravelStyle,
        customLocationType,
        customCuisineType,
        customBudgetLevel,
        customTravelTime,
    } = req.body;

    try {
        // Tìm người dùng theo ID
        const user = await User.findById(userId);
        if (!user) {
            console.error(`❌ User with ID ${userId} not found for preferences update.`);
            return res.status(404).json({ message: 'User not found' });
        }

        // Cập nhật từng trường trong đối tượng preferences
        // Sử dụng $set để cập nhật các trường con mà không ghi đè toàn bộ đối tượng preferences
        // Đảm bảo chỉ cập nhật những trường thực sự được gửi từ frontend hoặc có giá trị.
        const updateFields = {};

        if (travelStyle !== undefined) updateFields['preferences.travelStyle'] = travelStyle;
        if (locationType !== undefined) updateFields['preferences.locationType'] = locationType;
        if (cuisineType !== undefined) updateFields['preferences.cuisineType'] = cuisineType;
        if (budgetLevel !== undefined) updateFields['preferences.budgetLevel'] = budgetLevel;
        if (travelTime !== undefined) updateFields['preferences.travelTime'] = travelTime;

        if (customTravelStyle !== undefined) updateFields['preferences.customTravelStyle'] = customTravelStyle;
        if (customLocationType !== undefined) updateFields['preferences.customLocationType'] = customLocationType;
        if (customCuisineType !== undefined) updateFields['preferences.customCuisineType'] = customCuisineType;
        if (customBudgetLevel !== undefined) updateFields['preferences.customBudgetLevel'] = customBudgetLevel;
        if (customTravelTime !== undefined) updateFields['preferences.customTravelTime'] = customTravelTime;

        // Sử dụng findByIdAndUpdate với $set để cập nhật các trường cụ thể
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                $set: updateFields,
                hasPreferences: true // Set hasPreferences = true khi user lưu preferences
            }, // $set sẽ cập nhật các trường được chỉ định mà không ảnh hưởng đến các trường khác
            { new: true, runValidators: true } // `new: true` trả về document đã được cập nhật
        );

        console.log(`✅ Preferences updated for user: ${userId}`);
        res.status(200).json({ message: 'Preferences updated successfully', preferences: updatedUser.preferences });

    } catch (err) {
        console.error('❌ Error updating preferences:', err);
        res.status(500).json({ message: 'Server error', error: err.message }); // Gửi lỗi chi tiết hơn
    }
};

export const getPreferences = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select('preferences');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ preferences: user.preferences });
    } catch (err) {
        console.error('❌ Error fetching preferences:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
