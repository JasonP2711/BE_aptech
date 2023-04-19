const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const getProductsSchema = yup.object({
  query: yup.object({
    category: yup
      .string()
      .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
        if (!value) return true;
        return ObjectId.isValid(value);
      }),
    supplier: yup
      .string()
      .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
        if (!value) return true;
        return ObjectId.isValid(value);
      }),
    productItems: yup.string(),
    // minPrice: yup.number().min(0),
    // maxPrice: yup.number(),
    // minStock: yup.number().min(0),
    // maxStock: yup.number(),
    skip: yup.number(),
    limit: yup.number(),
  }),
});

module.exports = {
  validateSchema,
  getProductsSchema,
};
