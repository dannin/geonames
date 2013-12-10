var geonames = require('./geonames.js');

// Intialize geonames module.
geonames.init();

// 34.0500, -118.2500 - Los Angeles, California - More specifically Bunker Hill, California
// 34.057°N 118.238°W - San Francisco, California - More specifically Opera Plaza, California

geonames.city(34.0500, -118.2500, function(err, result) {
	if (err) {
		console.log("There was an error resolving coordinates.");
		console.log(err);
		return;
	}

	console.log("Result: " + JSON.stringify(result, true, 3));
});
