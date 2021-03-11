const express = require("express");
const productModel = require("../models/product.model");

const router = express.Router();
router.get("/byCategory/:id", async function (req, res) {
  const id = req.params.id;

  const list = await productModel.GetProductByCategoryId(id);
  if (list.length !== 0) {
    res.json(list);
  } else {
    console.log("null");
  }
});
module.exports = router;
