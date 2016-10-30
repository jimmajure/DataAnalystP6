# DataAnalystP6
Udacity Data Analyst P6

## Summary
This visualization is a *user driven* graphic that allows the viewer to explore air temperature data
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

In the map view highlighted elements are encoded using size and color: the size of the shape 
is increased and the color of the shape is set to red.

In the graph view highlighted elements are encoded using size and color: the thickness of the line 
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

### Changes After Feedback

My visiualization changed (index_v1.html) considerably after I received feedback. In my original version,
I allowed the viewer to choose 2 years - a begin year and an end year - and I plotted values for only
those two years, without the intervening data. 

The reviewers struggled to understand how to select the years and how to work the animations. They also 
wanted to see all of the data instead of only a pair of years. 

A number of small things were also changed, including better labeling of axes and spelling.

## Feedback

I received feedback on my initial version froj Laura, Annie and Mitch. Here are
the notes they provided. The original version can be seen in index_v1.html.

### Laura

1. Capitalize 'ocean' in description
2. animation - rules clarity from-to year
3. can you see temp data when you highlight bar?
4. map markers could stand out more when highlighted
5. (axis) get commas out of years

### Annie

1. "data were" subject verb agreement
1. "it can be a bumpy ride" ura dork
1. how do you move the check from 2015
1. 49 degrees F or C?

### Mitch

1. label axes
1. fix year labels
1. easier to hover over lines
1. summary panel not clear
1. can i see more years together?

## Resources

online Documentation for:
d3.js
javascript
R (for EDA) and such
