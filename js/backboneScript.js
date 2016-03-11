console.log("hello")
console.log(Backbone)
console.log($)

var weatherData = null

var weatherModel = Backbone.Model.extend({
	_generateUrl: function(lat,lng) {
		this.url = "https://api.forecast.io/forecast/7b202dce414b68293815009ca772fd69/" + lat + "," + lng + "?callback=?"
	}
})

var currentView = Backbone.View.extend({
	el: ".weatherContainer",

	initialize: function(someModel) {
		this.model = someModel
	},
	// var boundRender = this._render.bind(this)
	// this.model.on("sync",boundRender)

	_render: function(tObj){

		var htmlStr  =   '<h2 class="temp">' + "Current Temperature: " + "</h2>"
			htmlStr +=   '<h1 class="temp">' + tObj.currently.temperature.toPrecision(2) + '&deg</h1>'
			htmlStr +=   "<p>" + "Summary: " + tObj.currently.summary + "</p>"
		this.el.innerHTML += htmlStr
	}

})

var weatherRouter = Backbone.Router.extend({
	routes: {
		"*Default"       : "handleDefaultView",
		"CurrentForecast/:lat/:lng": "handleCurrentWeather"
	},

	handleDefaultView: function(){

		var successCallback = function(positionObj){
			var lat  = positionObj.coords.latitude,  // retrieves latitude
				long = positionObj.coords.longitude // retrieves longitude
				location.hash = "currentForecast" + lat + "/" + long + "?callback=?"

				var defm = new weatherModel()
				var defv = new currentView(defm)

				
				defm.fetch().then(function(data){
					// weatherData = data
					console.log(data)
				})
		}

		var errorCallback = function(errorObj){
			console.log(errorObj)
		}

		window.navigator.geolocation.getCurrentPosition(successCallback,errorCallback)
	},

	handleCurrentWeather: function(lat,lng){
		var wm = new weatherModel()
		var cv = new currentView(wm)

		wm._generateUrl(lat,lng)
		// wm.fetch().then(cv._render.bind(cv))
		console.log(wm.fetch().then(function(data){
			console.log(data)
		}))
		
	},


	initialize: function() {
		Backbone.history.start()
	} 
})

var rtr = new weatherRouter()









