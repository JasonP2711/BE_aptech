const yup = require("yup");
const express = require("express");
const router = express.Router();
const { Product, Category } = require("../../models");
const ObjectId = require("mongodb").ObjectId;
const {
  validateSchema,
  getProductsSchema,
} = require("../../validation/Product");

// Methods: POST / PATCH / GET / DELETE / PUT

// ------------------------------------------------------------------------------------------------
// Get all
router.get("/", async (req, res, next) => {
  try {
    let results = await Product.find()
      .lean({ virtuals: true })
      .populate("category")
      .populate("supplier");
    // console.log("results: ", results);
    res.send(results);
    //lưu ý: ta gửi đi một response như này: res.send(results); thì sẽ gửi đi một mảng, phù hợp sử dụng get ở axios
    //nếu ta gưir res.send({ok: true, payload: results}); sẽ trả về một object-> axios get sẽ báo lỗi
  } catch (error) {
    res.status(500).json({ ok: false, error });
    console.log(error);
  }
});
///////////////////////////////////////////////

router.get("/", async (req, res, next) => {
  console.log("hkhkj");
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
      const { category } = req.query;
      console.log("category: ", category);
      let found = await Category.findById(category);
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

// router.get("query", async (req, res, next) => {
//   try {
//     const { query } = req.query;
//     const response = await Product.find(query, { limit: 5 });
//     if (!response) {
//       return res.status(400).send({ ok: false });
//     }
//     res.send(response);
//   } catch {}
// });

//////////////

/////////////////////////////////////////////////////////

router.get(
  "/listProduct",
  validateSchema(getProductsSchema),
  async (req, res, next) => {
    try {
      const {
        productItems,
        supplier,
        category,
        maxPrice,
        minPrice,
        maxStock,
        minStock,
        maxDiscount,
        minDiscount,
        // skip,
      } = req.query;
      // console.log(productItems);
      const conditionFind = {};

      if (category) conditionFind.categoryId = new ObjectId(category);
      if (supplier) conditionFind.supplierId = new ObjectId(supplier);
      if (productItems) {
        conditionFind.name = new RegExp(`${productItems}`);
      }

      if (minPrice && maxPrice) {
        conditionFind.price = {
          $gte: Number(minPrice),
          $lte: Number(maxPrice),
        };
      } else if (minPrice) {
        conditionFind.price = {
          $gte: Number(minPrice),
        };
      } else if (maxPrice) {
        conditionFind.price = {
          $lte: Number(maxPrice),
        };
      }

      if (minStock && maxStock) {
        conditionFind.stock = {
          $gte: Number(minStock),
          $lte: Number(maxStock),
        };
      } else if (minStock) {
        conditionFind.stock = {
          $gte: Number(minStock),
        };
      } else if (maxStock) {
        conditionFind.maxStock = {
          $lte: Number(maxStock),
        };
      }

      if (maxDiscount && minDiscount) {
        conditionFind.discount = {
          $gte: Number(minDiscount),
          $lte: Number(maxDiscount),
        };
      } else if (minDiscount) {
        conditionFind.discount = {
          $gte: Number(minDiscount),
        };
      } else if (maxDiscount) {
        conditionFind.discount = {
          $lte: Number(maxDiscount),
        };
      }
      console.log(conditionFind);
      console.log(conditionFind.categoryId);
      let response = await Product.find(conditionFind)
        .limit(10)
        // .skip(skip)
        .populate("category")
        .populate("supplier");

      if (!response) res.sendStatus(400);

      res.json({ total: response.length, payload: response });
      // res.json(response);
    } catch {
      (error) => {
        console.log("««««« error »»»»»", error);
        res.status(500).json({ ok: false, error });
      };
    }
  }
);

////////////////////////////////////////////
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
      let found = await Product.findById(id);
      if (found) {
        return res.send(found);
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

// ------------------------------------------------------------------------------------------------
// Create new data
router.post("/", function (req, res, next) {
  // Validate
  const validationSchema = yup.object({
    body: yup.object({
      name: yup.string().required(),
      price: yup.number().positive().required(),
      discount: yup.number().positive().max(50).required(),
      description: yup.string().required(),
      categoryId: yup
        .string()
        .required()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          return ObjectId.isValid(value);
        }),
      supplierId: yup
        .string()
        .required()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(async () => {
      const data = req.body;
      let newItem = new Product(data);
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

// ------------------------------------------------------------------------------------------------
// Delete data
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
        let found = await Product.findByIdAndDelete(id);

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
        let found = await Product.findByIdAndUpdate(id, patchData);

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
