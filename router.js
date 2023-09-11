const express = require("express");
const router = express.Router();
const user = require("./database");
const bcrypt = require("bcryptjs");
const auth = require("./authorization");
const cookieparser = require("cookie-parser");

// This is landing page
router.get("/", (req, res) => {
  res.render("index");
});

//login page using navbar
router.get("/loginn", (req, res) => {
  res.render("login");
});

// logout API
router.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    res.cookie("jwt");
    await req.user.save();
    res.send("login");
  } catch (error) {
    res.status(500).send(error);
  }
});
// user can access this page only if he is logedin
router.get("/auth", auth, (req, res) => {
  res.render("auth");
});

// Registeration API

router.post("/register", async (req, res) => {
  try {
    const data = new user(req.body);
    // authentication using password
    if (data.password == data.confpassword) {
      const emailvalidation = await user.findOne({ email: data.email });
      if (emailvalidation) {
        res.send("This email already exist please login");
      }
      const token = await data.generateToken();
      console.log(` this token is ${token}`);
      // storing data in cookies
      res.cookie("jwt", token);

      const saveData = await data.save();
      res.render("login");
    } else {
      res.status(400).send("please enter same password");
    }
  } catch (error) {
    res.status(500).send = error;
  }
});
// login API
router.post("/login", async (req, res) => {
  try {
    const userpassword = req.body.password;
    const checkemail = req.body.email;
    // console.log(checkemail);
    const dbdata = await user.findOne({ email: checkemail });
    // console.log(dbdata);
    const ismatch = await bcrypt.compare(userpassword, dbdata.password);
    if (ismatch) {
      const token = await dbdata.generateToken();
      res.cookie("jwt", token);
      res.render("contact");
    } else {
      res.status(400).send("please enter valid details");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;
