const { json } = require("body-parser");
const express = require("express");
const categoryModel = require("../models/category.model");
const router = express.Router();


router.get("/showCategoryOrderBy/:orderbyType/:limit", async function (req, res) {
    const orderbyType = req.params.orderbyType;
    const limit = req.params.limit;
    const list = await categoryModel.showCategoryOrderBy(orderbyType,limit);
    res.json(list);
});


router.get("/showCategorySortWeekLikeDetail/:limit", async function (req, res) {
    const limit = req.params.limit;
    const list = await categoryModel.showCategorySortWeekLikeDetail(limit);
    res.json(list);
});

router.get("/showCategorySortWeekResDetail/:limit", async function (req, res) {
    const limit = req.params.limit;
    const list = await categoryModel.showCategorySortWeekResDetail(limit);
    res.json(list);
});

module.exports = router;
