const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");
const fsPromisses = require("fs").promises;
const logEvents = async (message, fileName) => {
  const dateTime = format(new Date(), "yyyy/MM/dd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromisses.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromisses.appendFile(
      path.join(__dirname, "..", "logs", fileName),
      logItem
    );
  } catch (error) {
    console.error(error);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
};
module.exports = { logEvents, logger };
// console.log(format(new Date(), "yyyy/MM/dd\tHH:mm:ss"));
