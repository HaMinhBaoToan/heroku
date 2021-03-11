const express = require("express");
const categoryModel = require("../models/category.model");
const { cloudinary } = require('../../server/utils/cloudinary');

const router = express.Router();


router.get('/category/:id/:userid', async function (req, res) {
  const id = req.params.id || 0;
  const userid = parseInt(req.params.userid || 0);
  const categories = await categoryModel.getCategory(id, userid);
  if (categories === null) {
    return res.status(204).end();
  }
  res.json(categories);
}); 

router.put('/products/:id/:quanview', async function (req, res) {
  const id = req.params.id || 0;
  const quanview = req.params.quanview || 0;
  const products = await categoryModel.updateProductView(id,quanview);
  if (products === null) {
    return res.status(204).end();
  }
  res.json(products);
}); 


module.exports = router;
