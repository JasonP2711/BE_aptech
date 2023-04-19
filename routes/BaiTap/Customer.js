var express = require("express");
var router = express.Router();
const yup = require("yup");
const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

// const data = [
//   { id: 1, name: "Peter", email: "peter@gmail.com", address: "USA" },
//   { id: 2, name: "John", email: "john@gmail.com", address: "ENGLAND" },
//   { id: 3, name: "Yamaha", email: "yamaha@gmail.com", address: "JAPAN" },
// ];

const { write } = require("../helper/FileHelper");
let data = require("../data/Customer.json");
const fileName = "./routes/data/Customer.json";

//Method: get-patch-post-delete-put

//get all:
router.get("/", function (req, res, next) {
  res.send(data);
});

router.get("/", (req, res, next) => {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.string,
    }),
  });
  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(() => {
      const id = req.params.id;
      let found = data.find((item) => item.id == id);
      if (found) {
        return res.send({ ok: true, result: found });
      }
      return res.send({ ok: false, result: notFound });
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

router.post("/", function (req, res, next) {
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
  validation
    .validate({ body: req.body }, { abortEarly: false })
    .then(() => {
      const newItem = req.body;
      // lấy id lớn nhất để gán cho phần tử vừa được tạo
      let max = 0;
      data.forEach((item) => {
        if (max < item.id) {
          max = item.id;
        }
      });
      newItem.id = max + 1;
      data.push(newItem);

      write(fileName, data);
      res.send({ ok: true, message: "create" });
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errows: err.errows,
        message: err.message,
        provider: "yup",
      });
    });
});

router.delete("/:id", function (req, res, next) {
  //Nhap Params o duong link co cu phap la :id
  const id = req.params.id;
  data = data.filter((item) => item.id != id);
  write(fileName, data);
  res.send({ ok: true, message: "Delete" });
});

router.patch("/:id", function (req, res, next) {
  const id = req.params.id;
  const patchData = req.body;
  let found = data.find((item) => item.id == id);
  if (found) {
    for (let propertiesName in patchData) {
      found[propertiesName] = patchData[propertiesName];
    }
  }
  write(fileName, data);
  res.send({ message: "update" });
});

module.exports = router;
