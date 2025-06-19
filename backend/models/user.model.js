// backend/models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    hasPreferences: {
        type: Boolean,
        default: false,
    },
    preferences: {
        travelStyle: { type: [String], default: [] },
        locationType: { type: [String], default: [] },
        cuisineType: { type: [String], default: [] },
        budgetLevel: { type: [String], default: [] },
        travelTime: { type: [String], default: [] },
        customTravelStyle: { type: String, default: "" },
        customLocationType: { type: String, default: "" },
        customCuisineType: { type: String, default: "" },
        customBudgetLevel: { type: String, default: "" },
        customTravelTime: { type: String, default: "" },
    },
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;