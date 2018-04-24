# Currency Converter

Currency converter is a web app to get latest as well as historical exchange rates for any currency. It is a full stack solution with a sleek and simple frontend. 

Along with just getting the exchange rate for a currency, the app can also perform calculations from one currency to another. 

The app can be started by running 

`node server.js`

# Architecture 

# - Back End 

server.js starts the server and starts listening for the requests. The app uses express to listen to requests. 

express.js handles incoming requests. 

The website can be accessed by :

`http://localhost:3000/ //Sample call`

'/rate/:currency' can be called to get the latest rate of a currency.

`http://localhost:3000/rate/HKD     //Sample call`

express.js stores a local copy of openexchangerates.org/api/latest.json which contains all the latest exchange rates. If the file is older than an hour, an updated file is requested from openexchangerates.org. Keeping a local copy of the file  is beneficial for us. Reading from a local file is faster than reading from a urld, openexchangerates.org provides only one set of exchange rates every hour, and we stay within our quota limits of openexchangerates.org. The request returns a JSON object. 

'/historical/:YYYY-MM-DD/:currency' can be called to get rate of a currency at a past date.

`http://localhost:3000/historical/2002-03-12/HKD     //Sample call`

For historical rates, exchange.js calls always requests the data from the server. 

# - Front End 

The public folder contains publicly accessible html, css, js, images and cache files. Bootstrap, Jquery and datepicker package (https://github.com/fengyuanchen/datepicker) has been used for the front end.

Changing the currency, selecting historical data, changing the date will all initiate a call to the server to get the exchange rates automatically. The JS file initiates an appropriate call to exchange.js on the server. 

The numbers in the two input number fields can be changed to do calculations from one currency to another instead of the default 1.  The updates will be automatic. 

# Tests

The tests have been implemented using Mocha and chai. You can run the tests by running this command. 

`node test`

There are 4 basic tests. 
- Home Page is rendered with HTTP 200 
- Latest currency rate for SSP is correct
- Historical rate for SSP at a particular date is correct
- The app should return result:failed for a value which doesnt exists. 

# Notes & Future Work 

- The app just provides USD as base currency which is a limitation applied by openexchangerates.org for the free plan. 
- The app could also implement a feature to show graphs for currency trends but that feature is not accessible in the openexchangerates's free plan. 
