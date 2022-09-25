const express = require('express')
const router = express.Router()

const blog = require("../blog/theme");

router.post("/add" , blog.setBlog);

module.exports = router
