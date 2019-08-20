//This simple API is bassed off of a toutorial by @amruthpillai found here:
//https://medium.com/@amruthpillai/how-to-build-a-restful-api-that-scrapes-the-web-c6b8ea34ca77

//Some nice Cheerio examples here:
//http://zetcode.com/javascript/cheerio/


//pull in the needed packages
const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

//boilerplate code to set up the server
app.get('/', function(req, res){
	//this is where you define the API endpoints
	//let station = req.query.station;
		
	let url = 'http://dv.njtransit.com/webdisplay/tid-mobile.aspx?sid=HI'

	//the request call takes a URL and a callback function as paramaters
	//the callback function takes 3 parameters: 
		//an error
		//the response status code
		//the html that's returned
	request(url, function(error, response, html){
		//first check for any errors
		if(!error){
			//if no error, use Cheerio on the returned HTML as if with jQuery
			var $ = cheerio.load(html);
	
			let trainDestination = $('#GridView1 > tbody > tr:nth-child(4) > td:nth-child(2)')[0];
	
//			let trainDestination = $('#GridView1 > tbody > tr:nth-child(4) > td:nth-child(2)')[0].children[0].data;
//			let trainTrack = $('#GridView1 > tbody > tr:nth-child(4) > td:nth-child(3)')[0].children[0].data;
//			let trainLine = $('#GridView1 > tbody > tr:nth-child(4) > td:nth-child(4)')[0].children[0].data;
//			let departureTime = $('#GridView1 > tbody > tr:nth-child(4) > td:nth-child(1)')[0].children[0].data;
			
			var json = {
				url: url,
				Destination: trainDestination,
//				Track: trainTrack,
//				Line: trainLine,
//				Time: departureTime,
				response: response.statusCode,
				full_response: response
			}
				
		
			res.send(json);
		}
	});
});

app.listen('8080');
console.log('API is running on http://localhost:8080');

module.exports = app;