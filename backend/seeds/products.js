import { sql } from "../config/db.js";

const SAMPLE_PRODUCTS = [
    {
        name: "Premium Wireless Headphones",
        price: 299.99,
        description: "Experience clear audio like never before with our premium wireless headphones",
        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
    },
    {
        name: "Mechanical Gaming Keyboard",
        price: 159.99,
        description: "Game like a pro with our mechanical gaming keyboard, designed for speed and accuracy",
        image:
            "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=60",
    },
    {
        name: "Smart Watch Pro",
        price: 249.99,
        description: "Stay connected and on top of your fitness goals with our Smart Watch Pro",
        image:
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60",
    },
    {
        name: "4K Ultra HD Camera",
        price: 899.99,
        description: "Capture life's precious moments in stunning 4K Ultra HD with our top-of-the-line camera",
        image:
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60",
    },
    {
        name: "Minimalist Backpack",
        price: 79.99,
        description: "Travel light and in style with our minimalist backpack",
        image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60",
    },
    {
        name: "Wireless Gaming Mouse",
        price: 89.99,
        description: "Experience the thrill of wireless gaming with our high-performance wireless gaming mouse",
        image:
            "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop&q=60",
    },
    {
        name: "Smart Home Speaker",
        price: 159.99,
        description: "Fill your home with crystal clear sound with our Smart Home Speaker",
        image:
            "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&auto=format&fit=crop&q=60",
    },
    {
        name: "LED Gaming Monitor",
        price: 449.99,
        description: "Immerse yourself in the gaming experience with our LED Gaming Monitor",
        image:
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60",
    },
];

async function seedDatabase() {
    try {
        // first, clear existing data
        await sql`TRUNCATE TABLE products RESTART IDENTITY`;

        // insert all products
        for (const product of SAMPLE_PRODUCTS) {
            await sql`
        INSERT INTO products (name, price, image, description)
        VALUES (${product.name}, ${product.price}, ${product.image}, ${product.description})
      `;
        }

        console.log("Database seeded successfully");
        process.exit(0); // success code
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1); // failure code
    }
}

seedDatabase();