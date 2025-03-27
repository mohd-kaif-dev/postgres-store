import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config()

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env

// creates a SQL conneciton using our env variables
export const sql = neon(
    `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
)

// this sql fuction is used as a tagged template literal, which allows us to write SQL queries safely