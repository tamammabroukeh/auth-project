// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
// const fsPromises = require("fs").promises;
// const path = require("path");
const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  // check for duplicate usernames in the db
  // const duplicate = usersDB.users.find((person) => person.username === user);
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //create and store the new user
    // const newUser = {
    //   username: user,
    //   password: hashedPwd,
    //   roles: { User: 2001 },
    // };
    // usersDB.setUsers([...usersDB.users, newUser]);
    // await fsPromises.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"),
    //   JSON.stringify(usersDB.users)
    // );
    // console.log(usersDB.users);
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });
    console.log(result);
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
