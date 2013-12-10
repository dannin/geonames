// geonames

var database = require('database');

module.exports = {

	init: function() {

		// Make sure our geonames index is ready to go.
		database.use_safe("geonames", "cities", function(db) {
			db.ensureIndex( { loc: "2dsphere" }, { safe: true }, function(err, doc) {
				if (err)  { 
					console.log("Error indexing geonames doc: " + doc);
					console.log(err);
				}
  		});
		});
  },

	city: function(latitude, longitude, callback) {
		// Locate the city using latitude and longitude.
		console.log("[geonames] Resolve city from coordinates. [" + latitude + ", " + longitude + "]");

		database.use_safe("geonames", "cities", function(db) {
			db.findOne( 
			{ 
				loc: {
					$near: {
						type: "Point",
						coordinates: [longitude, latitude],
						spherical: true
					}
				}
			}, function(err, result) {
				if (err) {
					callback(err);
					return;
				}

				if (!result) {
					callback("Geonames: No result found.");
					return;
				}

				callback(null, { city: result.name, state: result.state });
			});
		});
	},

	latlng: function(city, state) {
		// Reverse locate - Get's coordinates from a city and state.
	},

	coordinates: function(address) {
		// Get the coordinates from an address.
	},

	address: function(latitude, longitude) {
		// Get the address from coordinates.
	}

}