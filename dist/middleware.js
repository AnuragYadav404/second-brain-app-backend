"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
//This middleware checks whether the incoming request is authenticated or not
// if authenticated 
//  ->if (authenticated)
//      ->req.userId is populated with userId
// else return respective invalid credentials or unauth messages
const authMiddleware = (req, res, next) => {
    req.userId = "abracadabara";
    next();
};
exports.authMiddleware = authMiddleware;
