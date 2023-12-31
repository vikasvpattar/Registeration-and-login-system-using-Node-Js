const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("connection is Successful");
  })
  .catch((err) => {
    console.log(err);
  });

// creating schema
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// creating functions for schema
schema.methods.generateToken = async function () {
  try {
    const tokenuser = jwt.sign({ _id: this._id.toString() }, process.env.KEY);
    this.tokens = this.tokens.concat({ token: tokenuser });
    await this.save();
    return tokenuser;
  } catch (error) {}
};

// this method will be called before creation of schema
schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    // this.confpassword =await bcrypt.hash(this.confpassword,10);
    // console.log(`${this.password}`);
  }
  next();
});

const usermodel = mongoose.model("userdetail", schema);

module.exports = usermodel;
