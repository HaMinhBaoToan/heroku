const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const userModel = require("../models/users.model");
const mailer = require("../utils/mailOTP");
const imageToBase64 = require("image-to-base64");
const router = express.Router();

const accessTokenfs = (user) => {
  const accessToken = jwt.sign(
    {
      UsersId: user.UsersId,
      JobId: user.JobId,
      DislayName: user.DislayName,
      Image: user.Image,
      OTP_Confim: user.OTP_Confim,
    },
    "SECRET_KEY",
    {
      expiresIn: 600 * 10, // seconds
    }
  );
  return accessToken;
};

router.post("/log-in", async function (req, res) {
  const user = await userModel.singleByEmail(req.body.Email);
  if (user === null) {
    return res.status(200).json({
      email: false,
    });
  }

  if (!bcrypt.compareSync(req.body.Password, user.Password)) {
    return res.status(200).json({
      Password: false,
    });
  }

  const accessToken = accessTokenfs(user);

  const refreshToken = randomstring.generate();
  await userModel.updateRefreshToken(user.UsersId, refreshToken);

  res.status(200).json({
    authenticated: true,
    accessToken,
    refreshToken,
  });
});
router.post("/log-in-with-google", async function (req, res) {
  const user = await userModel.singleByEmail(req.body.Email);
  if (user === null) {
    return res.status(200).json({
      email: false,
    });
  }

  const accessToken = accessTokenfs(user);

  const refreshToken = randomstring.generate();
  await userModel.updateRefreshToken(user.UsersId, refreshToken);

  res.status(200).json({
    authenticated: true,
    accessToken,
    refreshToken,
  });
});

router.post("/check-otp-email", async function (req, res) {
  const user = await userModel.singleByEmail(req.body.Email);
  if (user === null) {
    return res.status(200).json({
      email: false,
    });
  }

  const accessToken = accessTokenfs(user);

  const refreshToken = randomstring.generate();
  await userModel.updateRefreshToken(user.UsersId, refreshToken);

  res.status(200).json({
    authenticated: true,
    accessToken,
    refreshToken,
  });
});
router.post("/check-email", async function (req, res) {
  const user = await userModel.singleByEmail(req.body.Email);
  if (user === null) {
    return res.status(200).json({
      authenticated: false,
    });
  } else {
    user.OTP = Math.random().toString().substring(2, 8);
    await userModel.updateOTPEmail(req.body.Email, user.OTP);
    mailer(req.body.Email, user.OTP);

    return res.status(200).json({
      authenticated: true,
      user: user,
    });
  }
});

router.post("/log-out", async function (req, res) {});
router.post("/profile-user", async function (req, res) {
  const userId = req.body.userId;
  const user = await userModel.profile(userId);
  return res.status(200).json({
    user: user,
  });
});

router.post("/edit-profile", async function (req, res) {
  const userId = req.body.userId;
  const userName = req.body.userName;
  const Email = req.body.Email;
  await userModel.updateProfile(userId, userName, Email);

  const user = await userModel.profile(userId);
  return res.status(200).json(user);
});

router.post("/register", async function (req, res) {
  //  tao tai khoan
  const user_register = req.body; /// DislayName,   Email  Password,   Created_at

  const user = await userModel.singleByEmail(user_register.Email);

  if (user !== null) {
    return res.status(204).json();
  } else {
    user_register.OTP = Math.random().toString().substring(2, 8);
    user_register.Password = bcrypt.hashSync(user_register.Password, 3);
    user_register.JobId = 2;
    user_register.isActive = 1;
    user_register.Point = 0;

    user_register.Userid = await userModel.add(user_register);
    delete user_register.Password;
    mailer(user_register.Email, user_register.OTP);
    res.status(200).json();
  }
});

router.post("/register-with-google", async function (req, res) {
  //  tao tai khoan
  const user_register = req.body; /// DislayName,   Email  Password,   Created_at

  const user = await userModel.singleByEmail(user_register.Email);

  if (user !== null) {
    return res.status(204).json();
  } else {
    user_register.OTP = Math.random().toString().substring(2, 8);
    user_register.Password = bcrypt.hashSync("123456", 3);
    user_register.JobId = 2;
    user_register.isActive = 1;
    user_register.Point = 0;

    await imageToBase64(user_register.Image) // Image URL
      .then((response) => {
        user_register.Image = response;
      })
      .catch((error) => {
        console.log(error); // Logs an error if there was one
      });
    user_register.Userid = await userModel.add(user_register);

    mailer(user_register.Email, user_register.OTP);
    res.status(200).json();
  }
});

router.get("/register/:id/:otp", async function (req, res) {
  const id = req.params.id || 0;
  const otp = req.params.otp;

  const single = await userModel.checkOTP(id, otp);

  if (single === null) {
    res.json(false);
  } else {
    const accessToken = accessTokenfs(single);

    const refreshToken = randomstring.generate();
    await userModel.updateRefreshToken(single.UsersId, refreshToken);

    res.status(200).json({
      authenticated: true,
      accessToken,
      refreshToken,
    });
  }
});

router.put("/register/:id", async function (req, res) {
  const user = req.params;
  user.OTP = Math.random().toString().substring(2, 8);
  const userres = await userModel.updateOTP(user.id, user.OTP); // đổi OTP xong thì gửi mail lại
  mailer(userres.Email, user.OTP);
  res.json(userres.Email);
});

router.post("/forgot-password", async function (req, res) {
  const user = await userModel.singleByEmail(req.body.Email);
  if (user === null) {
    return res.status(200).json(false);
  }
  req.body.Password = bcrypt.hashSync(req.body.Password, 3);
  const temp = await userModel.resetPassword(req.body.Email, req.body.Password);
  res.status(200).json({ Mes: "OK" });
});

router.post("/change-password", async function (req, res) {
  const user = await userModel.singleByEmail(req.body.Email);
  if (user === null) {
    return res.status(404).json(false);
  }
  req.body.NewPassword = bcrypt.hashSync(req.body.NewPassword, 3);
  if (!bcrypt.compareSync(req.body.CurrentPassword, user.Password)) {
    return res.status(200).json(false);
  }
  const temp = await userModel.changePassword(
    req.body.Email,
    req.body.NewPassword
  );
  if (temp === null) {
    return res.status(200).json(false);
  }
  res.status(200).json(true);
});

router.post("/refresh", async function (req, res) {
  const { accessToken, refreshToken } = req.body;
  const { UsersId, JobId, DislayName, Image, OTP_Confim } = jwt.verify(
    accessToken,
    "SECRET_KEY",
    {
      ignoreExpiration: true,
    }
  );
  const singleUser = await userModel.single(UsersId);
  const ret = await userModel.isValidRefreshToken(UsersId, refreshToken);
  var singleUser_DislayName = singleUser.DislayName;
  if (ret === true) {
    const newAccessToken = jwt.sign(
      { UsersId, JobId, DislayName:singleUser_DislayName, Image, OTP_Confim },
      "SECRET_KEY",
      {
        expiresIn: 600 * 10,
      }
    );
    return res.json({
      accessToken: newAccessToken,
    });
  }
  
  res.status(400).json({
    message: "Invalid refresh token.",
  });
});

module.exports = router;
