mapboxgl.accessToken = mapToken;
var camp = JSON.parse(campJSON);
var coordinates = camp.geometry.coordinates;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v11", // style URL
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});
const marker = new mapboxgl.Marker()
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 50 }).setHTML(
      `<h5>${camp.title}</h5><p>${camp.location}</p>`
    )
  )
  .addTo(map);
