import Product from '../models/product.model.js'; // Import the Product model 

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find(); // fetch all products from the database
        res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        console.error("Error in fetching data : ", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const createProduct = async (req, res) => {
    const product = req.body; // user send this data
    if (!product.name || !product.price || !product.image) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    

    try {
        const newProduct = new Product(product); // create a new product
        await newProduct.save(); // save the product to the database
        res.status(201).json({ success: true, data: newProduct });
    }
    catch (error) {
        console.error("Error: ", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const updateProduct = async (req, res) => {
    
    const {id} = req.params; // get the id from the URL
    const product = req.body; // user send this data

    if(!mongoose.Types.ObjectId.isValid(id)) { // check if the id is valid 
        return res.status(400).json({ success: false, message: 'Invalid ID' });
    }
    
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true }); // find the product by id and update it
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: updatedProduct });
    }
    catch (error) {
        console.error("Error in updating products: ", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
export const deleteProduct = async (req, res) => {
    const {id} = req.params; // get the id from the URL
    if (!mongoose.Types.ObjectId.isValid(id)) { // check if the id is valid 
        return res.status(400).json({ success: false, message: 'Invalid Product ID' });
    }
    try {
        const product = await Product.findByIdAndDelete(id); // find the product by id and delete it
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        console.error("Error in deleting products: ", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


