import { create } from "zustand";
import axios from "axios"
import toast from "react-hot-toast";

// base url will be dynamic
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    error: false,
    currentProduct: null,

    // form state
    formData: {
        name: "",
        price: "",
        image: "",
        description: "",
    },

    setFormData: (formData) => set({ formData }),
    resetFormData: () => set({ formData: { name: "", price: "", image: "", description: "" } }),

    fetchProducts: async () => {
        set({ loading: true })
        try {
            const response = await axios.get(`${BASE_URL}/api/products`)
            set({ products: response.data.data, error: null })
        } catch (err) {
            if (err.status == 429) toast.error("Too many requests")
            else set({ error: "Something went wrong" })

        } finally {
            set({ loading: false })
        }
    },

    fetchProduct: async (id) => {
        set({ loading: true })
        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`)
            console.log(response)
            set({
                currentProduct: response.data.data,
                formData: response.data.data, // pre-fill form with current product Data
                error: null
            })
        } catch (err) {
            if (err.status == 429) toast.error("Too many requests")
            else set({ error: "Something went wrong", currentProdut: null })
        } finally {
            set({ loading: false })
        }
    },

    deleteProduct: async (id) => {
        set({ loading: true })
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`)
            set(prev => ({ products: prev.products.filter(product => product.id !== id) }));
            toast.success("Product Deleted Successfully")
        } catch (err) {
            console.log("Error in deleteProduct function", err)
            toast.error("Something went wrong")
        } finally {
            set({ loading: false })
        }
    },

    addProduct: async (e) => {
        e.preventDefault();
        set({ loading: true })
        try {
            const { formData } = get()
            await axios.post(`${BASE_URL}/api/products`, formData);
            await get().fetchProducts();
            get().resetFormData();
            toast.success("Product Created Successfully");
            document.getElementById("add_product_modal").close();
        } catch (err) {
            console.log("Error in addProduct function", err)
            toast.error("Something went wrong")
        } finally {
            set({ loading: false })
        }
    },

    updateProduct: async (id) => {
        set({ loading: true })
        try {
            const { formData } = get();
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
            set({ currentProduct: response.data.data });

            toast.success("Product Updated Successfully")
        } catch (err) {
            console.log("Error in updateProduct function", err)
            toast.error("Something went wrong")
        } finally {
            set({ loading: false })
        }
    },

}))