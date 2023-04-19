const express = require("express");
const router = express.Router();
const yup = require("yup");

const { Customer } = require("../../models");
const ObjectId = require("mongodb").ObjectId;
const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

// Methods: POST / PATCH / GET / DELETE / PUT
//các bước để thao tác dữ liệu với mongodb bằng mongoose:
//B1: kết nối đến mongodb bằng mongoose
//B2: Tạo một schema để validate cho dữ liêu:
//B3: Tạo một API để xử lý các yêu cầu đẩy dữ liệu lên MongoDB
//B4: Thao tác(gửi yêu cầu ) đến API để làm việc với mongodb(sử dụng axios)(bên phần react)

//Tạo một API để xử lý các yêu cầu đẩy dữ liệu lên MongoDB
router.get("/", async (req, res, next) => {
  //chúng ta sử dụng await để đợi kết quả trả về từ các hàm có thể trả về Promise như MyDataModel.find() và MyDataSchema.validate().
  // Sử dụng await giúp đảm bảo rằng chúng ta không tiếp tục thực thi mã cho đến khi Promise đã được giải quyết.
  try {
    let results = await Customer.find();
    res.send(results);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/:id", async function (req, res, next) {
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

      let found = await Customer.findById(id);

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

router.post("/", (req, res, next) => {
  const validation = yup.object({
    body: yup.object({
      FirstName: yup.string().required().max(5, "chuoi it nhat là 15"),
      LastName: yup.string().required(),
      PhoneNumber: yup
        .string()
        .required()
        .matches(phoneRegExp, "Phone number is not valid"),
      Address: yup.string().required(),
      Email: yup.string().email(),
      Birthday: yup.string(),
    }),
  });
  validation //Sử dụng yup để xác minh đầu vào
    .validate({ body: req.body }, { abortEarly: false })
    .then(async () => {
      const data = req.body;
      const newItem = new Customer(data);
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
        let found = await Customer.findByIdAndDelete(id);

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
        let found = await Customer.findByIdAndUpdate(id, patchData);

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
