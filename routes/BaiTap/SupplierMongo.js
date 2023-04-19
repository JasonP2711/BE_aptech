const yup = require("yup");
const express = require("express");
const router = express.Router();
const { Supplier } = require("../../models");
const ObjectId = require("mongodb").ObjectId;

router.get("/", async (req, res, next) => {
  try {
    let results = await Supplier.find();
    res.send(results);
  } catch (err) {
    res.status(500).json({ ok: false, error });
  }
});

router.get("/:id", async (req, res, next) => {
  const validateSchema = yup.object().shape({
    params: yup.object({
      id: yup
        .string()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  });

  validateSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      id = req.params.id;
      let found = await Supplier.findById(id);
      if (found) {
        return res.send({ ok: true, result: found });
      } else {
        return res.send({ ok: false, message: "Object not found" });
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

router.post("/", function (req, res, next) {
  // Validate
  const validationSchema = yup.object({
    body: yup.object({
      name: yup.string().required(),
      email: yup.string().required().email(),
      phoneNumber: yup.string().required(),
      address: yup.string().required(),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(async () => {
      const data = req.body;
      let newItem = new Supplier(data);
      await newItem.save();
      res.send({ ok: true, message: "Created", result: newItem });
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

router.delete("/:id", function (req, res, next) {
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
        let found = await Supplier.findByIdAndDelete(id);

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
        let found = await Supplier.findByIdAndUpdate(id, patchData);

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
