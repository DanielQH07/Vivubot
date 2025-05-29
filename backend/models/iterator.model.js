import mongoose from "mongoose";

const travelRequestSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
    },
    departure: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    outbound_date: {
        type: Date,
        required: true,
    },
    return_date: {
        type: Date,
        required: true,
    },
    adults_num: {
        type: Number,
        required: true,
    },
    children_num: {
        type: Number,
        required: true,
    },
    children_ages: {
        type: String,
        required: false,
    },
    restaurant_preference: {
        type: String,
        required: false,
    },
}, {
    timestamps: true
});

const TravelRequest = mongoose.model("TravelRequest", travelRequestSchema);
export default TravelRequest;
