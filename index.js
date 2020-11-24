const express = require("express");
const formidable = require("express-formidable")
const axios = require("axios");
const cors = require("cors");
const md5 = require("md5");
const mongoose  = require("mongoose");

const app = express();
app.use(cors());
app.use(formidable());

require("dotenv").config();

//Create DATABASE and connect :
mongoose.connect(process.env.MOGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const userRoutes = require("./routes/user.js");
const characterRoutes = require("./routes/characters");
const comicsRoutes = require("./routes/comics");
app.use(userRoutes);
app.use(characterRoutes);
app.use(comicsRoutes);

app.all("*", (req, res) => {
  res.status(404).json("Cette route n'existe pas");
})

app.listen(process.env.PORT, () => {
  console.log("Server started");
})