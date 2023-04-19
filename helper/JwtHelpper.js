const JWT = require("jsonwebtoken");
const JwtSetting = require("../constants/JwtSetting");

const encodeToken = (userId, email, firstName, lastName) =>
  JWT.sign(
    //Hàm sigh nhận vào payload: khối dữ liệu, scretOfPrivateKey và 1 cái option(callback)
    {
      /////////////////////////////////////////////////////////
      iat: new Date().getTime(), //Ngayf Token đưuọc tạo, mã hóa theo kiểu khác, không phải theo kiểu date time Iso
      exp: new Date().setDate(new Date().getDate() + 1), //Ngày mà toke hết thời hạn,(ví dụ ta đăng nhập vào web nào đó trong hôm nay nhưng ngày mai vào lại thì nó bắt đăng nhập lại mật khẩu vì token vẫn còn nhưng hết hạn sử dụng)
      audience: JwtSetting.AUDIENCE,
      issuer: JwtSetting.ISSUER,
      //2 cái này là dữ liệu từ JwtSetting
      _id: userId,
      email: email,
      fullName: firstName + "-" + lastName,
      custom: "xxxxxxxxxxxxxxxx",
      algorithm: "HS512",
      //////////////////////////////////////////đây là một khối dữ liêu đưa vào hàm sign(payload)
    },
    // JwtSetting.SECRET ///đây là secretOfPrivateKey
    "DAYLACHUOISCRETKEY"
  );

module.exports = encodeToken;
