import express from "express";

const app = express();
app.use(express.json())
// need to define routes here

// Routes:
/* 
    /api/v1
    Authentication routes:
    /api/v1
    Sign up -> post -> /api/v1/signup
    Login -> post -> /api/v1/login

    Content Routes -> authenticated routes:
    Get Content Routes -> api/v1/contents
    create new content  -> POST-> api/v1/contents
    Get a particular content -> GET /api/v1/contents/:content_id
    update content route -> PUT -> /api/v1/contents/:content_id

    Share Routes:
    Access someone's shared content
    GET /api/v1/brain/:share_hash

    authenticated route
    Getting my own share hash
    GET /api/v1/brain/share

*/


app.get("/", (req, res, next) => {
    const body = req.body;
    req.userId = "abracadabara";
    next()
    res.json({
        message: "Hello World"
    })
})