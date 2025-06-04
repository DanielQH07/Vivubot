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
    budget: {
        type: Number,
        required: false,
    },
}, {
    timestamps: true
});

const TravelRequest = mongoose.model("TravelRequest", travelRequestSchema);

// Sample function to POST a new travel request node
export const createTravelRequest = async (requestData) => {
    try {
        // Create a new travel request instance
        const newTravelRequest = new TravelRequest({
            user_name: requestData.user_name,
            departure: requestData.departure,
            destination: requestData.destination,
            outbound_date: new Date(requestData.outbound_date),
            return_date: new Date(requestData.return_date),
            adults_num: requestData.adults_num,
            children_num: requestData.children_num,
            children_ages: requestData.children_ages || "",
            restaurant_preference: requestData.restaurant_preference || "",
            budget: requestData.budget || 0,
        });

        // Save to database
        const savedRequest = await newTravelRequest.save();
        console.log("✅ Travel request saved successfully:", savedRequest._id);
        return savedRequest;
    } catch (error) {
        console.error("❌ Error saving travel request:", error.message);
        throw error;
    }
};

// Sample usage example (commented out)
/*
const sampleData = {
    user_name: "John Doe",
    departure: "New York",
    destination: "Paris",
    outbound_date: "2024-06-15",
    return_date: "2024-06-25",
    adults_num: 2,
    children_num: 1,
    children_ages: "8",
    restaurant_preference: "Italian",
    budget: 5000
};

// To use: createTravelRequest(sampleData);
*/

export default TravelRequest;
