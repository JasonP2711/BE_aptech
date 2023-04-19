const mongoose = require("mongoose");
const { Schema, model } = mongoose;
//Tạo một schema để validate cho dữ liêu:
// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html
const customerSchema = new Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Email: {
      type: String,
      validate: {
        validator: function (value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: `{VALUE} is not a valid email!`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
      required: true,
    },
    PhoneNumber: {
      type: String,
      validate: {
        validator: function (value) {
          const phoneRegex =
            /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        },
        message: `{VALUE} is not a valid phone!`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
    },
    Address: { type: String, required: true },
    Birthday: { type: Date },
  },
  {
    versionKey: false,
  }
);

const Customer = model("Customer", customerSchema);

module.exports = Customer;
