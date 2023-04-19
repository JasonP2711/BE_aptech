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
  } catch {
    (err) => {
      res.status(400).send({ message: err.message });
    };
  }
};

const categorySchema = yup.object({
  body: yup.object({
    name: yup.string().required(),
    description: yup.string().required(),
  }),
  params: yup.object({}),
});

module.exports = {
  validateSchema,
  categorySchema,
};
