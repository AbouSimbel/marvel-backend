const express = require("express");
const router = express.Router();
const md5 = require("md5");
const axios = require("axios");

//All calls to the Marvel Comics API must pass your public key via an “apikey” parameter.
const marvel_api_private_key = process.env.PRIVATE_KEY
const apikey = process.env.PUBLIC_KEY

//Page comics : liste tous les comics par ordre alphabetique sous forme de fiche (photo, titre, description) :
router.get("/comics", async (req, res) => {

  const page = req.query.page;
  console.log(page);
  try{
    const offset = Number(page*100-100);
    const date = new Date();
    const ts = date.getTime() / 1000;

    const hash = md5(ts + marvel_api_private_key + apikey);

    const response = await axios.get(`https://gateway.marvel.com:443/v1/public/comics?limit=100&ts=${ts}&apikey=${apikey}&hash=${hash}&offset=${offset}&orderBy=title`);
    res.json(response.data)
  } catch (error) {
    res.status(400).json(`an error occured ${error.message}`)
  }
});

module.exports = router;