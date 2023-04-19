const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    return next();
  } catch {
    (err) => {
      return res.status(400).json({ message: err.message, type: err.name });
    };
  }
};

const loginSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(1).max(31),
  }),
  params: yup.object({}),
});

module.exports = {
  validateSchema,
  loginSchema,
  // categorySchema,
};
