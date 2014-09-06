var lineReader = require('line-reader');
var database = require('database');

console.log("Importing geonames data into mongo database. This may take a while.");
lineReader.eachLine('./geonames-data/CA.txt', function(line, last) {

	var city = line.split('\t').structure();

  if (city.city) { // if this is a city.

		database.use_safe("geonames", "cities", function(db) {
			db.save(city, { safe: true }, function(err, doc) {
				if (err)  { 
					console.log("Error saving document: " + doc);
					console.log(err);
					return;
				}
			});
		});

  }

  if (last) {
  	// Set up cities to use geospatial indexing.
  	console.log("Indexing geonames cities");
  	database.use_safe("geonames", "cities", function(db) {
  		db.ensureIndex( { loc: "2dsphere" }, { safe: true }, function(err, doc) {
				if (err)  { 
					console.log("Error indexing geonames doc: " + doc);
					console.log(err);

					console.log("Could not finish importing data.");
					return;
				}

				console.log("Finished importing data.");
  		});
  	});
  }
});

Array.prototype.structure = function() {
	// from geonames readme: - P.PPL	populated place	a city, town, village, or other agglomeration of buildings where people live and work
	return {
		country: this[0],
		postal: this[1],
		city: this[2],
		state: this[3],
		state_code: this[4],
		province: this[5],
		province_code: this[6],
		community: this[7],
		community_code: this[8],

		loc: {
			type: "Point",
			coordinates: [Number(this[10]), Number(this[9])], // "All documents must store location data in the same order. If you use latitude and longitude as your coordinate system, always store longitude first. MongoDB’s 2d spherical index operators only recognize [ longitude, latitude] ordering."
		}
	}
}