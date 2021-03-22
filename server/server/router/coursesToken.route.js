const express = require("express");
const categoryModel = require("../models/category.model");


const router = express.Router();

router.post("/addCmt", async function (req, res) {
    const addCmt = req.body;

    const resual = await categoryModel.addRateCmt(addCmt);
    res.status(200).json(resual);
});

router.post("/addLike", async function (req, res) {
    const addLike = req.body;
    const resual = await categoryModel.addLike(addLike);
    res.status(200).json(resual);
});

router.put("/delLike", async function (req, res) {
    const delLike = req.body;
    const resual = await categoryModel.delLike(delLike);
    res.status(200).json(resual);
});

router.post("/addRes", async function (req, res) {
    const addRes = req.body;
    const resual = await categoryModel.addRes(addRes);
    res.status(200).json(resual);
});

router.put("/updateDoneRes", async function (req, res) {
    const updateDoneRes = req.body;
    const resual = await categoryModel.updateDoneRes(updateDoneRes);
    res.status(200).json(resual);
});

module.exports = router;
