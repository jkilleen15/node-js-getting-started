const cool = require('cool-ascii-faces');
const express = require('express');

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index')
});

app.get('/cool', function (request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/times', function(request, response) {
    var result = ''
    var times = process.env.TIMES || 5
    for (i=0; i < times; i++)
      result += i + ' ';
  response.send(result);
});

/*
// to connect database:
on command line: heroku addons:create heroku-postgresql:hobby-dev
This creates a database, and sets a DATABASE_URL environment variable
(you can check by running 'heroku config' in command line).

Edit your package.json file to add the pg npm module to your dependencies:

"dependencies": {
    "pg": "6.x",
    "ejs": "2.5.6",
    "express": "4.15.2",
    "cool-ascii-faces": "1.3.4"
}
Type npm install to install the new module for running your app locally.
Now edit your index.js file to use this module to connect to
the database specified in your DATABASE_URL environment variable:
re: code below for pg
*/

const pg = require('pg');

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

/*
This ensures that when you access your app using the /db route,
it will return all rows in the test_table table.

Deploy this to Heroku. If you access /db you will receive
an error as there is no table in the database.

Assuming that you have Postgres installed locally,
use the heroku pg:psql command to connect to the remote database,
create a table and insert a row:

$ heroku pg:psql
psql (9.5.2, server 9.6.2)
SSL connection (cipher: DHE-RSA-AES256-SHA, bits: 256)
Type "help" for help.
=> create table test_table (id integer, name text);
CREATE TABLE
=> insert into test_table values (1, 'hello database');
INSERT 0 1
=> \q
Now when you access your app’s /db route,
you will see something like this:

Database results
  * 1- hello database

!!!!! NOTE: A similar technique can be used to install
MongoDB or Redis add-ons.
--> https://elements.heroku.com/addons/categories/data-stores?_ga=2.160434686.290432393.1516469316-2051391077.1513210099&_gac=1.188716250.1515638621.Cj0KCQiAkNfSBRCSARIsAL-u3X877Ed9qc6W7xX67kJen8zioJ2CldBG6QVM7reqawUTWxwzfm0P4wgaAkWmEALw_wcB
*/

/*
// from previous code, beginning after express =
// this code may be newer, but changing to
 heroku tutorial format (pushing local changes)

const path = require('path');
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

*/
