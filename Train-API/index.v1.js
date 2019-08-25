//This simple API is bassed off of a toutorial by @amruthpillai found here:
//https://medium.com/@amruthpillai/how-to-build-a-restful-api-that-scrapes-the-web-c6b8ea34ca77


//pull in the needed packages
const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

//boilerplate code to set up the server
app.get('/', function(req, res){
	//this is where you define the API endpoints
	let date = req.query.date;
	let sign = req.query.sign;
	
	let url = 'https://www.astrology.com/horoscope/daily/' + date + '/' + sign + '.html';

	//the request call takes a URL and a callback function as paramaters
	//the callback function takes 3 parameters: 
		//an error
		//the response status code
		//the html that's returned
	request(url, function(error, response, html){
		//first check for any errors
		if(!error){
			//if no error, use Cheerio on the returned HTML is allow use of jQuery
			var $ = cheerio.load(html);
			
			var prediction = $('div.daily-horoscope > p').text();
			
			var json = {
				date: date,
				sign: sign,
				prediction: prediction,
				response: response.statusCode
			}
				
			//var testson = 'Hello world';
			//res.send(testson);
			
			res.send(json);
		}
	});
});

app.listen('8080');
console.log('API is running on http://localhost:8080');

module.exports = app;