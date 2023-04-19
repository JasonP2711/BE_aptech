const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport"); // Khai báo passport(passport dùng để kiểm tra token)
// const jwtStrategy = require("passport-jwt").Strategy; //method strategy cuar passport
// const ExtracJwt = require("passport-jwt").ExtractJwt;
// const JwtSettings = require("./constants/JwtSetting");
//phần này được đưa ra một file riêng có tên là passport trong mục middleware

require("dotenv").config(); //khai báo file .env

// // Passport: jwt
// const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // lấy token ở AuthHeader có dạng BearerToken
// opts.secretOrKey = jwtSettings.SECRET; //kiểm tra token để mã hóa ngược lại(SCRET ở đây phải giống SCRET được truyền vào file jwtHelpper.js)
// opts.audience = jwtSettings.AUDIENCE;
// opts.issuer = jwtSettings.ISSUER;

// passport.use(
//   new JwtStrategy(opts, function (payload, done) {
//     console.log(payload);
//     if (jwtSettings.WHITE_LIST.includes(payload.sub)) {
//       let error = null;
//       let user = true;
//       return done(error, user);
//     } else {
//       let error = null;
//       let user = false;
//       return done(error, user);
//     }
//   })
// );
//phần này được đưa ra một file riêng có tên là passport trong mục middleware

//MONGOOSE
//Tạo kết nối đến mongodb bằng mongoose
const { default: mongoose } = require("mongoose");
const { CONNECTION_STRING } = require("./constants/DataBasetting");

// const {
//   passportConfig,
//   passportConfigLocal,
// } = require("./middleware/passport");

const passportConfig = require("./middleware/passport");

// const passportConfig = require("./middleware/passport");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
// const CategoriesRouter = require('./routes/BaiTap/Categories');
// const EmployeeRouter = require("./routes/BaiTap/Employee");
// const CustomerRouter = require("./routes/BaiTap/Customer");
// const SupplierRouter = require("./routes/BaiTap/Supplier");
// const ProductsRouter = require("./routes/BaiTap/Products");
const CategoriesRouter = require("./routes/BaiTap/CategoriesMongo");
const CustomerRouter = require("./routes/BaiTap/CustomerMongo");
const ProductsRouter = require("./routes/BaiTap/ProductsMongo");
const SupplierRouter = require("./routes/BaiTap/SupplierMongo");
const EmployeeRouter = require("./routes/BaiTap/EmployeeMongo");
const OrderRouter = require("./routes/BaiTap/OrderMongo");
const QuestionRouter = require("./routes/BaiTap/Question");
const uploadRouter = require("./routes/BaiTap/Upload");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "*",
  })
);

//Tạo kết nối đến mongodb bằng mongoose
mongoose.set("strictQuery", false);
mongoose.connect(CONNECTION_STRING);

passport.use(passportConfig);

//không nên dùng chữ hoa đầu tên đường dẫn, sửa lại chữ thường
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/Employee", EmployeeRouter);
app.use("/Customer", CustomerRouter);
app.use("/Categories", CategoriesRouter);
app.use("/Supplier", SupplierRouter);
app.use("/Products", ProductsRouter);
app.use("/Order", OrderRouter);
app.use("/Question", QuestionRouter);

app.use("/upload", uploadRouter);

//upload file
app.get("/chat", (req, res) => {
  //gửi file html
  res.sendFile(__dirname + "/Index.html");
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
