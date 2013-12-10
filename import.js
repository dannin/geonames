var lineReader = require('line-reader');
var database = require('database');

console.log("Importing geonames data into mongo database. This may take a while.");
lineReader.eachLine('./geonames-data/US.txt', function(line, last) {

	var city = line.split('\t').structure();

  if (city.is) { // if this is a city.

  	// Delete un-needed object properties so we don't add useless info to DB.
  	delete city.is;
  	delete city.type;

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
		_id: Number(this[0]),

		name: this[1],
		state: this[10],
		country: this[8],

		loc: { 
			type: "Point",
			coordinates: [Number(this[5]), Number(this[4])], // "All documents must store location data in the same order. If you use latitude and longitude as your coordinate system, always store longitude first. MongoDB’s 2d spherical index operators only recognize [ longitude, latitude] ordering."
		},

		timezone: this[17],

		is: ((this[6] == "P") ? true : false), // if object type is city.
		type: ((this[6] == "P") ? "city" : "other") // todo: add a parse function to parse other geonames db types
	}
}