const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const port = 8000;

//to enable cross origin
app.use(cors());
let htmlText = "";

app.get("/getTimeStories", function (req, res) {
  //fetching the html page from Time.com
  fetch("https://time.com")
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      return text;
    })
    .then(function (data) {
      htmlText = data;
      return cheerio.load(data);
    })
    .then(function (data) {
      const $ = data;
      let ansArray = [];
      //getting the a tag in the page with latest stories
      //extracting the required data
      const value = $(".latest>ol>li>.slide>.content>.title>a");
      for (let i = 0; i < value.length; i++) {
        ansArray.push({
          title: value[i].children[0].data,
          link: "https://time.com" + value[i].attribs.href,
        });
      }
      JSON.stringify(ansArray);
      return res.json(ansArray);
    });
});

//running the server
app.listen(port, function (err) {
  if (err) {
    console.log("Error in running the server");
    return;
  }
  console.log("Successfully connected to the server");
});
