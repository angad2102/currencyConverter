
var rate = 1; 

/**
* Function to get a historical exchange rate from the server through a AJAX request 
*/

function getHistoricalRate(currency,date){

	//Make sure there is no error 
	$('#exchnage-value').prop("disabled",false);
	$('#error').text("");
	$('#error').css("display","none");

	//Add a loading gif 
	$('#exchnage-value').addClass("loading");
	$('#exchnage-value').val("");

	$.ajax({
		type: "GET",
		dataType: 'json',
		url: "/historical/"+date+"/"+currency,
		success: function (data){

			if(data.currency!=""&&data.currency!=null){

				rate = data.currency;

				//update the exchange rate value 
				$('#exchnage-value').val($('#base-value').val()*rate); 

				//remove the loading gif 
				$('#exchnage-value').removeClass("loading"); 

			}else{

				//remove the loading gif 
				$('#exchnage-value').removeClass("loading"); 

				//Disable the number input  
				$('#exchnage-value').val(0);
				rate = 0;
				$('#exchnage-value').prop("disabled",true);

				//display error 
				$('#error').text("Data Not Available");
				$('#error').css("display","block");

			}
			
		}
	});
}

/**
* Function to get the latest exchange rate from the server through a AJAX request 
*/

function getLatestRate(currency){

	//Make sure there is no error 
	$('#exchnage-value').prop("disabled",false);
	$('#error').text("");
	$('#error').css("display","none");

	//Add a loading gif 
	$('#exchnage-value').addClass("loading");
	$('#exchnage-value').val("");

	$.ajax({
		type: "GET",
		dataType: 'json',
		url: "/rate/"+currency,
		success: function (data){

			if(data.currency!=""&&data.currency!=null){
				rate = data.currency;

				//update the exchange rate value 
				$('#exchnage-value').val($('#base-value').val()*rate); 
				
				//remove the loading gif 
				$('#exchnage-value').removeClass("loading"); 

			}else{
				//remove the loading gif 
				$('#exchnage-value').removeClass("loading"); 

				//Disable the number input  
				$('#exchnage-value').val(0);
				rate = 0;
				$('#exchnage-value').prop("disabled",true);

				//display error 
				$('#error').text("Data Not Available");
				$('#error').css("display","block");
			}
			
		}
	});
}

/**
* Function to get the list of all currencies  
*/

function loadJSON(callback) {   
	$.getJSON('currencies.json',function(data){
    	callback(data);
    });
 }

/**
* Put options(currencies) in the select tag 
*/
function initializeSelect(){

	loadJSON(function(response) {
  		// Parse JSON string into object
  		var select =''; 
  		//select += "<select class='form-control' id='to-currencies'>";
    	for(var key in response){
    		selected = '';
    		if (key=="USD"){
    			selected = 'selected';
    		}

    		select += "<option value='"+key+"' "+selected+">"+response[key]+" ("+key+") </option>";
    	}
    	//console.log(select);
    	$('#to-currencies').html(select);
 	});
}

$(function() {

	//put options in select 
	initializeSelect(); 

	//Historical radio button clicked 
    $('#historical').click(function(){

    	//Unclick Latest radio button 
		$('#latest').prop('checked',false);
		
		//Display the date selector 
		$('#historical-section').css('display','block');
		
		if($('#historical').prop('checked') && $('#date').val().length==10 && $('#to-currencies').val().length ==3){
			//Get historical rate 
			getHistoricalRate($('#to-currencies').val(),$('#date').val());
		}
	});

    //Latest radio button clicked 
	$('#latest').click(function(){
		
		//Unclick Historical radio button 
		$('#historical').prop('checked',false);
		
		//Hide datepicker 
		$('#historical-section').css('display','none');
			
		//Update Exchnage Rate 
		if($('#to-currencies').val().length ==3){
			getLatestRate($('#to-currencies').val());
		}
	});

	//Initialise Date Picker 
	// Source : https://github.com/fengyuanchen/datepicker
	$('[data-toggle="datepicker"]').datepicker({
		format: 'yyyy-mm-dd',
		autoHide: true,
		startDate: '1999-01-01',
		endDate: new Date()
	});


	//Update exchange rate when date value is changed 
	$('#date').on('input',function(e){

		if($('#historical').prop('checked') && $('#date').val().length==10 && $('#to-currencies').val().length ==3){
			getHistoricalRate($('#to-currencies').val(),$('#date').val());
		}

	});

	//Update the numerical value 
	$('#base-value').on('input',function(e){

		$('#exchnage-value').val($('#base-value').val()*rate);

	});

	//Update the numerical value 
	$('#exchnage-value').on('input',function(e){

		$('#base-value').val($('#exchnage-value').val()/rate);

	});

	//Update Rate 
	$('#to-currencies').on('change',function(e){

		//Check which mode the user is in (latest,historical)
		if($('#historical').prop('checked') && $('#date').val().length==10 && $('#to-currencies').val().length ==3){

			//Get historical rate 
			getHistoricalRate($('#to-currencies').val(),$('#date').val()); 
		
		}else if($('#to-currencies').val().length ==3){
				
			//Get latest rate 
			getLatestRate($('#to-currencies').val());
		
		}
	});
});


