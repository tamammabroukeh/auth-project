const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const http = require("http");

const logEvents = require("./logEvents").logEvents;
const EventEmitter = require("events");

class Emitter extends EventEmitter {}

// initialize object
const myEmitter = new Emitter();

myEmitter.on("logs", (msg, fileName) => {
  logEvents(msg, fileName);
});
const PORT = process.env.PORT | 3500;

const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes("image") ? "utf8" : ""
    );
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.error(err);
    myEmitter.emit("logs", `${err.name}: ${err.message}`, "errLog.txt");
    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  myEmitter.emit("logs", `${req.url}\t${req.method}`, "reqLog.txt");
  // console.log(req.url);
  let filePath;
  const extension = path.extname(req.url);
  console.log(extension);
  let contentType;
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/palin";
      break;
    default:
      contentType = "text/html";
  }
  // console.log(req.url.slice(-1));
  filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  // makes .html extension not required in the browser
  if (!extension && req.url.slice(-1) === "/") filePath += ".html";

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    // serve the file
    serveFile(filePath, contentType, res);
  } else {
    // 4O4
    // 3O1
    // console.log(path.parse(filePath));
    switch (path.parse(filePath).base) {
      case "old-page.html":
        res.writeHead(301, { location: "/new-page.html" });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, { location: "/" });
        res.end();
        break;
      default:
        // serve a 4O4 response
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
  // not dynamic
  // switch (req.url) {
  //   case "/":
  //     res.statusCode = 200;
  //     res.setHeader("Content-Type", "text/html");
  //     filePath = path.join(__dirname, "views", "index.html");
  //     fs.readFile(filePath, "utf8", (err, data) => {
  //       res.end(data);
  //     });
  //     break;
  // }

  // if (req.url === "/" || req.url === "index.html") {
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "text/html");
  //   filePath = path.join(__dirname, "views", "index.html");
  //   fs.readFile(filePath, "utf8", (err, data) => {
  //     res.end(data);
  //   });
  // }
});

server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

// // add listener for the log event
// myEmitter.on("logs", (msg) => {
//   logEvents(msg);
// });

// // emit event
// myEmitter.emit("logs", "Logs event emitted!");
