var express = require("express");
var router = express.Router();
const yup = require("yup");

const { write } = require("../helper/FileHelper");
let data = require("../data/Categories.json");
const fileName = "./routes/data/Categories.json";

router.get("/", (req, res, next) => {
  res.send(data);
});

router.get("/", (req, res, next) => {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.string,
    }),
  });
  validationSchema
    .validate({ params: req.params }, { abortEarly: false }) //Executor function gồm 2 tham số là resolve và reject được xem như function. Executor sẽ:
    //Thực hiện một số lệnh, thường có một lệnh bất đồng bộ và Gọi resolve() để báo kết quả thành công, gọi reject để báo thất bại
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

router.post("/", (req, res, next) => {
  const validationSchema = yup.object({
    //thiết lập validation yup cho các properties trong object cần submit
    body: yup.object({
      //Yup là một thư viện validation đơn giản và mạnh mẽ trong Node.js.
      name: yup.string().required(), //Nó cung cấp một cách tiện lợi để xác minh đầu vào của bạn, đảm bảo rằng dữ liệu bạn đang xử lý là đúng và an toàn.
      description: yup.string().required(),
    }),
  });

  validationSchema //Sử dụng yup để xác minh đầu vào
    .validate({ body: req.body }, { abortEarly: false })
    .then(() => {
      const newItem = req.body;
      let id = 0;
      data.forEach((item) => {
        if (item.id > id) {
          id = item.id;
        }
      });
      newItem.id = id + 1;
      data.push(newItem);

      write(fileName, data);

      res.send({ message: "push!" });
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

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  data = data.filter((x) => x.id != id);
  write(fileName, data);
  res.send({ message: "delete" });
});

router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const content = req.body;
  let found = data.find((item) => item.id == id);
  if (found) {
    for (let item in content) {
      found[item] = content[item];
    }
  }

  write(fileName, data);
  res.send({ message: "patch" });
});

module.exports = router;
