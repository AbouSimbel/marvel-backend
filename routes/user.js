const express = require("express");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const User = require("../models/User");
const router = express.Router();

//Route sign-up :
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password } = req.fields;

    const user = await User.findOne({ email });

    if (user)
      return res.status(409).json({ message : "Cet email est dejà utilisé"});

    if (!(/^[a-zA-Z0-9]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/.test(email)))
      return res.status(400).json({ message : "Vous avec entré un email invalide" });

    if (!username)
      return res.status(400).json({ message: "Vous n'avez pas saisi de username"});

    if (!password || password.length <= 4)
      return res.status(400).json({ message : "Vous avec entré un mdp invalide" });

    const salt = uid2(64);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(64);

  const newUser = await new User({
    email,
    username,
    token,
    hash,
    salt
  }).save()

    return res.status(200).json({
      "-id": newUser.id,
      "username": newUser.username,
      "token": newUser.token,
    })

  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message })
  }
});


//Route LOGIN :
router.post("/login", async (req, res) => {

  const { email, password } = req.fields;

  const user = await User.findOne({ email });

  if (user) {
    if (user.hash === SHA256(password + user.salt).toString(encBase64)) {
      return res.json({
        username: user.username,
        token:user.token
      });
    } else {
      return res.json({ message: "Login et/ou mot de passe erroné" });
    }
  } else {
    return res.json({ message: "Login et/ou mot de passe erroné" });
  }
  })


module.exports = router;