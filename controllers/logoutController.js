const User = require("../model/User");
const handleLogout = async (req, res) => {
  // on client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  const refreshToken = cookies.jwt;
  // Is refreshToken in db ?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(403);
  }
  // delete refreshToken from db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshtoken
  );
  const result = await foundUser.save();
  console.log(result);
  // secure : true - only serves on https
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    // secure: true,
  });
  res.sendStatus(204);
};

module.exports = { handleLogout };
