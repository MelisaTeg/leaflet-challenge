// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map object with center and zoom options.
let myMap = L.map('map', {
  center: [38.32, -95.91], 
  zoom: 2
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(myMap);

// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 0.5, 
      fillOpacity: 0.5,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: '#808080',
      radius: getRadius(feature.properties.mag),
      stroke: true, 
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    switch (true) {
      case depth > 90:
        return '#7FFFD4';
      case depth > 70:
        return '#5F9EA0';
      case depth > 50:
        return '#483D8B';
      case depth > 30:
        return '#8FBC8F';
      case depth > 10:
        return '#E9967A';
    }
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        'Magnitude: '
        + feature.properties.mag
        + '<br>Depth: '
        + feature.geometry.coordinates[2]
        + '<br>Location: '
        + feature.properties.place
      );
    }
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(myMap);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Initialize depth intervals and colors for the legend
    let depth_intervals = [10, 30, 50, 70, 90]
    let colors = ['#E9967A', '#8FBC8F', '#483D8B', '#8FBC8F', '#7FFFD4']

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depth_intervals.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + depth_intervals[i] + (depth_intervals[i + 1] ? "&ndash;" + depth_intervals[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(myMap);

});

// OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
 // d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.


    // Then add the tectonic_plates layer to the map.



  