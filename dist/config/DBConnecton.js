"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
// Need to setup connection to DB here
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
if (!mongoURL) {
    console.log("Error connecting to database:=)");
    throw new Error("DB_STRING is not defined in the .env file");
}
console.log("Creating connection");
exports.connection = mongoose_1.default.connect(mongoURL)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
});
