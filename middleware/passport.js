const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const JwtSetting = require("../constants/JwtSetting");
const { Employee } = require("../models");
// dùng ở hàm /login để kiểm tra token đc gửi lên
const passportConfig = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"), // cho biết ta lấy token ở đây để xử lý
    secretOrKey: "DAYLACHUOISCRETKEY", //cấp scretKey để nó đối chiếu với token lấy lên
  },
  async (payload, done) => {
    try {
      console.log("payload", payload);
      const user = await Employee.findById(payload._id);

      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

module.exports = passportConfig;
