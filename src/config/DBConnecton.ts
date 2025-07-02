// Need to setup connection to DB here
import mongoose, { mongo } from "mongoose";
require("dotenv").config();

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
  throw new Error("DB_STRING is not defined in the .env file");
}

export const connection = mongoose.createConnection(mongoURL);