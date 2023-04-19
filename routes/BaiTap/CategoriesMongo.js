const express = require("express");
const router = express.Router();
const yup = require("yup");

const { validateSchema, categorySchema } = require("../../validation/Category");
const { Category } = require("../../models");
const ObjectId = require("mongodb").ObjectId;

// Methods: POST / PATCH / GET / DELETE / PUT
//các bước để thao tác dữ liệu với mongodb bằng mongoose:
//B1: kết nối đến mongodb bằng mongoose
//B2: Tạo một schema để validate cho dữ liêu:
//B3: Tạo một API để xử lý các yêu cầu đẩy dữ liệu lên MongoDB
//B4: Thao tác(gửi yêu cầu ) đến API để làm việc với mongodb(sử dụng axios)

//Tạo một API để xử lý các yêu cầu đẩy dữ liệu lên MongoDB
router.get("/", async (req, res, next) => {
  //chúng ta sử dụng await để đợi kết quả trả về từ các hàm có thể trả về Promise như MyDataModel.find() và MyDataSchema.validate().
  // Sử dụng await giúp đảm bảo rằng chúng ta không tiếp tục thực thi mã cho đến khi Promise đã được giải quyết.
  try {
    let results = await Category.find();
    res.send(results);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
  //Ta có thể sử dụng như đoạn code ở dưới để lấy dữ liệu từ mongodb nhưng việc các dòng code này được bọc lại trong try catch
  //giúp ta có thể dễ dàng bắt lỗi hơn trong quá trình lấy và xác thực dữ liệu. Bất cứ khi nào một Promise bị reject, nó sẽ ném
  //ra một exception. Bằng cách bao bọc các đoạn mã đồng bộ trong try-catch, chúng ta có thể bắt lỗi này và xử lý nó một cách đúng đắn, ví dụ như trả về một phản hồi lỗi cho khách hàng.
  // let results = await Category.find();
  // res.send(results);
});

////////////////////////////////////////////////////////////////////

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

      let found = await Category.findById(id);

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
////////////////////////////////////////////////////////////////////////////////////////////////
//Thay vì validate yup bên trong promise thì ta sẽ import từ mục validation vòa
//C1: Dùng bên trong promise
// router.post("/", (req, res, next) => {
//   const validationSchema = yup.object({
//     //thiết lập validation yup cho các properties trong object cần submit
//     body: yup.object({
//       //Yup là một thư viện validation đơn giản và mạnh mẽ trong Node.js.
//       name: yup.string().required(), //Nó cung cấp một cách tiện lợi để xác minh đầu vào của bạn, đảm bảo rằng dữ liệu bạn đang xử lý là đúng và an toàn.
//       description: yup.string().required(),
//     }),
//   });

//   validationSchema //Sử dụng yup để xác minh đầu vào
//     .validate({ body: req.body }, { abortEarly: false })
//     .then(() => {
//       const data = req.body;
//       const newItem = new Category(data);
//       let result = newItem.save();

//       res.send({ message: "push!", result });
//     })
//     .catch((err) => {
//       return res.status(400).json({
//         type: err.name,
//         errors: err.errors,
//         message: err.message,
//         provider: "yup",
//       });
//     });
// });

//Cách 2: import vào:

router.post("/", validateSchema(categorySchema), (req, res, next) => {
  try {
    const data = req.body;
    const newItem = new Category(data);
    let result = newItem.save();
    res.send({ message: true, result });
  } catch {
    (err) => {
      res.status(500).send({ message: err.name });
    };
  }
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
        let found = await Category.findByIdAndDelete(id);

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

///////////////////Chưa hiểu tại sao lại dùng thêm async await trong promises then().///////////////

// router.delete("/:id", (req, res, next) => {
//   const validationSchema = yup.object().shape({
//     params: yup.object({
//       id: yup
//         .string()
//         .required()
//         .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
//           return ObjectId.isValid(value);
//         }),
//     }),
//   });
//   validationSchema
//     .validate({ params: req.params }, { abourEarly: false })
//     .then(() => {
//       const id = req.prams.id;
//       let found = Category.findByIdAndRemove(id).then(()=>{

//       })
//       if (found) {
//         return res.send({ ok: true, result: found });
//       }
//       return res.status(401).send({ ok: false, message: "object not found" });
//     })
//     .catch((err) => {
//       return res.status(400).json({
//         type: err.name,
//         errors: err.errors,
//         message: err.message,
//         provider: "yup",
//       });
//     });
// });

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
        let found = await Category.findByIdAndUpdate(id, patchData);

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
