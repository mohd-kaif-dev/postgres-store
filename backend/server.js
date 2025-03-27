import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

import productRoutes from "./routes/product.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();


app.use(helmet({
    contentSecurityPolicy: false
})); // Helmet is a security middleware that helps you protect your app by setting various HTTP headers

app.use(morgan('dev')); // Morgan is a logging middleware for HTTP requests i.e it will log the requests

app.use(cors()); // CORS is a middleware that allows you to enable CORS for your app

app.use(express.json()); // Express.js middleware for parsing JSON data in requests

app.use(express.urlencoded({ extended: true })); // Express.js middleware for parsing URL-encoded data in requests

// apply arcjet middleware to all requests
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1 // this specifies each request consumes 1 token
        })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                res.status(429).json({ error: "Too Many Requests" })
            } else if (decision.reason.isBot()) {
                res.status(403).json({ error: "Bot access denied" })
            } else {
                res.status(403).json({ error: "Forbidden" })
            }
            return
        }
        // check for spoofed bots
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({ error: "Spoofed Bot Detected" })
            return
        }

        next()
    } catch (error) {
        console.log("Error in arcjet middleware", error)
        next(error)
    }
})

app.use('/api/products', productRoutes);

if (process.env.NODE_ENV === "production") {
    //serve our react app
    app.use(express.static(path.join(__dirname, "/frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                description VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log("Database initialized");
    } catch (error) {
        console.log("Erro initDB", error)
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    })
})