const express = require('express')
const router = express.Router()

const blog = require("../blog/theme");

router.get("/blog/:query" , blog.getBlog)

router.post("/blog/add" , blog.setBlog);

module.exports = router
