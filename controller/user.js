const express = require("express");
const User = require("./../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var validator = require("email-validator");

module.exports = {
  /**
   *@route POST /api/user/login:
   *@desc  used to login the user
   *@path_parameters
   *- email
   *	- required: true
   *	-	type: email
   *- password
   *	  -type: String
    
   *@responses '200': application/json
   */
  loginuser: function (req, res, next) {
    const { email, password } = req.body;

    User.findOne({ email }, async function (err, user) {
      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          res.setHeader("Content-Type", "application/json");
          let token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: "1h",
          });
          return res.status(200).json({
            user: {
              _id: user._id,
              email: user.email,
              name: user.profileName,
            },
            token,
          });
        } else {
          return res.status(400).json({
            msg: "Invalid credentials",
          });
        }
      } else {
        return res.status(301).json({ msg: "User not found" });
      }
    });
  },
  /**
   *@route POST /api/user/register:
   *@desc  used to register new user
   *@path_parameters
   *- username
   *	  -type: String
   *- email
   *	- required: true
   *	-	type: email
   *- password
   *	  -type: String
        - required: true
   *- confirmPassword
   *	  -type: String
        - required: true
    
   *@responses '201': application/json
                '400': application/json
   */
  registerUser: (req, res) => {
    try {
      const { username, email, password, confirmPassword } = req.body;

      if (!email || !password || !confirmPassword)
        return res
          .status(400)
          .json({ msg: "Not all fields have been entered." });
      if (password.length < 5)
        return res.status(400).json({
          msg: "The password needs to be at least 5 characters long.",
        });
      if (!validator.validate(email)) {
        return res.status(400).json({
          msg: "Email not valid",
        });
      }

      User.findOne({ email }, function (err, user) {
        if (user) {
          return res.status(400).json({ msg: "Email already exists" });
        } else {
          if (password === confirmPassword) {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, function (err, hash) {
              if (err) {
                return res.status(400).json({ msg: err.message });
              }
              const user = new User({
                profileName: username,
                password: hash,
                email,
              });
              user.save();
              res.setHeader("Content-Type", "application/json");
              return res.status(201).send("User successfully created");
            });
          } else {
            return res.status(400).json({ msg: "Passwords donot match" });
          }
        }
      });
    } catch (err) {
      if (err) return res.status(400).send({ msg: err.message });
    }
  },
  /**
   *@route POST /api/user/tokenIsValid:
   *@desc  Checks the validity of the token
   *@path_parameters
   *- token
   *	- required: true
 
   *@responses '200': application/json
   */
  tokenValid: async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);

      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      if (!verified) return res.json(false);

      const user = await User.findById(verified.id);
      if (!user) return res.json(false);

      return res.json(true);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  /**
   *@route GET /api/user/
   *@desc  Fetch the current user
   *@path_parameters
   *- token
   *	- required: true
 
   *@responses '200': application/json
   */
  getUser: async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
      _id: user._id,
      email: user.email,
      name: user.profileName,
    });
  },
};
