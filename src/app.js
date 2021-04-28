require("dotenv").config();

const express = require("express");
const path = require("path");
const apiRouter = require("./apiRouter.js");
const app = express();

const port = process.env.PORT || 8080;

app.use(express.json());
app.use("/api", apiRouter);
app.use("/", express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
