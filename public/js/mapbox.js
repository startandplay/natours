export const displayMap = (locations) => {
  const key = '651RRiLjbERLVPXjTUq4';
  const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/backdrop/style.json?key=${key}`,
    center: locations[0].coordinates,
    zoom: 7,
    scrollZoom: false,
  });

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';
    // console.log(loc.coordinates);

    // add marker to map
    new maplibregl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new maplibregl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .setMaxWidth('300px')
      .addTo(map);
  });

  map.on('error', function (err) {
    throw new Error(
      'To load the map, you must replace YOUR_MAPTILER_API_KEY_HERE first, see README',
    );
  });
};
