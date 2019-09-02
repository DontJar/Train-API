// Based on this excellent video: https://www.youtube.com/watch?v=pixfH6yyqZk

const puppeteer = require('puppeteer');

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