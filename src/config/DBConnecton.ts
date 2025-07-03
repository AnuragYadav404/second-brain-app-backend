// Need to setup connection to DB here
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 *
 * DB_STRING=mongodb://<user>:<password>@cluster_or_whatever/database_name
 */
const mongoURL = process.env.DB_STRING;
if(!mongoURL) {
  console.log("Error connecting to database:=)")
  throw new Error("DB_STRING is not defined in the .env file");
}

console.log("Creating connection")
export const connection = mongoose.connect(mongoURL)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
});