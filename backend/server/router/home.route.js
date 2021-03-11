const { json } = require("body-parser");
const express = require("express");
const categoryModel = require("../models/category.model");
const router = express.Router();

router.get("/showCategory", async function (req, res) {
    const list = await categoryModel.showCategory();
    res.json(list);
});

module.exports = router;
