const express = require("express");
const router = express.Router();
const categorygroupModel = require("../models/categorygroup.model");

router.get("/", async function (req, res) {
  const list = await categorygroupModel.all();
  res.json(list);
});

router.post("/", async function (req, res) {
  const addCategoryGroup = req.body;
  addCategoryGroup.isActive = 1;
  const resual = await categorygroupModel.add(addCategoryGroup);
  res.status(200).json(resual);
});
router.put("/:id", async function (req, res) {
  const id = req.params.id;
  const CategoryGroup = req.body;

  delete CategoryGroup.Created_At;
  delete CategoryGroup.CategoryGroupId;

  await categorygroupModel.update(id, CategoryGroup);
  res.status(200).json({
    message: "update success",
  });
});
router.delete("/:id", async function (req, res) {
  const id = req.params.id || 0;
  if (id === 0) {
    return res.status(304).end();
  }
  const list = await categorygroupModel.GetCategoryByCategoryGroupId(id);

  if (list.length === 0) {
    await categorygroupModel.delete(id).then((result) => {
      res.status(200).json(list);
    }).catch((err) => {
      res.status(500).json(err);
    });
  }
  else {
    res.status(202).json({ message: "Tồn Tại Khóa Học Trong Lĩnh Vực Này" });
   
  }

});
module.exports = router;
