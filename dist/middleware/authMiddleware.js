"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../utils/jwt");
function requireAuth(req, res, next) {
    const auth = req.header('Authorization')?.split(' ')[1];
    if (!auth)
        return res.status(401).json({ error: 'Missing token' });
    try {
        const payload = (0, jwt_1.verifyToken)(auth);
        req.userId = payload.userId;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}
