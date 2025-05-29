import TravelPlan from '../models/iterator.model.js';
import mongoose from 'mongoose';

export const getTravelPlans = async (req, res) => {
    try {
        const plans = await TravelPlan.find();
        res.status(200).json({ success: true, data: plans });
    } catch (error) {
        console.error("Error in fetching plans:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const createTravelPlan = async (req, res) => {
    const { name, destination, startDate } = req.body;
    if (!name || !destination || !startDate) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const newPlan = new TravelPlan({ name, destination, startDate });
        await newPlan.save();
        res.status(201).json({ success: true, data: newPlan });
    } catch (error) {
        console.error("Error in creating plan:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const updateTravelPlan = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Plan ID' });
    }

    try {
        const updatedPlan = await TravelPlan.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedPlan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }
        res.status(200).json({ success: true, data: updatedPlan });
    } catch (error) {
        console.error("Error in updating plan:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const deleteTravelPlan = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Plan ID' });
    }

    try {
        const deletedPlan = await TravelPlan.findByIdAndDelete(id);
        if (!deletedPlan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }
        res.status(200).json({ success: true, data: deletedPlan });
    } catch (error) {
        console.error("Error in deleting plan:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
