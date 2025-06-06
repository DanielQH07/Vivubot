import express from 'express';
import {
    getTravelPlans,
    createTravelPlan,
    updateTravelPlan,
    deleteTravelPlan
} from '../controllers/iterator.controller.js';

const router = express.Router();

router.get('/', getTravelPlans);
router.post('/', createTravelPlan);
router.put('/:id', updateTravelPlan);
router.delete('/:id', deleteTravelPlan);

export default router;
