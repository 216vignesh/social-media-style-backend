"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
exports.getMyPosts = getMyPosts;
exports.getUserPosts = getUserPosts;
exports.getFeed = getFeed;
const postService = __importStar(require("../services/postService"));
async function createPost(req, res, next) {
    try {
        const author = req.userId;
        const { content, mediaUrl } = req.body;
        if (!content)
            throw { status: 400, message: 'Content is required' };
        const postId = await postService.createPost(author, content, mediaUrl);
        res.status(201).json({ data: { postId } });
    }
    catch (err) {
        next(err);
    }
}
async function getMyPosts(req, res, next) {
    try {
        const posts = await postService.getPostsByUser(req.userId);
        res.json({ data: posts });
    }
    catch (err) {
        next(err);
    }
}
async function getUserPosts(req, res, next) {
    try {
        const posts = await postService.getPostsByUser(req.params.id);
        res.json({ data: posts });
    }
    catch (err) {
        next(err);
    }
}
async function getFeed(req, res, next) {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const skip = parseInt(req.query.skip) || 0;
        const feed = await postService.getFeed(req.userId, limit, skip);
        res.json({ data: feed });
    }
    catch (err) {
        next(err);
    }
}
