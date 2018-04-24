/**
* Module Dependencies 
*/
var expect  = require("chai").expect;
var request = require("request");

describe("Currency Converter tests", function() {

  describe("Get current rate of SSP", function() {

    var url = "http://localhost:3000"; //Change to appropriate URL 
    var appID = '62c9d9b780594d8ba13454e552a8ddb3'; //App ID for openexchnagerates.org 

    it("returns status 200 for /", function(done) {

      request(url, function(error, response, body) {
        
        expect(response.statusCode).to.equal(200);
        
        done();
     
      });
    
    });

    it("returns the correct latest value", function(done) {

      url = "http://localhost:3000/rate/SSP";
      request(url, function(error, response, body) {

		    request(("http://openexchangerates.org/api/latest.json?app_id="+appID), function(error2, response2, body2) {     

          expect(JSON.parse(body2).rates["SSP"]).to.equal(JSON.parse(body).currency);
        
          done();
      
        });
    
      });

    });

  it("result the correct historic value", function(done) {
      
      url = "http://localhost:3000/historical/2017-03-21/SSP";

      request(url, function(error, response, body) {

        var appID = '62c9d9b780594d8ba13454e552a8ddb3'; //App ID for openexchnagerates.org 

        request(("http://openexchangerates.org/api/historical/2017-03-21.json?app_id="+appID), function(error2, response2, body2) {     

          expect(JSON.parse(body2).rates["SSP"]).to.equal(JSON.parse(body).currency);
        
          done();
      
        });
    
      });

    });

  it("result in incorrect historical value", function(done) {
      
      url = "http://localhost:3000/historical/2003-03-21/SSP";

      request(url, function(error, response, body) {

          expect(JSON.parse(body).result).to.equal("failed");
        
          done();
    
      });

    });

});

});
