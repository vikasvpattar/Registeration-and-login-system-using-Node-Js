const express = require("express");
const port = 3000;
const app = express();
const router = require("./router");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(router);
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
