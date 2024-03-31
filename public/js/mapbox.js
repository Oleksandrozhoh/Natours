/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoib2xla3NhbmRyb3pob2giLCJhIjoiY2x1ZWU2ZTg3MXJ4djJtbGRwNzZhemtoaCJ9.IRTOw7wmwB3Y_mQrfyox-g';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  maxZoom: 10,
  scrollZoom: false,
  //   center: [-87.662211, 41.971833],
  //   zoom: 10,
  //   interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker options add to map
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // add popup
  new mapboxgl.Popup({ offset: 30 })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}<p>`)
    .addTo(map);

  // extend map bounds
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, { padding: { top: 200, bottom: 100, left: 200, right: 200 } });
