
// ------------------------ GLOBAL VARIABLES ----------------------------------//

var container_El        = document.querySelector("#main-container")
var weatherContainer_El = document.querySelector(".weatherContainer")

// var hourContainer_El    = document.querySelector("#hrId")
var apiKey              = "7b202dce414b68293815009ca772fd69"
var baseUrl             = "https://api.forecast.io/forecast/" + apiKey
var hashController

var weatherData = null

// ------------------------ FUNCTIONS ----------------------------------//


var hashController = function(){
	var router = window.location.hash //everything after the hash tag
	
	 if(router === ''){
		weatherContainer_El.innerHTML = currentWeather(weatherData)
	}if(router === '#CurrentForecast') {
		weatherContainer_El.innerHTML = currentWeather(weatherData)
	}if(router === '#7DayForecast'){
		weatherContainer_El.innerHTML =  weeklyForecastFunc(weatherData)
	}if(router === '#HourlyForecast'){
		weatherContainer_El.innerHTML = hourlyForecastFunc(weatherData)
	}
}

var successCallback = function(positionObj){
	console.log(positionObj)
	var lat  = positionObj.coords.latitude,  // retrieves latitude
		long = positionObj.coords.longitude // retrieves longitude
	
	var fullUrl = baseUrl + "/" + lat + "," + long + "?callback=?"
	
	$.getJSON(fullUrl).then(
		function(resp){
			console.log(resp)
			weatherData = resp   // requests data from fullUrl and appends the data to the HTML sheet
			weatherContainer_El.innerHTML = currentWeather(weatherData)
		})
}

var errorCallback = function(errorObj){
	console.log(errorObj)
}

var navConstructor = function(dom_node, navTemplateBuilder){
	this._el = dom_node;
	
	this._template = navTemplateBuilder;
	
	this.renderHTML = function(inputData){  //rendering the HTML to the Dom
		target_el = document.querySelector(this._el)

		target_el.innerHTML = this._template(inputData)
	}
}

var handleViewChange = function(event){
	window.location.hash = event.target.value //this is the value of the navButton_El  // //Connecting buttons to hash
}

var weeklyForecastFunc = function(weeklyDataObject){
	var weeklyDataArray = weeklyDataObject.daily.data
	var htmlString = ''
	for(var i=1; i < weeklyDataArray.length; i++){
		var dayObj = weeklyDataArray[i]
		htmlString += weeklyForecastTemplate(dayObj)
	}
	return htmlString
}

var hourlyForecastFunc = function(hourlyDataObject){
	var htmlStr = ''
	var hourlyDataArray = hourlyDataObject.hourly.data
	for (var i=0; i < 25; i++){
		hourlyObj = hourlyDataArray[i]
		htmlStr += hourlyForecastTemplate(hourlyObj)
	}
	return '<div id="hourlyForecast">' + htmlStr + '</div>'
}

// var dateConverter = function(dataObj){
// 	var dataObj = weatherData
// var reportedDateTime = new Date(dataObj.hourly.data[i].time*1000)
// var readableDateStr = reportedDateTime.getHours()-12  + ":"+ reportedDateTime.getMinutes()+"0"
// }
var dateConverter = function(dataObj){
	var hourlyObj = dataObj.hourly.data
	console.log(hourlyObj)
	// for(var i=0; i<25; i++){
	// 	hrlyTime = hourlyObj[i]
	// 	console.log(hrlyTime)
		
	}
	// var dateObj = new Date()
	// var dateInt_ms = dateObj.getTime()
	// var datePlus24 = dateInt_ms + 1000*60*60*24
// 	new Date(hrlyTime*1000)

// }

// ------------------------ TEMPLATES ----------------------------------//

var currentWeather = function(tObj){
		var htmlStr  =   '<h2 class="temp">' + "Current Temperature: " + "</h2>"
			htmlStr +=   '<h1 class="temp">' + tObj.currently.temperature.toPrecision(2) + '&deg</h1>'
			htmlStr +=   "<p>" + "Summary: " + tObj.currently.summary + "</p>"
			// htmlStr +=   "<p>" + tObj.currently.icon + "</p>"
		return htmlStr
}

var weeklyForecastTemplate = function(obj){
	var htmlStr  = '<div class="dayBox">'
		htmlStr += 	 '<h1>' + "day of week" + '</h1>'
		htmlStr +=   '<ul>' 
		htmlStr += 	   '<li>' + obj.temperatureMax.toPrecision(2) + '&deg</li>'
		htmlStr +=     '<li>' + obj.temperatureMin.toPrecision(2) + '&deg</li>'
		htmlStr +=   '</ul>'
		htmlStr += '</div>'
		return htmlStr
}

var hourlyForecastTemplate = function(obj){
	var htmlStr  = '<div class="hrDiv">'
		htmlStr +=   '<p class="hrTitle">' + "Hourly Forcast: " + '</p>'
		htmlStr +=     '<ul>'
		htmlStr +=   	 '<li>' + obj.summary + '</li>'
		htmlStr += 		 '<li>' + obj.temperature.toPrecision(2) + '&deg</li>'
		htmlStr +=     '</ul>'
		htmlStr += 	'</div>'
		return htmlStr
}

var buttonCreatorTemplate = function(inputArr){  // button template 
	htmlStr = ''
	for(var i=0; i < inputArr.length; i++){     
		var navButton = inputArr[i]

		htmlStr += '<button class="navButtons" value="'+ navButton +'">' + navButton + "</button>"
	}
	return htmlStr
}

// ------------------------ BUTTON CONTRUCTOR ----------------------------------//

var navViewInstance = new navConstructor(".buttonContainer", buttonCreatorTemplate)


var buttonArray =['CurrentForecast','7DayForecast','HourlyForecast'] // Button Information
navViewInstance.renderHTML(buttonArray) //invoking navigation button instance

for (var i = 0 ; i < buttonArray.length ; i++){
	document.querySelector("button[value='"+buttonArray[i]+"']").addEventListener('click', handleViewChange)
}

// ------------------------ INVOKING THINGS ----------------------------------//



navigator.geolocation.getCurrentPosition(successCallback,errorCallback)

window.addEventListener("hashchange", hashController)
dateConverter()


