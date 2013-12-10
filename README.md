geonames
========

Node.JS module to process geonames data into and from a mongo database.

Standard import:

1. Download the US.txt file or other country of your choice from http://geonames.org
2. Place the file into `geonames-data` directory.
3. Type `node import` and wait.


<h>Use a remote database</h>

By default the database will use localhost.<br>
Modify `database.use_safe("geonames", "cities", function(db) {` to use another database.

For example: <br>
`database.use_safe("example.com/geonames", "cities", function(db) {` <br>
or <br>
`database.use_safe("username:password@example.com/geonames", "cities", function(db) {`
