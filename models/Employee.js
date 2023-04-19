const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const EmployeeSchema = new Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    phoneNumber: {
      type: String,
      require: true,
      validator: function (value) {
        const phoneRegex =
          /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
        return phoneRegex.text(value);
      },
    },
    email: {
      type: String,
      require: true,
      validator: function (value) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      },
    },
    address: { type: String, require: true },
    birthDay: { type: Date, require: true },
    password: { type: String },
  },
  {
    versionKey: false,
  }
);
const Employee = model("Employee", EmployeeSchema);

module.exports = Employee;
