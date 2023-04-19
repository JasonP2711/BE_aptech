const mongoose = require("mongoose");
const { Schema, model } = mongoose;
//Tạo một schema để validate cho dữ liêu:
// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

//Tại sao ta phải validate ở phía DB trong khi ta đã sử dụng yup để validate phần form rồi:((
//Là tại vì: thứ nhất đó là vấn đề về bảo mật nhiều lớp, nếu hacker muốn vượt qua validate ở phía UI rồi thì
// phải vượt qua phần validate ở API DB nữa(nhiều lớp sẽ tốt hơn 1 lớp).
// thứ 2 tui quên mất rồi, để tìm hiểu lại:)))
const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
  },
  {
    versionKey: false,
  }
);

const Category = model("Category", categorySchema);

module.exports = Category;
