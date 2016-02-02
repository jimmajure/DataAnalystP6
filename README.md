# DataAnalystP6
Udacity Data Analyst P6

## Summary
This visualization is a *user driven* graphic that allows one to explore air temperature data
collected from 83 equitorial Pacific weather station buoys from 1979-2015.

There are 2 "views": a map view showing the location of the buoys in the Pacific, and a graph view
that plots the median yearly temperatures for each station, summarized by month or by year.

The visualization incorporates interactions through clicking on stations in the *map view* or hovering over
lines in the *graph view*. Interactions in one view highlight corresponding data in the other.

Animation is incorporated by cycling through the months, January thru December, to display seasonal 
temperature variation.

## Design

After exploring the data, there were several types of trends I wanted the viewer to be able
to see:

1. The variability of the temperatures by location.
3. The variablity of the temperatures by season.
2. The effect of the 1997-1998 El Nino weather phenominon.
3. The general trend of temperatures over the time period.

To facilitate this I included 2 data views: a map to display the buoy locations and
a line graph to display the temperatures by station over time.

### Map View
The map view encodes the buoy locations as x and y positions in the context of other
geographic information. The buoys are displayed using a constant shape/size initially.

### Graph View
The graph view encodes temperature data against time using a line chart. Time is encoded 
as the x position and temperature is encoded as the y position. Each line int the chart 
represents an individual buoy.

The scales of both the x and y axes are kept constant to the full time and temperature
ranges of the data so that changes in the month being viewed can be compared.

### Map View -to- Graph View Interactions
To explore the temperature variability by location, one can click on the stations
in the map view, which highlights the corresponding line in the graph view. Hovering 
over a line in the graph view also highlights the buoy the line represents in the map
view. 

In the map view highlighted elements are encoded size and color: the size of the shape 
is increased and the color of the shape is set to red.

In the graph view highlighted elements are encoded size and color: the thickness of the line 
is increased and the color of the line is set to red.

### Month Selection
The viewer can choose the month with the month selection box. Choosing a month causes the
graph view to be updated with the median temperatures for that month. This allows seasonal
variation to be explored.

### Canned Interactions
There are several pre-programmed interactions intended to highlight specific trends in 
the data. 

1. *Animate Months...* cycles through the months from January thru December to 
display the seasonal variability in the data.
2. *Hightlight West* highlights several buoys in the western part of the region so the viewer
can easily see the temperatures in that area.
3. *Highligh East* highlights several buoys in the eastern part of the region so the viewer
can easily see the temperatures in that area.

## Feedback

## Resources
