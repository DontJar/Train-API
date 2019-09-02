//This simple API is bassed off of a toutorial by @amruthpillai found here:
//https://medium.com/@amruthpillai/how-to-build-a-restful-api-that-scrapes-the-web-c6b8ea34ca77

//Some nice Cheerio examples here:
//http://zetcode.com/javascript/cheerio/


//pull in the needed packages
const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const puppeteer = require('puppeteer');

//boilerplate code to set up the server
app.get('/', function(req, res){
	//this is where you define the API endpoints
	//let station = req.query.station;
		
	let url = 'https://dv.njtransit.com/webdisplay/tid-mobile.aspx?sid=HI'
	// let url = 'https://dv.njtransit.com/webdisplay/train_stops.aspx?train=0657'

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

let getAllTrains = function () {
	(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const url = 'https://dv.njtransit.com/webdisplay/tid-mobile.aspx?sid=HI'
	await page.goto(url);
//	await page.screenshot({path: 'example.png'});
	
	const textContent = await page.evaluate(
	() => Array.from(document.querySelectorAll('#GridView1 > tbody > tr')).map(eachTr => ({eachTr}).eachTr.innerText)
);
/*	const innerText = await page.evaluate(
	() => document.querySelector('#GridView1 > tbody > tr:nth-child(1) > td > div:nth-child(1)').innerText
);
	const innerHTML = await page.evaluate(
	() => document.querySelector('#GridView1 > tbody > tr:nth-child(1) > td > div:nth-child(1)').innerHTML
);
*/
	let stationTitle = textContent[0].substring(0, textContent[0].indexOf("Departures") + "Departures".length)
	let justDepartures = textContent.slice(2)
	
	console.log(`The following is a list of ${stationTitle}:`)
	console.log(justDepartures)
	
	
//	console.log(textContent);
	
/*	console.log(innerText);
	console.log(innerHTML);
*/

	await browser.close();
	
})();

}

app.listen('8080');
console.log('API is running on http://localhost:8080');

module.exports = app;