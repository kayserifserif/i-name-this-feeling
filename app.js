var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var indexRouter = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.use("/", indexRouter);

module.exports = app;
