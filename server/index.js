const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const USERS = require('./server/router/users.route');
const CATEGORYGROUP = require('./server/router/categorygroup.route');
const CATEGORY = require('./server/router/category.route');
const COURSES = require('./server/router/courses.route');
const PRODUCT = require('./server/router/product.route');

const AUTH = require('./server/router/auth.route');
const HOME = require('./server/router/home.route');


const decentralization =require('./server/middlewares/auth.mdw'); // phân quyền
// const { cloudinary } = require('./server/utils/cloudinary');
const PORT = process.env.PORT || 4000;
const buildPath = path.join(__dirname, '..', 'build');
if(process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined')); 
}

app.use(express.static(buildPath));
app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(morgan("dev"));

app.get("/", (request, respond) => {
  respond.status(200).json({
    message: "Welcome to Project Support",
  });
});

// app.get('/api/images', async (req, res) => {
//   const { resources } = await cloudinary.search
//       // .expression('folder:After_Effects_CC_Masterclass')
//       // .expression('folder: Complete_Javascript_Course_for_Beginners_with_jQuery_AJAX')
//       .expression('folder: Illustrator_CC_2018_Fundamentals_For_Beginners')
//       // .expression('folder: React_basic_in_just_1_hour')
//       .sort_by('public_id', 'asc')
//       .execute();

//   const publicIds = resources.map((file) => file.public_id);
//   res.send(resources);
// });

app.use('/api/users',decentralization, USERS );
app.use('/api/categorygroup',decentralization, CATEGORYGROUP );
app.use('/api/category',decentralization, CATEGORY );
app.use('/api/product',decentralization, PRODUCT );

app.use('/api/courses', COURSES );

app.use('/api/auth', AUTH );

app.use('/api/home', HOME);


app.get('/err', function (req, res) {
  throw new Error('Error!');
});

app.use(function (req, res, next) {
  res.status(404).send({
    error_message: 'Endpoint not found!'
  })
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send({
    error_message: 'Something broke!'
  });
});



app.listen(PORT, function () {
  console.log(`Server is running on Port: http://localhost:${PORT}`);
});

module.exports = app;