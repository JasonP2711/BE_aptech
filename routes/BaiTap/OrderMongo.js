const yup = require("yup");
const express = require("express");
const router = express.Router();
const { Order } = require("../../models");
const ObjectId = require("mongodb").ObjectId;

router.get("/", async (req, res, next) => {
  try {
    let result = await Order.find()
      .populate("order")
      .populate("employeeSell")
      .lean({ virtuals: true });
    res.send({ ok: true, result: result });
  } catch {
    res.sendStatus(500);
    500;
  }
});

router.get("/:id", (req, res, next) => {
  const validateSchema = yup.object().shape({
    params: yup.object({
      id: yup
        .string()
        .test(
          "validate objectId",
          "${patch} is not valid objectId",
          (value) => {
            return ObjectId.isValid(value);
          }
        ),
    }),
  });
  validateSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      try {
        const id = req.params.id;
        const result = await Order.findById(id);
        if (result) {
          return res.send({ ok: true, result: result });
        }
        return res.sendStatus(410);
      } catch (err) {
        return res.sendStatus(500).json(err);
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

router.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const newItem = new Order(data);
    let result = await newItem.save();

    return res.send({ ok: true, message: "Created", result });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

module.exports = router;
