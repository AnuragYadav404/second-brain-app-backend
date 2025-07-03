"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModel_1 = require("./models/UserModel");
const DBConnecton_1 = require("./config/DBConnecton");
const userCredentialValidator_1 = require("./middlewares/userCredentialValidator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const ContentModel_1 = require("./models/ContentModel");
const userContentValidator_1 = require("./middlewares/userContentValidator");
const userShareValidator_1 = require("./middlewares/userShareValidator");
const LinkModel_1 = require("./models/LinkModel");
const randomHashGenerator_1 = require("./config/randomHashGenerator");
dotenv_1.default.config();
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
const JWT_SECRET = process.env.JWT_SECRET;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// need to define routes here
// Routes:
/*
    // Content Routes -> authenticated routes:
    // Get Content Routes -> api/v1/contents
    // create new content  -> POST-> api/v1/contents
    
    //Have to implement this, maybe later :=)
    Get a particular content -> GET /api/v1/contents/:content_id
    update content route -> PUT -> /api/v1/contents/:content_id

    Share Routes:
    Access someone's shared content
    GET /api/v1/brain/:share_hash

    authenticated route
    Getting my own share hash
    GET /api/v1/brain/share

*/
app.post("/api/v1/signup", userCredentialValidator_1.userCredentalValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Hashing the password and storing it
    const signupBody = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(signupBody.password, 5);
    // Now we need to store the User in the database with the corresponding credentials :-)
    // Might also need to check whether the username is already taken or not
    // Unique constraint already does this for us
    try {
        yield UserModel_1.UserModel.create({
            username: signupBody.username,
            hashedPassword: hashedPassword
        });
        res.status(200).json({
            message: "Sign up Successful!"
        });
    }
    catch (e) {
        console.log("DB Error:", e);
        if (e.code === 11000) {
            res.status(409).json({ message: "Username already taken" });
            return;
        }
        res.status(500).json({ message: "Server error, try again later" });
        return;
    }
}));
app.post("/api/v1/signin", userCredentialValidator_1.userCredentalValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // now here, we need to generate token for the frontend
    // token lifecycle is not being implemented here
    const signinBody = req.body;
    const userFromDatabase = yield UserModel_1.UserModel.findOne({
        username: signinBody.username
    });
    // now we compare the password hash
    if (!userFromDatabase) {
        res.status(403).json({
            message: "This user does not exist"
        });
        return;
    }
    const passwordMatch = yield bcrypt_1.default.compare(signinBody.password, userFromDatabase.hashedPassword);
    if (passwordMatch) {
        const token = jsonwebtoken_1.default.sign({
            id: userFromDatabase._id.toString()
        }, JWT_SECRET);
        res.status(200).json({
            token
        });
    }
    else {
        res.status(403).json({
            message: "Invalid credentials"
        });
        return;
    }
}));
app.get("/api/v1/contents", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Here we just fetch the contents from the content model
    try {
        const contentForUser = yield ContentModel_1.ContentModel.find({
            userId: req.userId,
        });
        res.status(200).json({
            message: "Protected route accessed",
            content: contentForUser,
        });
    }
    catch (e) {
        res.status(500).json({ message: "Server error, try again later" });
        return;
    }
}));
app.post("/api/v1/contents", authMiddleware_1.authMiddleware, userContentValidator_1.userContentValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Here we just fetch the contents from the content model
    const contentBody = req.body;
    try {
        yield ContentModel_1.ContentModel.create({
            title: contentBody.title,
            link: contentBody.link,
            type: contentBody.type,
            userId: req.userId,
        });
        res.status(200).json({
            message: "Content created successfully"
        });
    }
    catch (e) {
        res.status(500).json({ message: "Server error, try again later" });
        return;
    }
}));
app.delete("/api/v1/content", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    try {
        yield ContentModel_1.ContentModel.deleteMany({
            contentId,
            userId: req.userId
        });
        res.json({
            message: "Deleted"
        });
    }
    catch (e) {
        res.status(500).json({ message: "Server error, try again later" });
        return;
    }
}));
// Need to implement share and get Shared Content link
app.post("/api/v1/brain/share", authMiddleware_1.authMiddleware, userShareValidator_1.userShareValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    // share is a boolean passed in body
    // Need to do validation here as well
    if (share) {
        //Create a share hash for the current user
        //first check if it alread exists
        try {
            const existingHash = yield LinkModel_1.LinkModel.findOne({
                userId: req.userId,
            });
            if (existingHash) {
                res.status(200).json({
                    hash: existingHash.hash
                });
                return;
            }
            // we need to create a random hash now
            const randomHash = (0, randomHashGenerator_1.randomHashGenerator)(10);
            yield LinkModel_1.LinkModel.create({
                hash: randomHash,
                userId: req.userId
            });
            res.status(200).json({
                hash: randomHash
            });
            return;
        }
        catch (e) {
            res.status(500).json({ message: "Server error, try again later" });
            return;
        }
    }
    else {
        //if share set to boolean false => delete any links associated with current user
        yield LinkModel_1.LinkModel.deleteMany({
            userId: req.userId,
        });
        res.status(200).json({
            message: "Deleted share link hash"
        });
    }
}));
app.get("/api/v1/brain/share/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield LinkModel_1.LinkModel.findOne({
        hash
    });
    console.log(link);
    console.log(hash);
    // userid in link
    if (link) {
        const contents = yield ContentModel_1.ContentModel.find({
            userId: link.userId
        });
        res.status(200).json({
            contents
        });
    }
    else {
        res.status(411).json({
            message: "Incorrect share link"
        });
    }
}));
DBConnecton_1.connection.then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
        console.log("🚀 Server running on port 3000");
    });
});
