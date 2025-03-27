import { sql } from "../config/db.js"


export const getAllProducts = async (req, res) => {
    try {
        const products = await sql`
            SELECT * FROM products
            ORDER BY created_at DESC
        `;

        if (products.length === 0) return res.status(404).json({ success: false, message: "No products found" })

        res.status(200).json({ success: true, data: products })
    } catch (error) {
        console.log("Error in getAllProducts controller", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await sql`
        SELECT * FROM products
        WHERE id = ${id}
    `;
        if (product.length === 0) return res.status(404).json({ success: false, message: "No product found" })

        res.status(200).json({ success: true, data: product[0] })
    } catch (error) {
        console.log("Error in getSingleProduct controller", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const createProduct = async (req, res) => {
    const { name, image, price, description } = req.body;
    if (!name || !image || !price || !description) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }
    try {
        const newProduct = await sql`
            INSERT INTO products (name, image, price, description)
            VALUES (${name}, ${image}, ${price}, ${description})
            RETURNING *
        `;
        console.log("Created Product", newProduct)
        res.status(201).json({ success: true, data: newProduct[0] })

    } catch (error) {
        console.log("Error in createProduct controller", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, image, price, description } = req.body;
    try {
        const updateProduct = await sql`
        UPDATE products
        SET name = ${name}, image = ${image}, price = ${price}, description = ${description}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
        `;

        if (updateProduct[0].length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        console.log("Updated Product", updateProduct[0])
        res.status(200).json({ success: true, data: updateProduct[0] })

    } catch (error) {
        console.log("Error in updateProduct controller", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await sql`
        DELETE FROM products
        WHERE id=${id}
        RETURNING *
        `;

        if (deletedProduct.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        console.log("Deleted Product")
        res.status(200).json({ success: true, message: "Product deleted successfully", data: deletedProduct[0] })
    } catch (error) {
        console.log("Error in deleteProduct controller", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}