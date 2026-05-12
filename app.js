const map = L.map('map', {
  zoomControl: true,
  attributionControl: true,
}).setView([34.03, -6.84], 8);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 20,
}).addTo(map);

const fixes = [
  { name: 'RBT01', type: 'IFR', lat: 34.05, lon: -6.8 },
  { name: 'SLA02', type: 'IFR', lat: 33.95, lon: -7.1 },
  { name: 'AYB03', type: 'VFR', lat: 34.2, lon: -6.55 },
  { name: 'NOIR4', type: 'VFR', lat: 33.76, lon: -6.92 },
];

const layerGroups = {
  IFR: L.layerGroup().addTo(map),
  VFR: L.layerGroup().addTo(map),
};

function renderFixes() {
  const filter = document.getElementById('fixFilter').value.trim().toLowerCase();
  const showIfr = document.getElementById('ifrs').checked;
  const showVfr = document.getElementById('vfrs').checked;

  layerGroups.IFR.clearLayers();
  layerGroups.VFR.clearLayers();

  let ifrCount = 0;
  let vfrCount = 0;

  fixes
    .filter((f) => f.name.toLowerCase().includes(filter))
    .forEach((fix) => {
      const color = fix.type === 'IFR' ? '#56e0c3' : '#8ec4ff';
      const marker = L.circleMarker([fix.lat, fix.lon], {
        radius: 6,
        color,
        fillColor: color,
        fillOpacity: 0.95,
        weight: 1,
      }).bindPopup(`<b>${fix.name}</b><br/>${fix.type} Reporting Point`);

      if (fix.type === 'IFR') {
        ifrCount += 1;
        if (showIfr) marker.addTo(layerGroups.IFR);
      }
      if (fix.type === 'VFR') {
        vfrCount += 1;
        if (showVfr) marker.addTo(layerGroups.VFR);
      }
    });

  document.getElementById('fixCounter').textContent = `IFR Fixes ${ifrCount} · VFR Fixes ${vfrCount}`;
}

const route = [
  [34.05, -6.8],
  [34.1, -6.67],
  [34.2, -6.55],
];
L.polyline(route, { color: '#b2c5df', dashArray: '8 5' }).addTo(map);

const speedSlider = document.getElementById('speedSlider');
const speedReadout = document.getElementById('speedReadout');

speedSlider.addEventListener('input', () => {
  speedReadout.textContent = `${speedSlider.value} kts`;
});

['fixFilter', 'ifrs', 'vfrs'].forEach((id) => {
  document.getElementById(id).addEventListener('input', renderFixes);
  document.getElementById(id).addEventListener('change', renderFixes);
});

renderFixes();
