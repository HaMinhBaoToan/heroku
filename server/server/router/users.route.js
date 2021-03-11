const express = require("express");
const bcrypt = require("bcryptjs");

const usersModel = require("../models/users.model");

const router = express.Router();

// router.post("/", async function (req, res) {  //  tao tai khoan
//   const user = req.body;
//   user.Password = bcrypt.hashSync(user.Password, 3);
//   user.id = await usersModel.add(user);
//   delete user.password;
//   res.status(201).json(user);
// });

router.get("/", async function (req, res) {
  // dua vao token lấy user

  // console.log(req.accessTokenPayload);
  const list = await usersModel.all();

  res.json(list);
});

router.get("/:id", async function (req, res) {
  const id = req.params.id || 0;
  const single = await usersModel.single(id);

  if (single === null) {
    return res.status(204).end();
  }

  res.json(single);
});

router.post("/teacher", async function (req, res) {
  //  tao tai khoan
  const addTeacher = req.body;

  const user = await usersModel.singleByEmail(addTeacher.Email);

  if (user !== null) {
    return res.status(204).json();
  } else {
    addTeacher.Password = bcrypt.hashSync("123456", 3);
    addTeacher.Jobid = 3;
    addTeacher.isActive = 1;
    addTeacher.OTP_Confim = 1;
    const resual = await usersModel.add(addTeacher);
    delete addTeacher.Password;
    res.status(200).json(resual);
  }
});

router.put("/:id", async function (req, res) {
  const id = req.params.id;
  const user = req.body;
  delete user.key;
  delete user.UsersId;
  delete user.OTP_Confim;

  await usersModel.update(id, user);
  res.status(200).json({
    message: "update success",
  });
});

router.delete("/:id", async function (req, res) {
  const id = req.params.id || 0;
  if (id === 0) {
    return res.status(304).end();
  }
  await usersModel
    .del(id)
    .then((result) => {
      res.json({
        message: "delete success",
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
router.get("/favorite-category/:id", async function (req, res) {
  const id = req.params.id;
  const User = await usersModel.favoriteCategory(id);
  if (User == null) {
    return res.status(200).json(false);
  }

  let temp = [];
  User.forEach((e) => {
    const category = usersModel.categoryDetail(e.Categoryid);
    temp.push(category);
  });
  res.status(200).json(temp);
  // const listCategory = [];
  // listCategory=   User.Categoryid;
});

router.get("/category-user/:id", async function (req, res) {
  const id = req.params.id;
  const User = await usersModel.CategoryUser(id);
  if (User == null) {
    return res.status(200).json(false);
  }

  let temp = [];
  User.forEach((e) => {
    const category = usersModel.categoryDetail(e.Categoryid);
    temp.push(category);
  });
  res.status(200).json(temp);
  // const listCategory = [];
  // listCategory=   User.Categoryid;
});
module.exports = router;
