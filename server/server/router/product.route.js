const express = require("express");
let streamifier = require("streamifier");
var multer = require("multer");
var upload = multer();
const productModel = require("../models/product.model");
const { cloudinary } = require("../../server/utils/cloudinary");

const router = express.Router();

const uploadbybuff = (file, type) => {
  return new Promise((resolve, reject) => {
    try {
      if (!file) {
        return resolve({ url: "" });
      }
      let stream = cloudinary.uploader.upload_stream(
        { resource_type: type },
        (error, result) => {
          if (result) {
            return resolve(result);
          } else {
            return reject(error);
          }
        }
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    } catch (e) {
      return reject(e);
    }
  });
};
router.post("/", upload.fields([{ name: "File" }]), async function (req, res) {
  const addProduct = req.body;
  addProduct.Public = 0;
  if (req.files.File) {
    const upload = await uploadbybuff(req.files.File[0], "video");
    console.log(upload.url);
    addProduct.Video = upload.url;
    const resual = await productModel.add(addProduct);
    res.status(200).json(resual);
  } else {
    console.log(addProduct);
    delete addProduct.File;
    const resual = await productModel.add(addProduct);
    res.status(200).json(resual);
  }
  // const resual = await productModel.add(addProduct);
  // res.status(200).json(resual);
});
router.get("/byCategory/:id", async function (req, res) {
  const id = req.params.id;

  const list = await productModel.GetProductByCategoryId(id);
  if (list.length !== 0) {
    res.json(list);
  } else {
    res.json(list);
  }
});

router.put(
  "/:id",
  upload.fields([{ name: "File" }]),
  async function (req, res) {
    const id = req.params.id;
    const values = req.body;

    if (values.Public === "0") {
      values.Public = 0;
    } else {
      values.Public = 1;
    }

    const checkChangeFile = values.ChangeFile;
    delete values.ChangeFile;
    if (checkChangeFile === "true") {
      console.log("vao if", checkChangeFile);
      delete values.File;

      const upload = await uploadbybuff(req.files.File[0], "video");
      console.log(upload.url);
      values.Video = upload.url;
      await productModel.update(id, values);
      res.status(200).json({
        message: "update success",
      });
    }
    if (checkChangeFile === "false") {
      console.log("vào else", checkChangeFile);

      delete values.File;
      await productModel.update(id, values);
      res.status(200).json({
        message: "update success",
      });
    }
    // console.log(id);
    // console.log(values);

    //     console.log(req.files.file[0]);
    //     const upload = await uploadbybuff(req.files.file[0], "video");
    //     console.log(upload);
    // if (values.Image) {
    //   if (values.Change === false) {
    //   } else {
    //     cloudinary.uploader.upload(values.Image, function (err, res) {
    //       values.Image = res.url;
    //     });
    //   }
    // } else {
    // }
    // delete values.Change;
    // await categoryModel.update(id, values);
    // res.status(200).json({
    //   message: "update success",
    // });
  }
);

router.delete("/:id", async function (req, res) {
  const id = req.params.id || 0;
  if (id === 0) {
    return res.status(304).end();
  }

  await productModel
    .delete(id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
module.exports = router;
