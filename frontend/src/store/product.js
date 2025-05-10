import {create} from 'zustand';

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    createProduct: async (product) => {
        if(!product.name || !product.price || !product.image) {
            return {success:false, message: "Please fill all fields"};
        }
        const res = await fetch('api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        const data = await res.json();
        set((state) => ({ products: [...state.products, data.data] }));
        return {success:true, message: "Product created successfully"};
    },
    fetchProducts: async () => {
        const res = await fetch('api/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json();
        set({ products: data.data });
    },
}));

