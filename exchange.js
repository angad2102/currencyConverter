'use strict';

/**
* Module Dependencies 
*/

var fs = require('fs');
var http = require('http');
var path = require('path');

var appID = '62c9d9b780594d8ba13454e552a8ddb3'; //App ID for openexchnagerates.org 

/**
* Function to get data from openexchangerates.org 
*/

function getData(currency=null,resOrig=null,date=null){

	if(date==null){
		var path = '/api/latest.json?app_id='+appID; //get latest json data 
	}else{
		var path = '/api/historical/'+date+'.json?app_id='+appID; //get historical json data 
	}

  	var requestOptions = {
    		host: 'openexchangerates.org'
    		,path: path
    		,method: 'GET'
    		,headers: { 'Content-Type': 'application/json' }
  		};

  	var buffer = '';

	var req = http.request(requestOptions, function(res) { 

        res.setEncoding('utf8');

        res.on('data', function (data) {
           buffer = buffer+data;
        });
          
        res.on('end', function(){
          
        if(buffer!=""){

            try{
          
                var parsed = JSON.parse(buffer);
          
                if(parsed.rates){        

                 	if(res!=null&&currency!=null&&parsed.rates[currency]!=null){

                    var result = {
                          "result" : "success",
                          "currency" : parsed.rates[currency],
                        };

                	} else{
                    
                    	var result = {
                        	  "result" : "failed"
                        	};
                	}

                 	result = JSON.stringify(result);
                    
                    resOrig.header('Content-Type', 'application/json').send(result);
                    
                    if(date==null){
                    	fs.writeFile('latest.json', buffer, 'utf8');
                    }
                }
            	else{
                  	getData(currency,resOrig,date);
    	        }
                
            } catch(error){
                
               getData(currency,resOrig,date);
              
           	}
                
        }

    	});
    });

  req.on('error', function(e) {
    console.log("error");
      getData(currency,resOrig,date);
  });

  req.end();

}


module.exports = function (app) {

	app.get('/',function(req,res){
	
		res.sendFile(path.join(__dirname+'/public/html/index.html')); //render home page 
	});

	/**
	* Call to get latest exchange rate for a particular currency 
	* returns JSON 
	*/
	app.get('/rate/:currency',function(req,res){

		var currency = req.params.currency;
		
		var curr_list = null; 

		//Check if a local json file exists 

		if(fs.existsSync('latest.json')){
			
			var file = fs.readFileSync('latest.json');

			if(file!=""){

				curr_list = JSON.parse(file);
				var current_time = Math.floor(new Date().getTime() / 1000);
			
				if(current_time - curr_list.timestamp > 3600){

					getData(currency,res); //Get a new file from server as the file is older than an hour and updated exchnage rates would be available 
				
				}else{
					if(curr_list.rates[currency]!=null){


						//returns exchnage rate from local file, if the file is not older than an hour 
						var result = {
							"result" : "success",
							"currency" : curr_list.rates[currency],
						}

					}else{

						var result = {
							"result" : "failed"
						};
					}
					result = JSON.stringify(result);
					res.header('Content-Type', 'application/json').send(result);
				}
				
			}else{
				getData(currency,res); //Get updated JSON file from openexchangerates.org 
			}
			
			
		}else{
			getData(currency,res); //Get updated JSON file from openexchangerates.org 
		}

		

		
	});

	/**
	* Call to get historical exchange rate for a particular currency and a particular date 
	* returns JSON 
	*/

	app.get('/historical/:date/:currency',function(req,res){

		getData(req.params.currency,res,req.params.date); //Get JSON file from openexchangerates.org 
	
	});

};
