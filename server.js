const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const request = require('request');

const mongoUrl = 'mongodb://freecodecamp:freecodecamp2017@ds137220.mlab.com:37220/url-shortener';
const port = process.env.port || 3000;
const customSearchEngineId = '007327006560220298017%3Ammjehodls2y';
const apiKey = 'AIzaSyAd3vg0X8pQQy-1Uzo0gWFeoubirvhC3eo';

const app = express();

app.get('/imagesearch/*', async (req, res) => {
  const searchTerm = decodeURIComponent(req.url.replace('/imagesearch/', ''));
  const offset = req.query.offset;
  var startIndex = 1;
  if (offset) {
    startIndex = offset * 10 - 9;
  }

  logSearchTerm(searchTerm);

  const results = await getImageResults(searchTerm, startIndex);

  res.end(JSON.stringify(results, null, 2));
});

app.get('/latest', async (req, res) => {
  
});

const getImageResults = (searchTerm, startIndex) => {
  return new Promise((resolve, reject) => {
    const searchRequestUrl = `https://www.googleapis.com/customsearch/v1?q=${searchTerm}&start=${startIndex}&cx=${customSearchEngineId}&key=${apiKey}&searchType=image`;
    request(searchRequestUrl, (error, response, body) => {
      if (error) {
        reject(error);
      };
      const results = JSON.parse(body).items;
      var parsedResults = [];

      results.forEach((result) => {
        parsedResults.push({
          image_url: result.link,
          alt_text: result.snippet,
          page_url: result.image.contextLink
        });
      });

      resolve(parsedResults);
    });
  });
}

const logSearchTerm = async (searchTerm) => {
  const db = await MongoClient.connect(mongoUrl);
  db.collection("searchTerms").insertOne({
    dateOfQuery: new Date().getTime(),
    searchTerm
  }).catch((err) => { throw err; });
  db.close();
}

app.listen(port);
console.log(`Server is listening on port ${port}`);