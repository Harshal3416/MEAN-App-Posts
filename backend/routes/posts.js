const express = require("express");
const extractFile = require("../middleware/file")
const PostController = require("../controllers/posts")

const checkAuth = require("../middleware/check-auth")

const router = express.Router();

router.post("", checkAuth, extractFile, PostController.createPost);

router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getSinglePost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
