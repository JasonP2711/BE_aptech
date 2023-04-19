const passport = require("passport");
const yup = require("yup");
const express = require("express");
const router = express.Router();

const { CONNECTION_STRING } = require("../../constants/DataBasetting");
const { default: mongoose } = require("mongoose");

const { Employee } = require("../../models");
const ObjectId = require("mongodb").ObjectId;
const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

const encodeToken = require("../../helper/JwtHelpper");

// MONGOOSE
// mongoose.set("strictQuery", false);
// mongoose.connect(CONNECTION_STRING);

const { validateSchema, loginSchema } = require("../../validation/Employee");

// const encodeToken = require("../../helper/JwtHelpper");

// Methods: POST / PATCH / GET / DELETE / PUT
//các bước để thao tác dữ liệu với mongodb bằng mongoose:
//B1: kết nối đến mongodb bằng mongoose
//B2: Tạo một schema để validate cho dữ liêu:
//B3: Tạo một API để xử lý các yêu cầu đẩy dữ liệu lên MongoDB
//B4: Thao tác(gửi yêu cầu ) đến API để làm việc với mongodb(sử dụng axios)(bên phần react)

///////////////////////////////////////////////////////////////////////////////

//1 gắn token lên header
//2 gửi lên API
//3 cònfig passport
//4 trả về dữ liệu
////////////////////////////////////////////////////////////////////////////
//tạo token
router.post("/login", validateSchema(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email, password });

    if (!employee) return res.status(404).send({ message: "Not found" });

    const { _id, email: empEmail, firstName, lastName } = employee;
    console.log(employee);
    //userId, email, firstName, lastName
    const token = encodeToken(_id, empEmail, firstName, lastName);
    // console.log("token: ", token);
    res.status(200).json({
      payload: token,
    });
  } catch (err) {
    console.log("53", err);
    res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
});
// kiểm tra token được gửi lên, nếu đúng thì trả về thông tin
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }), //Phuơng thức authenticate có tham số thứ nhất là kiểu jwt
  async (req, res, next) => {
    try {
      console.log("reqreqreqreqreqreqreqreqreqreqreqreqreqreqreqreq", req);
      const employee = await Employee.findById(req.user._id);
      console.log(employee);
      if (!employee) return res.status(404).send({ message: "Not found" });

      res.status(200).json(employee);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

//Tạo một API để xử lý các yêu cầu đẩy dữ liệu lên MongoDB
router.get("/", async (req, res, next) => {
  //chúng ta sử dụng await để đợi kết quả trả về từ các hàm có thể trả về Promise như MyDataModel.find() và MyDataSchema.validate().
  // Sử dụng await giúp đảm bảo rằng chúng ta không tiếp tục thực thi mã cho đến khi Promise đã được giải quyết.
  try {
    let results = await Employee.find();
    res.send(results);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
  // const Token = genToken(Employee.email);
});

router.get("/:id", function (req, res, next) {
  // Validate
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup
        .string()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      const id = req.params.id;

      let found = await Employee.findById(id);

      if (found) {
        return res.send({ ok: true, result: found });
      }

      return res.send({ ok: false, message: "Object not found" });
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provider: "yup",
      });
    });
});

/////////////////////////////////////////////////////

router.post("/", (req, res, next) => {
  const validation = yup.object({
    body: yup.object({
      firstName: yup.string().required().max(5, "chuoi it nhat là 15"),
      lastName: yup.string().required(),
      phoneNumber: yup
        .string()
        .required()
        .matches(phoneRegExp, "Phone number is not valid"),
      address: yup.string().required(),
      email: yup.string().email(),
      birthDay: yup.string(),
      password: yup.string(),
    }),
  });
  validation //Sử dụng yup để xác minh đầu vào
    .validate({ body: req.body }, { abortEarly: false })
    .then(async () => {
      const data = req.body;
      const newItem = new Employee(data);
      let result = await newItem.save();

      res.send({ message: "push!", result });
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provider: "yup",
      });
    });
});
///////////Delete///////////////
router.delete("/:id", (req, res, next) => {
  const validateSchema = yup.object().shape({
    params: yup.object({
      id: yup
        .string()
        .required()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  });
  validateSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      try {
        const id = req.params.id;
        let found = await Employee.findByIdAndDelete(id);

        if (found) {
          return res.send({ ok: true, result: found });
        }
        return res.status(410).send({ ok: false, message: "Object not found" });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provider: "yup",
      });
    });
});

router.patch("/:id", function (req, res, next) {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup
        .string()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      try {
        const id = req.params.id;
        const patchData = req.body;
        let found = await Employee.findByIdAndUpdate(id, patchData);

        res.send({ ok: true, message: "Updated", result: found });
      } catch (error) {
        res.status(500).send({ ok: false, error });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provider: "yup",
      });
    });
});

module.exports = router;
