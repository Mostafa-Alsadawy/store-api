import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const env = process.env



const client = new Pool({
    host:env.HOST,
    user:env.USER,
    password:env.PASSWORD,
    database:(env.NODE_ENV == "dev"? env.DB : env.DB_TEST)
})

export default client;