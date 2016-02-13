// holds the google map object 
var map;
// holds the location data, which has a google map marker
var locData;
// holds all of the indexed temperature data
var tmpData;
// holds the currently displayed temperature data
var currentData;
// holds the d3 scales...
var yscale, xscale;
// holds the default map icon
var defaultMapIcon;
// holds the highlighted map icon
var highlightedMapIcon;
// holds the month currently being viewed
var currentMonth = 'all'
// holds the list of currently highlighted stations...
var highlightedStations = [];

// get the location data...
function retrieveLocations() {
	d3.csv("data/locations.csv", initMap);
}

// initiatlize the map with the locations...
function initMap(data) {
	defaultMapIcon = {
		path: google.maps.SymbolPath.CIRCLE,
		scale: 4
	};
	highlightedMapIcon = {
		path: google.maps.SymbolPath.CIRCLE,
		scale: 5,
		fillColor: 'red',
		fillOpacity: 1,
		strokeColor: 'red'
	};
	
	// create map markers and index location data
	locData = d3.map();
	for (var i in data) {
		o = data[i]
		locData.set(o.station, o);
		o.lat = parseFloat(o.lat)
		o.lon = parseFloat(o.lon)
		o.marker = new google.maps.Marker({
			position: {lat: o.lat, lng: o.lon},
			title: o.station,
			icon: defaultMapIcon
		});
		o.marker.addListener('click', function () {
			var station = this.title;
			console.log("mouseout"+station);
			toggleHighlightStations([station]);
		});
	}
	// make the map and center on the region...
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 0, lng: -160},
		zoom: 3
	});
	// assing the map to the markers...
	for (var i in data) {
		data[i].marker.setMap(map);
	}
	d3.csv("data/data.csv", initTemperatureData);
}


// initialize the temperature data...
function initTemperatureData(data) {
	width = 950;
	height = 400;
	// tmpData = map(month, map(station, map(year, value)))
	tmpData = d3.map();
	for (i in data) {
		o = data[i];
		station = o.station;
		month = o.month;
		monthData = tmpData.get(month);
		if (!monthData) {
			monthData = d3.map();
			tmpData.set(month, monthData);
		}
		stationData = monthData.get(station);
		if (!stationData) {
			stationData = d3.map();
			monthData.set(station, stationData);
		}
		stationData.set(o.year, [o.year, o.v]);
	}
	
	// prepare the graph view...
	yscale = d3.scale.linear().domain([19, 30]).range([height-25,25]);
	yAxis = d3.svg.axis().scale(yscale).orient("left").tickSize(width-50);
	d3.select("#yaxis").attr("transform", "translate("+width+",0)").call(yAxis);
	xscale = d3.scale.linear().domain([1979,2015]).range([60,width-35]);
	xAxis = d3.svg.axis().scale(xscale).orient("bottom").tickSize(height-30)
		.tickFormat(d3.format('d'));
	d3.select("#xaxis").attr("transform", "translate(0,10)").call(xAxis);

	d3.select("svg").append('text')
		.attr('transform', 'rotate(-90)')
		.attr('x', -185)
		.attr('y', 15)
		.style('text-anchor','middle')
		.text('Air Temperature (Degrees Celcius)');
	
	d3.select("svg").append('text')
		.attr('x', (width+10)/2)
		.attr('y', height+10)
		.style('text-anchor','middle')
		.text('Year');
	
	// plot the data...
	showYears();	
}

// highlight the graph line for a particular station...
function highlightStationGraph(station) {
	d3.select('g.lines').selectAll('polyline').each(function (d) {
		var sel = d3.select(this);
		if (station == sel.attr('station')) {
			sel.transition()
				.duration(500)
				.attr('stroke-width',3)
				.attr('stroke','red');
		}
	});
}

// unhighlight the graph line for a particular station...
function unHighlightStationGraph(station) {
	d3.select('g.lines').selectAll('polyline').each(function (d) {
		var sel = d3.select(this);
		if (station == sel.attr('station')) {
			sel.transition()
				.duration(500)
				.attr('stroke-width',1)
				.attr('stroke','slategray');
		}
	});
}

// highlight the map marker for a particular station...
function highlightStationMap(station) {
	console.log(station);
	m  = locData.get(station).marker;
	m.setMap(null);
	m.icon = highlightedMapIcon;
	m.setMap(map);
}

// unhighlight the map marker for a particular station...
function unHighlightStationMap(station) {
	console.log(station);
	m  = locData.get(station).marker;
	m.setMap(null);
	m.icon = defaultMapIcon;
	m.setMap(map);
}

// toggle the highlight of the specified list of stations...
function toggleHighlightStations(stations) {
	for (i in stations) {
		station = stations[i];
		if (highlightedStations.indexOf(station)==-1) {
			highlightedStations.push(station);
			highlightStationGraph(station);
			highlightStationMap(station)
		} else {
			highlightedStations.splice(highlightedStations.indexOf(station),1);
			unHighlightStationGraph(station);
			unHighlightStationMap(station)
		}
	}
}

// force the list of stations to be highlighted and
// all other, currently highlighted stations to be unhighlighted...
function highlightTheseStations(stations) {
	var newHighlights = [];
	for (i in stations) {
		station = stations[i];
		var idx = highlightedStations.indexOf(station);
		if (idx==-1) {
			// in the list and not highlighted...
			newHighlights.push(station);
		}
	}
	for (i in highlightedStations) {
		station = highlightedStations[i];
		var idx = stations.indexOf(station);
		if (idx==-1) {
			// highlighted and not in the list...
			newHighlights.push(station);
		}
	}
	toggleHighlightStations(newHighlights);
}
// respond to the month selection...
function setMonth(selector) {
	currentMonth = selector.value;
	showYears();
}

// display the data for the currently selected month...
function showYears() {
	currentData = tmpData.get(currentMonth);
	
	//d3.select('g.lines').selectAll('polyline').remove();
	var sel = d3.select('g.lines').selectAll('polyline')
		.data(currentData.entries(), function(d) {return d.key;});
	sel.enter()
		.append('polyline');
	
	sel.attr("stroke",function(d) {
		if (highlightedStations.indexOf(d.key)>-1) {
			return 'red';
		} else {
			return 'slategray';
		}
	})
	sel.attr("stroke-width",function(d) {
		if (highlightedStations.indexOf(d.key)>-1) {
			return '3';
		} else {
			return '1';
		}
	})
	.attr("station", function (d) {
		return d.key;
	})
	.attr("fill","none")
	.on('mouseover', function() {
		var station = d3.select(this).attr('station');
		toggleHighlightStations([station]);
	}).on('mouseout', function() {
		var station = d3.select(this).attr('station');
		toggleHighlightStations([station]);
	})
	.transition().ease("linear").duration(500)
	.attr("points", function (d) {
		// d is a map for a station, generate the path...
		var path = "";
		for (i=1979; i<=2015; i++) {
			var year = i;
			var data = d.value.get(year);
			if (data) {
				var temperature = parseFloat(data[1]);
				path = path + xscale(year) + ',' + yscale(temperature) + ' ';
			}
		}
		return path;
	});
	
	sel.exit().remove();
	
	d3.select("#stations").text(currentData.size()+" Stations");
	d3.select("#years").style("color", "red")
		.text(currentMonthAsString() + ": Median Air Temperature")
		.transition().duration(750).style("color", "black");
}

function currentMonthAsString() {
	var result = '';
	switch(currentMonth) {
		case 'all':
			result = 'Annual';
			break;
		case '1':
			result = 'January';
			break;
		case '2':
			result = 'February';
			break;
		case '3':
			result = 'March';
			break;
		case '4':
			result = 'April';
			break;
		case '5':
			result = 'May';
			break;
		case '6':
			result = 'June';
			break;
		case '7':
			result = 'July';
			break;
		case '8':
			result = 'August';
			break;
		case '9':
			result = 'September';
			break;
		case '10':
			result = 'October';
			break;
		case '11':
			result = 'November';
			break;
		case '12':
			result = 'December';
			break;
		default:
			result = 'blah';
	}
	return result;
}

// animate the months, from january thru december,
// one month per second...
function animateMonths() {
	before = currentMonth;
	currentMonth = "1";
	monthAnimation = setInterval(function() {
		if ('13' == currentMonth) {
			currentMonth = before;
			showYears();
			clearInterval(monthAnimation);
		} else {
			showYears();
			currentMonth = ""+(parseInt(currentMonth) + 1);
		}
	}, 1000);
}

// animate the months, from january thru december,
// one month per second...
function animateLatitude() {
	var i = 0;
	latAnimation = setInterval(function() {
		if (i==westToEast.length) {
			highlightTheseStations([]);
			clearInterval(latAnimation);
		} else {
			console.log(westToEast[i])
			highlightTheseStations(westToEast[i]);
			i += 1;
		}
	}, 2000);
}

var westToEast = [
	['TR2N138E','TR0N138E','TR8N137E','TR8N130E',
		'TR5N137E','TR5N147E','TR2N147E','TR0N147E'],
	['TR5S156E','TR2S156E','TR0N156E','TR2N156E','TR5N156E','TR8N156E'],
	['T8S165E','T5S165E','T2S165E','T1S167E','T0N165E','T2N165E','T5N165E','T8N165E','T8N167E','T8N168E','T0N170E'],
	['T8S180W','T5S180W','T2S180W','T0N180W','T2N180W','T5N180W','T8N180W','T0N176W'],
	['T8S170W','T5S170W','T2S170W','T0N170W','T2N170W','T5N170W','T8N170W'],
	['T8S155W','T5S155W','T2S155W','T0N155W','T2N155W','T5N155W','T8N155W','T2N157W','T1N153W','T1S153W','T0N152W'],
	['T5S140W','T2S140W','T0N140W','T2N140W','T5N140W','T9N140W'],
	['T8S125W','T5S125W','T2S125W','T0N125W','T2N125W','T5N125W','T8N125W'],
	['T8S110W','T5S110W','T2S110W','T0N110W','T2N110W','T5N110W','T8N110W'],
	['T8S95W','T5S95W','T2S95W','T0N95W','T2N95W',
		'T5N95W','T8N95W','T10N95W','T12N95W']
];

// force several eastern stations to be highlighted...
function highlightEast() {
	highlightTheseStations(['T8S95W','T5S95W','T2S95W','T0N95W','T2N95W',
		'T5N95W','T8N95W','T10N95W','T12N95W']);
}

// force several western stations to be highlighted...
function highlightWest() {
	highlightTheseStations(['TR2N138E','TR0N138E','TR8N137E','TR8N130E',
		'TR5N137E','TR5N147E','TR2N147E','TR0N147E']);
}
