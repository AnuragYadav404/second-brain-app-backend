"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
// Need to setup connection to DB here
const mongoose_1 = __importDefault(require("mongoose"));
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
if (!mongoURL) {
    throw new Error("DB_STRING is not defined in the .env file");
}
exports.connection = mongoose_1.default.createConnection(mongoURL);
