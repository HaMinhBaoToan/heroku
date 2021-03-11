const express = require("express");
const categoryModel = require("../models/category.model");
const { cloudinary } = require("../../server/utils/cloudinary");

const router = express.Router();

const someFunction = (myArray) => {
  const promises = myArray.map(async (item, index) => {
    const folder = item.CategoryName.split(" ").join("_");
    const { resources } = await cloudinary.search
      .expression(`folder: ${folder}`)
      .sort_by("public_id", "asc")
      .execute();
    return {
      ...item,
      resources: resources,
    };
  });
  return Promise.all(promises);
};

router.get("/", async function (req, res) {
  const list = await categoryModel.allAdmin();
  if (list.length !== 0) {
    res.json(list);
  } else {
    console.log("null");
  }
});

router.get("/:id", async function (req, res) {
  const id = req.params.id;
  console.log(id);
  const list = await categoryModel.single(id);
  if (list.length !== 0) {
    res.json(list);
  } else {
    console.log("null");
  }
});
router.get("/byUser/:id", async function (req, res) {
  const id = req.params.id;
  const list = await categoryModel.ByUserID(id);
  if (list.length !== 0) {
    res.json(list);
  } else {
    console.log("null");
  }
});

router.put("/:id", async function (req, res) {
  const id = req.params.id;
  const values = req.body;
  if (values.Image) {
    if (values.Change === false) {
    } else {
      cloudinary.uploader.upload(values.Image, function (err, res) {
        values.Image = res.url;
      });
    }
  } else {
  }
  delete values.Change;
  await categoryModel.update(id, values);
  res.status(200).json({
    message: "update success",
  });
});

module.exports = router;
