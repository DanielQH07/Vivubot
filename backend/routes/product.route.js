import express from 'express';
import mongoose from 'mongoose';

import Product from '../models/product.model.js';
import { getProducts, updateProduct, createProduct, deleteProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getProducts); // get all products

router.post('/', createProduct); // create a new product

router.put('/:id', updateProduct);

router.delete('/:id', deleteProduct); // delete a product

export default router;