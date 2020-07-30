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
      const value = htmlText.match(/\<ol class="swipe-h">([\s\S]*?)<\/ol>/gi);
      var matches = [];
      const h2Tags = value[0].match(/\<h2 class="title">([\s\S]*?)<\/h2>/gi);

      let anchorArray = [];
      for (let i = 0; i < h2Tags.length; i++) {
        anchorArray.push(h2Tags[i].match(/\<a href=(.*?)[^>]*>(.*)?<\/a>/g)[0]);
      }

      var ansArray = [];
      for (let i = 0; i < anchorArray.length; i++) {
        var regex = /\href=(.*)\/>/g;
        var matched = regex.exec(anchorArray[i])[1];
        var regex1 = />(.*)</g;
        var matched1 = regex1.exec(anchorArray[i])[1];
        ansArray.push({
          link: "https://time.com" + matched,
          title: matched1,
        });
      }
      for (let i = 0; i < ansArray.length; i++) {
        ansArray[i].title.replace(/(?:\r\n|\r|\n)/g, "");
        ansArray[i].link.replace(/(?:\r\n|\r|\n)/g, "");
      }
      console.log(ansArray);

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
