require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const { logEvents, logger } = require("./middleware/logEvents");
const { errorHandler } = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const { corsOptions } = require("./config/corsOptions");
const connectDB = require("./config/dbConn");

const cookieParser = require("cookie-parser");
const credientials = require("./middleware/credientials");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;

// connect to mongodb
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credientials check - before CORS!
// and fetch cookies credientials requirment
app.use(credientials);
// Cross origin resource sharing
// app.use(cors()); we don`t use it as that

app.use(cors(corsOptions));
// built in middleware to handle urlencoded from data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
// app.use(express.static(path.join(__dirname, "/public")));
// ===
app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use(verifyJWT);

app.use("/employees", require("./routes/api/employees"));
app.use("/users", require("./routes/api/users"));

// app.use('/')
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not found" });
  } else {
    res.type("txt").send("404 Not found");
  }
});

// handling error using express
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connect to mongodb");
  app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
});
