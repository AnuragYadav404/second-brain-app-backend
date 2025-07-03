import express, { request, Request, response, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "./models/UserModel";
import { connection } from "./config/DBConnecton";
import { FinalUserSignupSchema } from "./zodSchemas/userSignupSchema";
import { userCredentalValidator } from "./middlewares/userCredentialValidator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authMiddleware } from "./middlewares/authMiddleware";
import { ContentModel } from "./models/ContentModel";
import { FinalUserContentSchema } from "./zodSchemas/userContentSchema";
import { userContentValidator } from "./middlewares/userContentValidator";
import { userShareValidator } from "./middlewares/userShareValidator";
import { LinkModel } from "./models/LinkModel";
import { FinalUserShareSchema } from "./zodSchemas/userShareSchema";
import { randomHashGenerator } from "./config/randomHashGenerator";
dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(express.json())
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

app.post("/api/v1/signup", userCredentalValidator,async (req: Request, res: Response) => {

    // Hashing the password and storing it
    const signupBody: FinalUserSignupSchema = req.body;    
    const hashedPassword = await bcrypt.hash(signupBody.password, 5);
    // Now we need to store the User in the database with the corresponding credentials :-)
    // Might also need to check whether the username is already taken or not
    // Unique constraint already does this for us
    try {
        await UserModel.create({
            username: signupBody.username,
            hashedPassword: hashedPassword
        })    
         res.status(200).json({
            message: "Sign up Successful!"
        })
    }catch(e: any) {
        console.log("DB Error:", e);
        if (e.code=== 11000) {
            res.status(409).json({ message: "Username already taken" });
            return;
        }
        res.status(500).json({ message: "Server error, try again later"});
        return;
    }
})


app.post("/api/v1/signin", userCredentalValidator, async (req: Request, res: Response) => {
    // now here, we need to generate token for the frontend
    // token lifecycle is not being implemented here
    const signinBody: FinalUserSignupSchema = req.body;
    const userFromDatabase = await UserModel.findOne({
        username: signinBody.username
    })
    // now we compare the password hash
    if (!userFromDatabase) {
        res.status(403).json({
            message: "This user does not exist"
        })
        return;
    }

    const passwordMatch = await bcrypt.compare(signinBody.password, userFromDatabase.hashedPassword);

    if(passwordMatch) {
        const token = jwt.sign({
            id:userFromDatabase._id.toString()
        },JWT_SECRET);

        res.status(200).json({
            token
        })

    }else {
        res.status(403).json({
            message: "Invalid credentials"
        })
        return;
    }

})

app.get("/api/v1/contents",authMiddleware, async (req: Request, res:Response) => {
    // Here we just fetch the contents from the content model

    try {
        const contentForUser = await ContentModel.find({
            userId: req.userId,
        })
        res.status(200).json({
            message:"Protected route accessed",
            content: contentForUser,
        })
    }catch(e) {
        res.status(500).json({ message: "Server error, try again later"});
        return;
    }
    

   
})

app.post("/api/v1/contents",authMiddleware, userContentValidator,async (req: Request, res:Response) => {
    // Here we just fetch the contents from the content model

    const contentBody:FinalUserContentSchema = req.body;

    try {
        await ContentModel.create({
            title: contentBody.title,
            link: contentBody.link,
            type: contentBody.type,
            userId: req.userId,
        })    
         res.status(200).json({
            message: "Content created successfully"
        })
    }catch(e: any) {
        res.status(500).json({ message: "Server error, try again later"});
        return;
    }
})


app.delete("/api/v1/content", authMiddleware, async (req, res) => {
    const contentId = req.body.contentId;

    try {
        await ContentModel.deleteMany({
            contentId,
            userId: req.userId
        })

        res.json({
            message: "Deleted"
        })
    }catch(e: any) {
        res.status(500).json({ message: "Server error, try again later"});
        return;
    }
    
})

// Need to implement share and get Shared Content link

app.post("/api/v1/brain/share", authMiddleware, userShareValidator,async (req: Request, res: Response) => {
    const share:FinalUserShareSchema = req.body.share;
    // share is a boolean passed in body
    // Need to do validation here as well
    if(share) {
        //Create a share hash for the current user
        //first check if it alread exists
        try {
            const existingHash = await LinkModel.findOne({
                userId:req.userId,
            })
            if(existingHash) {
                res.status(200).json({
                    hash: existingHash.hash
                })
                return;
            }
            // we need to create a random hash now
            const randomHash = randomHashGenerator(10);
            await LinkModel.create({
                hash: randomHash,
                userId: req.userId
            })

            res.status(200).json({
                hash: randomHash
            })
            return;
        }catch(e) {
            res.status(500).json({ message: "Server error, try again later"});
            return;
        }

    }else {
        //if share set to boolean false => delete any links associated with current user
        await LinkModel.deleteMany({
            userId: req.userId,
        })

        res.status(200).json({
            message: "Deleted share link hash"
        })
    }

})


app.get("/api/v1/brain/share/:shareLink", async(req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    })

    console.log(link)
    console.log(hash)

    // userid in link

    if(link) {
        const contents = await ContentModel.find({
            userId: link.userId
        })
        res.status(200).json({
            contents
        })
    }else {
        res.status(411).json({
            message: "Incorrect share link"
        })
    }

    
})



connection.then(() => {
    console.log("Database connected")
    app.listen(3000, () => {
        console.log("🚀 Server running on port 3000");
    });
});