const mongoose = require("mongoose");
const { Schema, model } = mongoose;
//Tạo một schema để validate cho dữ liêu:
// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html
const mediaSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, Request: true },
  },
  {
    versionKey: false,
  }
);

const Media = model("Media", mediaSchema);

module.exports = Media;
