const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
// var path = require("path");
// var fs = require("fs");


const app = express();

const USERS = require("./server/router/users.route");
const CATEGORYGROUP = require("./server/router/categorygroup.route");
const CATEGORY = require("./server/router/category.route");
const COURSES = require("./server/router/courses.route");
const PRODUCT = require("./server/router/product.route");

const AUTH = require("./server/router/auth.route");
const HOME = require("./server/router/home.route");

const decentralization = require("./server/middlewares/auth.mdw"); // phân quyền


const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

app.use(cors());
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(morgan("dev"));

app.get("/", (request, respond) => {
  respond.status(200).json({
    message: "Welcome to Project Support",
  });
});

app.use("/api/users", decentralization, USERS);
app.use("/api/categorygroup", decentralization, CATEGORYGROUP);
app.use("/api/category", decentralization, CATEGORY);
app.use("/api/product", decentralization, PRODUCT);

app.use("/api/courses", COURSES);

app.use("/api/auth", AUTH);

app.use("/api/home", HOME);

app.get("/err", function (req, res) {
  throw new Error("Error!");
});

// var filesDir = path.join(path.dirname(require.main.filename), "uploads");
// if (!fs.existsSync(filesDir)) {
//   fs.mkdirSync(filesDir);
// }

// app.post(
//   "/api/upload/",
//   upload.fields([{ name: "file" }]),
//   async function (req, res) {
//     // const values = req.body;
//     // console.log(values );

//     console.log(req.files.file[0]);
//     const upload = await uploadbybuff(req.files.file[0], "video");
//     console.log(upload);
//   }
// );

app.use(function (req, res, next) {
  res.status(404).send({
    error_message: "Endpoint not found!",
  });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({
    error_message: "Something broke!",
  });
});

app.listen(PORT, function () {
  console.log(`Server is running on Port: http://localhost:${PORT}`);
});

module.exports = app;
