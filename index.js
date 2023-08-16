require('dotenv').config()
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use('/uploads', express.static('uploads'))
//Get cafe and employee routes
const cafeRouter = require("./routes/cafe");
const employeeRouter = require("./routes/employee");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  // console.log(req.method, req.path, "-", req.ip);
  next();
});
/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
//Setup cafe and employee routes
app.use(["/cafes", "/cafe"], cafeRouter);
app.use(["/employees", "/employee"], employeeRouter);
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});
app.listen(port, () => {
  console.log(`Cafe Employee Management app listening at http://localhost:${port}`);
});
