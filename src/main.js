const STOPS = [
  ['dub-air',1,'Dublin Airport','Ireland','Dublin',53.4264,-6.2499,'airport','Arrive in Ireland and transfer into Dublin.',true],
  ['dub-city',1,'Dublin City Centre','Ireland','Dublin',53.3498,-6.2603,'sleep','First Dublin base.',true],
  ['trinity',2,'Trinity / Book of Kells','Ireland','Dublin',53.3438,-6.2546,'book','Core Dublin booking.',true],
  ['kilmainham',2,'Kilmainham Gaol','Ireland','Dublin',53.3420,-6.3099,'book','Must-book Dublin history stop.',true],
  ['galway',3,'Galway','Ireland','West Ireland',53.2707,-9.0568,'sleep','West coast city base.',true],
  ['clonmacnoise',3,'Clonmacnoise','Ireland','West Ireland',53.3277,-7.9865,'optional','Optional monastic stop.',false],
  ['moher',4,'Cliffs of Moher','Ireland','West Ireland',52.9715,-9.4309,'sight','West coast headline stop.',true],
  ['doolin',4,'Doolin','Ireland','West Ireland',53.0167,-9.3775,'sleep','Recommended sleep after the Cliffs.',true],
  ['galway-alt',4,'Return to Galway alternative','Ireland','West Ireland',53.2707,-9.0568,'alternative','Fewer hotel moves, more backtracking.',false],
  ['belfast',5,'Belfast','Northern Ireland','Northern Ireland',54.5973,-5.9301,'sleep','Base before Causeway and ferry.',true],
  ['causeway',6,'Giant’s Causeway','Northern Ireland','Northern Ireland',55.2408,-6.5116,'sight','Basalt columns on Antrim Coast.',true],
  ['dunluce',6,'Dunluce Castle','Northern Ireland','Northern Ireland',55.2108,-6.5796,'optional','Optional castle stop near the Causeway.',false],
  ['belfast-ferry',7,'Belfast Ferry Terminal','Northern Ireland','Ferry',54.6310,-5.8920,'ferry','Belfast to Cairnryan ferry.',true],
  ['cairnryan',7,'Cairnryan Ferry Port','Scotland','Ferry',54.9683,-5.0144,'ferry','Arrive in Scotland.',true],
  ['glasgow',7,'Glasgow','Scotland','Lowlands',55.8642,-4.2518,'sleep','First Scotland overnight.',true],
  ['loch-lomond',8,'Loch Lomond','Scotland','Lowlands',56.0790,-4.6190,'sight','Scenic start to Scotland.',true],
  ['glencoe',9,'Glencoe','Scotland','Highlands',56.6826,-5.1023,'sight','Cinematic Highlands valley.',true],
  ['fort-william',9,'Fort William','Scotland','Highlands',56.8198,-5.1052,'sleep','Practical Highlands base.',true],
  ['eilean',10,'Eilean Donan Castle','Scotland','Highlands',57.2740,-5.5160,'sight','Iconic castle on the way to Skye.',true],
  ['portree',10,'Portree / Isle of Skye','Scotland','Skye',57.4125,-6.1942,'sleep','Skye base placeholder.',true],
  ['storr',11,'Old Man of Storr','Scotland','Skye',57.5065,-6.1831,'hike','Classic Skye viewpoint.',true],
  ['quiraing',11,'Quiraing','Scotland','Skye',57.6439,-6.2653,'sight','Dramatic Skye landscape.',true],
  ['inverness',12,'Inverness','Scotland','Highlands',57.4778,-4.2247,'sleep','Highlands city base.',true],
  ['pitlochry',13,'Pitlochry / Cairngorms','Scotland','Highlands',56.7051,-3.7291,'drive','Southbound scenic transition.',true],
  ['edinburgh',13,'Edinburgh','Scotland','Edinburgh',55.9533,-3.1883,'sleep','Final Scotland city base.',true]
].map(([id,day,name,country,region,lat,lng,type,description,enabled]) => ({ id, day, name, country, region, lat, lng, type, description, enabled }));

const BLOCKS = [
  ['flight-out','Flight to Ireland','flight','2026-07-23','2026-07-24','blue','Overnight flight into Dublin.'],
  ['dublin-stay','Dublin','hotel','2026-07-24','2026-07-26','orange','Two nights in Dublin.'],
  ['galway-stay','Galway','hotel','2026-07-26','2026-07-27','purple','One night in Galway.'],
  ['doolin-stay','Doolin','hotel','2026-07-27','2026-07-28','green','Recommended night after the Cliffs.'],
  ['belfast-stay','Belfast','hotel','2026-07-28','2026-07-30','red','Two nights in Belfast.'],
  ['ferry','Belfast to Cairnryan ferry','ferry','2026-07-30','2026-07-30','teal','Ferry transition into Scotland.'],
  ['glasgow-stay','Glasgow / Loch Lomond','hotel','2026-07-30','2026-08-01','slate','Scotland arrival base.'],
  ['fort-stay','Fort William / Glencoe','hotel','2026-08-01','2026-08-02','brown','Highlands base.'],
  ['skye-stay','Isle of Skye','hotel','2026-08-02','2026-08-04','indigo','Draft Skye block.'],
  ['inverness-stay','Inverness / Pitlochry','hotel','2026-08-04','2026-08-05','olive','Southbound transition.'],
  ['edin-stay','Edinburgh','hotel','2026-08-05','2026-08-07','pink','Final Scotland city base.']
].map(([id,label,type,start,end,color,note]) => ({ id, label, type, start, end, color, note }));

const DEFAULT_BOOKINGS = [
  ['bk-dublin','Dublin lodging','lodging','researching','2026-07-24','','','', 'Book two nights: Jul 24 and Jul 25.'],
  ['bk-galway','Galway lodging','lodging','researching','2026-07-26','','','', 'One night before Cliffs/Doolin day.'],
  ['bk-doolin','Doolin lodging','lodging','researching','2026-07-27','','','', 'Recommended. Alternative is return to Galway.'],
  ['bk-belfast','Belfast lodging','lodging','researching','2026-07-28','','','', 'Two nights before ferry.'],
  ['bk-ferry','Belfast to Cairnryan ferry','ferry','not started','2026-07-30','','','', 'Confirm sailing time and rental car permission.'],
  ['bk-car','Rental car strategy','rental car','not started','2026-07-26','','','', 'Decide one car on ferry vs separate rentals.'],
  ['bk-eta','UK ETA','admin','not started','2026-07-20','','','', 'Needed for Northern Ireland and Scotland.'],
  ['bk-kilmainham','Kilmainham Gaol','attraction','not started','2026-07-25','','','', 'Book when ticket window opens.'],
  ['bk-trinity','Trinity / Book of Kells','attraction','not started','2026-07-25','','','', 'Book Dublin priority.'],
  ['bk-skye','Skye lodging','lodging','researching','2026-08-02','','','', 'Critical if Skye remains in route.']
].map(([id,title,category,status,date,cost,confirmation,link,notes]) => ({ id,title,category,status,date,cost,confirmation,link,notes,deadline:'' }));

const STORE = 'atlast-static-v2';
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const uid = prefix => `${prefix}-${Math.random().toString(36).slice(2,9)}`;

let state = loadState();
let map;
let routeLine;
let markers = [];
let selectedId = null;
let hotelsOnly = false;
let calendarHotelsOnly = false;

function loadState(){
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || '{}');
    const fallbackEnabled = STOPS.filter(s => s.enabled).map(s => s.id);
    return {
      stops: saved.stops || structuredClone(STOPS),
      blocks: saved.blocks || structuredClone(BLOCKS),
      bookings: saved.bookings || structuredClone(DEFAULT_BOOKINGS),
      versions: saved.versions || [
        { id:'balanced', name:'Balanced Ireland + Scotland', enabledIds:fallbackEnabled },
        { id:'scotland-heavy', name:'Scotland-heavy draft', enabledIds:fallbackEnabled.filter(id => id !== 'galway-alt' && id !== 'clonmacnoise') },
        { id:'final', name:'Final locked route', enabledIds:fallbackEnabled }
      ],
      currentVersionId: saved.currentVersionId || 'balanced',
      dark: !!saved.dark
    };
  } catch {
    const fallbackEnabled = STOPS.filter(s => s.enabled).map(s => s.id);
    return { stops: structuredClone(STOPS), blocks: structuredClone(BLOCKS), bookings: structuredClone(DEFAULT_BOOKINGS), versions:[{id:'balanced',name:'Balanced Ireland + Scotland',enabledIds:fallbackEnabled}], currentVersionId:'balanced', dark:false };
  }
}
function save(){ localStorage.setItem(STORE, JSON.stringify(state)); }
function currentVersion(){ return state.versions.find(v => v.id === state.currentVersionId) || state.versions[0]; }
function isStopEnabled(id){ return currentVersion().enabledIds.includes(id); }
function setStopEnabled(id, enabled){
  const version = currentVersion();
  version.enabledIds = enabled ? Array.from(new Set([...version.enabledIds, id])) : version.enabledIds.filter(x => x !== id);
}
function activeStops(){ return state.stops.filter(s => isStopEnabled(s.id)).filter(s => !hotelsOnly || ['sleep','airport','ferry'].includes(s.type)).sort((a,b) => a.day - b.day || a.name.localeCompare(b.name)); }

function initTabs(){
  document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      button.classList.add('active');
      $(`view-${button.dataset.view}`).classList.add('active');
      if(button.dataset.view === 'map' && map) setTimeout(() => map.invalidateSize(), 80);
      if(button.dataset.view === 'readiness') renderReadiness();
    });
  });
}
function renderVersions(){
  const options = state.versions.map(v => `<option value="${v.id}" ${v.id===state.currentVersionId?'selected':''}>${esc(v.name)}</option>`).join('');
  $('versionSelect').innerHTML = options;
  $('builderVersionSelect').innerHTML = options;
  $('versionName').value = currentVersion().name;
}
function changeVersion(id){ state.currentVersionId = id; save(); renderAll(); redrawMap(); fitRoute(); }
function duplicateVersion(){
  const base = currentVersion();
  const copy = { id:uid('version'), name:`${base.name} copy`, enabledIds:[...base.enabledIds] };
  state.versions.push(copy); state.currentVersionId = copy.id; save(); renderAll(); redrawMap(); fitRoute();
}
function renameVersion(){ currentVersion().name = $('versionName').value.trim() || currentVersion().name; save(); renderAll(); }
function deleteVersion(){
  if(state.versions.length <= 1) return alert('Keep at least one route version.');
  if(!confirm('Delete this route version?')) return;
  state.versions = state.versions.filter(v => v.id !== state.currentVersionId);
  state.currentVersionId = state.versions[0].id; save(); renderAll(); redrawMap(); fitRoute();
}

function initMap(){
  if(!window.L) return;
  map = L.map('map').setView([54.6,-6.0],6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ maxZoom:19, attribution:'&copy; OpenStreetMap contributors' }).addTo(map);
  redrawMap(); fitRoute();
}
function redrawMap(){
  if(!map) return;
  markers.forEach(marker => map.removeLayer(marker)); markers = [];
  if(routeLine) map.removeLayer(routeLine);
  const stops = activeStops();
  const points = stops.map(s => [s.lat,s.lng]);
  if(points.length) routeLine = L.polyline(points,{ color:'#123b25', weight:4, opacity:.75 }).addTo(map);
  stops.forEach(stop => {
    const icon = L.divIcon({ className:'', html:`<div class="marker ${stop.id === selectedId ? 'selected' : ''}">${stop.day}</div>`, iconSize:[28,28], iconAnchor:[14,14] });
    const marker = L.marker([stop.lat,stop.lng],{ icon }).addTo(map);
    marker.on('click', () => selectStop(stop.id, true));
    marker.bindPopup(`<b>Day ${stop.day} · ${esc(stop.name)}</b><br>${esc(stop.description)}<br><em>${esc(stop.region)} · ${esc(stop.type)}</em>`);
    markers.push(marker);
  });
}
function fitRoute(){ const points = activeStops().map(s => [s.lat,s.lng]); if(map && points.length) map.fitBounds(points,{ padding:[45,45] }); }
function selectStop(id, pan=false){
  selectedId = id;
  const stop = state.stops.find(s => s.id === id); if(!stop) return;
  $('selectedStop').innerHTML = `<h3>${esc(stop.name)}</h3><p class="small">Day ${stop.day} · ${esc(stop.country)} · ${esc(stop.region)} · ${esc(stop.type)}</p><p>${esc(stop.description)}</p><div class="actions"><button data-edit-stop="${stop.id}">Edit</button><button data-toggle-stop="${stop.id}">${isStopEnabled(stop.id) ? 'Disable' : 'Enable'}</button></div>`;
  if(pan && map) map.setView([stop.lat,stop.lng], Math.max(map.getZoom(),9), { animate:true });
  renderAll(); redrawMap();
}
function toggleStop(id){ setStopEnabled(id, !isStopEnabled(id)); save(); renderAll(); redrawMap(); renderReadiness(); }
function deleteStop(id){ if(confirm('Delete this stop?')){ state.stops = state.stops.filter(s => s.id !== id); state.versions.forEach(v => v.enabledIds = v.enabledIds.filter(x => x !== id)); save(); renderAll(); redrawMap(); renderReadiness(); } }
function editStop(id){
  const stop = state.stops.find(s => s.id === id); if(!stop) return;
  const form = $('stopForm');
  form.elements.id.value = stop.id; form.elements.name.value = stop.name; form.elements.day.value = stop.day; form.elements.lat.value = stop.lat; form.elements.lng.value = stop.lng; form.elements.country.value = stop.country; form.elements.region.value = stop.region; form.elements.type.value = stop.type; form.elements.enabled.value = String(isStopEnabled(stop.id)); form.elements.description.value = stop.description;
  document.querySelector('[data-view="builder"]').click();
}
function saveStop(event){
  event.preventDefault();
  const f = event.currentTarget.elements;
  const stop = { id:f.id.value || uid('stop'), name:f.name.value.trim() || 'New stop', day:Number(f.day.value || 1), lat:Number(f.lat.value), lng:Number(f.lng.value), country:f.country.value.trim() || 'Unknown', region:f.region.value.trim() || 'Custom', type:f.type.value, description:f.description.value.trim() || 'Custom stop.' };
  if(!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) return alert('Latitude and longitude are required.');
  const index = state.stops.findIndex(s => s.id === stop.id);
  if(index >= 0) state.stops[index] = stop; else state.stops.push(stop);
  setStopEnabled(stop.id, f.enabled.value === 'true');
  event.currentTarget.reset(); f.id.value = ''; save(); renderAll(); redrawMap(); fitRoute(); renderReadiness();
}

const CAL_START = '2026-07-23';
const CAL_DAYS = 16;
function addDays(date,n){ const d = new Date(date+'T00:00:00'); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); }
function diffDays(a,b){ return Math.round((new Date(b+'T00:00:00') - new Date(a+'T00:00:00')) / 86400000); }
function fmt(date){ return new Date(date+'T00:00:00').toLocaleDateString('en-US',{ month:'short', day:'numeric' }); }
function dow(date){ return new Date(date+'T00:00:00').toLocaleDateString('en-US',{ weekday:'short' }); }
function coveredNights(){
  const nights = [];
  for(let i=1;i<CAL_DAYS-1;i++){
    const date = addDays(CAL_START,i);
    if(date < '2026-07-24' || date > '2026-08-06') continue;
    const covering = state.blocks.filter(b => b.type === 'hotel' && b.start <= date && b.end > date);
    nights.push({ date, covering });
  }
  return nights;
}
function renderCalendar(){
  const dates = Array.from({ length:CAL_DAYS }, (_,i) => addDays(CAL_START,i));
  const blocks = state.blocks.filter(b => !calendarHotelsOnly || b.type === 'hotel');
  const header = `<div class="cal-head"><div>Block</div>${dates.map(d => `<div><b>${fmt(d)}</b><br>${dow(d)}</div>`).join('')}</div>`;
  const rows = blocks.map(b => {
    const start = Math.max(0,diffDays(CAL_START,b.start));
    let end = diffDays(CAL_START,b.end); if(b.type === 'ferry') end = start + 1; end = Math.max(start+1, Math.min(CAL_DAYS,end));
    const span = end - start;
    const cells = dates.map(() => '<div class="cal-cell"></div>').join('');
    const nights = b.type === 'hotel' ? `${diffDays(b.start,b.end)} night(s)` : b.type;
    return `<div class="cal-row"><div class="cal-label"><b>${esc(b.label)}</b><span>${esc(nights)}</span></div>${cells}<div class="cal-block ${esc(b.color)}" style="grid-column:${start+2}/span ${span};grid-row:1" title="${esc(b.note)}">${esc(b.label)}</div></div>`;
  }).join('');
  $('calendarGrid').innerHTML = header + rows; renderCoverage();
}
function renderCoverage(){
  $('coverageGrid').innerHTML = coveredNights().map(n => {
    const cls = n.covering.length === 1 ? 'good' : n.covering.length === 0 ? 'bad' : 'warn';
    const text = n.covering.length === 1 ? n.covering[0].label : n.covering.length === 0 ? 'No stay shown' : n.covering.map(x => x.label).join(' + ');
    return `<div class="coverage-item ${cls}"><b>${fmt(n.date)} night</b><p class="small">${esc(text)}</p></div>`;
  }).join('');
}
function saveBlock(event){
  event.preventDefault();
  const f = event.currentTarget.elements;
  const block = { id:f.id.value || uid('block'), label:f.label.value.trim() || 'New stay', type:f.type.value, start:f.start.value, end:f.end.value, color:f.color.value, cost:f.cost.value.trim(), note:f.note.value.trim() };
  const index = state.blocks.findIndex(b => b.id === block.id);
  if(index >= 0) state.blocks[index] = block; else state.blocks.push(block);
  event.currentTarget.reset(); f.id.value = ''; save(); renderAll(); renderReadiness();
}
function deleteBlock(id){ if(confirm('Delete this calendar block?')){ state.blocks = state.blocks.filter(b => b.id !== id); save(); renderAll(); renderReadiness(); } }

function saveBooking(event){
  event.preventDefault();
  const f = event.currentTarget.elements;
  const booking = { id:f.id.value || uid('booking'), title:f.title.value.trim() || 'New booking', category:f.category.value, status:f.status.value, date:f.date.value, cost:f.cost.value.trim(), confirmation:f.confirmation.value.trim(), link:f.link.value.trim(), deadline:f.deadline.value, notes:f.notes.value.trim() };
  const index = state.bookings.findIndex(b => b.id === booking.id);
  if(index >= 0) state.bookings[index] = booking; else state.bookings.push(booking);
  event.currentTarget.reset(); f.id.value = ''; save(); renderBookings(); renderReadiness();
}
function editBooking(id){
  const b = state.bookings.find(x => x.id === id); if(!b) return;
  const f = $('bookingForm').elements;
  f.id.value = b.id; f.title.value = b.title; f.category.value = b.category; f.status.value = b.status; f.date.value = b.date || ''; f.cost.value = b.cost || ''; f.confirmation.value = b.confirmation || ''; f.link.value = b.link || ''; f.deadline.value = b.deadline || ''; f.notes.value = b.notes || '';
}
function deleteBooking(id){ if(confirm('Delete this booking?')){ state.bookings = state.bookings.filter(b => b.id !== id); save(); renderBookings(); renderReadiness(); } }
function statusClass(status){ return ['booked','paid'].includes(status) ? 'good' : status === 'researching' ? 'warn' : 'bad'; }
function renderBookings(){
  const counts = state.bookings.reduce((acc,b) => { acc[b.status] = (acc[b.status]||0)+1; return acc; }, {});
  const totalCost = state.bookings.reduce((sum,b) => sum + (Number(String(b.cost).replace(/[^0-9.]/g,'')) || 0), 0);
  $('bookingSummary').innerHTML = `<div class="stat-card"><b>${state.bookings.length}</b><span class="small">total items</span></div><div class="stat-card"><b>${counts.booked || 0}</b><span class="small">booked</span></div><div class="stat-card"><b>${counts.paid || 0}</b><span class="small">paid</span></div><div class="stat-card"><b>$${Math.round(totalCost)}</b><span class="small">tracked cost</span></div>`;
  $('bookingList').innerHTML = state.bookings.map(b => `<div class="booking-card"><div><b>${esc(b.title)}</b><p class="small">${esc(b.category)} · ${esc(b.date || 'no date')} ${b.deadline ? '· cancel by '+esc(b.deadline) : ''}</p><span class="status-pill ${statusClass(b.status)}">${esc(b.status)}</span>${b.cost ? `<span class="status-pill">${esc(b.cost)}</span>` : ''}${b.confirmation ? `<span class="status-pill"># ${esc(b.confirmation)}</span>` : ''}<p class="small">${esc(b.notes || '')}</p></div><div class="actions"><button data-edit-booking="${b.id}">Edit</button><button class="danger" data-delete-booking="${b.id}">Delete</button></div></div>`).join('');
}

function readinessData(){
  const issues = [];
  const wins = [];
  const nights = coveredNights();
  const gaps = nights.filter(n => n.covering.length === 0);
  const overlaps = nights.filter(n => n.covering.length > 1);
  if(gaps.length) issues.push(`${gaps.length} lodging night(s) have no stay shown.`); else wins.push('Every trip night has lodging coverage.');
  if(overlaps.length) issues.push(`${overlaps.length} night(s) have overlapping lodging.`); else wins.push('No lodging overlaps detected.');
  if(activeStops().length < 8) issues.push('Current route version has very few enabled stops.'); else wins.push(`${activeStops().length} stops enabled in current route version.`);
  const important = ['ferry','rental car','admin','lodging'];
  const criticalOpen = state.bookings.filter(b => important.includes(b.category) && !['booked','paid'].includes(b.status));
  if(criticalOpen.length) issues.push(`${criticalOpen.length} critical booking item(s) are not booked or paid.`); else wins.push('Critical lodging/admin/transport bookings are marked booked or paid.');
  const ferryStop = activeStops().some(s => s.type === 'ferry');
  if(!ferryStop) issues.push('Current route version has no ferry stop enabled.'); else wins.push('Ferry transition is represented in the map route.');
  const skyeEnabled = activeStops().some(s => s.region === 'Skye');
  const skyeBooked = state.bookings.some(b => b.title.toLowerCase().includes('skye') && ['booked','paid'].includes(b.status));
  if(skyeEnabled && !skyeBooked) issues.push('Skye is in the route, but Skye lodging is not marked booked.');
  const totalChecks = 6;
  const score = Math.max(0, Math.round(((totalChecks - issues.length) / totalChecks) * 100));
  return { issues, wins, score };
}
function renderReadiness(){
  if(!$('readinessScore')) return;
  const data = readinessData();
  $('readinessScore').textContent = `${data.score}%`;
  $('readinessIssues').innerHTML = data.issues.length ? data.issues.map(x => `<div class="issue-card bad">${esc(x)}</div>`).join('') : '<div class="issue-card good">Nothing major is currently flagged.</div>';
  $('readinessWins').innerHTML = data.wins.length ? data.wins.map(x => `<div class="issue-card good">${esc(x)}</div>`).join('') : '<div class="issue-card">No wins calculated yet.</div>';
}

function renderStopList(){
  const q = $('stopSearch').value.toLowerCase().trim();
  const stops = state.stops.filter(s => !q || JSON.stringify(s).toLowerCase().includes(q)).sort((a,b)=>a.day-b.day || a.name.localeCompare(b.name));
  $('stopList').innerHTML = stops.map(s => `<div class="stop-card ${isStopEnabled(s.id) ? '' : 'off'}" data-select-stop="${s.id}"><input type="checkbox" ${isStopEnabled(s.id)?'checked':''} data-toggle-stop="${s.id}"><div><b>Day ${String(s.day).padStart(2,'0')} · ${esc(s.name)}</b><span>${esc(s.region)} · ${esc(s.type)}</span></div><button data-edit-stop="${s.id}">Edit</button></div>`).join('');
}
function renderBuilderStops(){
  $('builderStops').innerHTML = state.stops.slice().sort((a,b)=>a.day-b.day || a.name.localeCompare(b.name)).map(s => `<div class="stop-card ${isStopEnabled(s.id)?'':'off'}"><input type="checkbox" ${isStopEnabled(s.id)?'checked':''} data-toggle-stop="${s.id}"><div><b>Day ${String(s.day).padStart(2,'0')} · ${esc(s.name)}</b><span>${esc(s.country)} · ${esc(s.region)} · ${esc(s.type)}</span></div><div><button data-edit-stop="${s.id}">Edit</button><button class="danger" data-delete-stop="${s.id}">Delete</button></div></div>`).join('');
}
function renderBuilderBlocks(){
  $('builderBlocks').innerHTML = state.blocks.map(b => `<div class="stop-card"><div></div><div><b>${esc(b.label)}</b><span>${fmt(b.start)} → ${fmt(b.end)} · ${esc(b.type)} · ${esc(b.color)}</span></div><button class="danger" data-delete-block="${b.id}">Delete</button></div>`).join('');
}
function routeSummary(){
  const route = activeStops().map(s => `Day ${s.day}: ${s.name}`).join('\n');
  const stays = state.blocks.filter(b => b.type === 'hotel').map(b => `${b.start} to ${b.end}: ${b.label}`).join('\n');
  const bookings = state.bookings.map(b => `${b.title}: ${b.status}`).join('\n');
  return `Route version: ${currentVersion().name}\n\nRoute stops:\n${route}\n\nLodging blocks:\n${stays}\n\nBookings:\n${bookings}`;
}
function checkGapsText(){
  return coveredNights().map(n => `${fmt(n.date)} night: ${n.covering.length ? n.covering.map(x=>x.label).join(' + ') : 'NO STAY SHOWN'}`).join('\n');
}
function addMessage(text,user=false){
  const div = document.createElement('div'); div.className = `msg ${user ? 'user' : ''}`; div.innerHTML = esc(text).replaceAll('\n','<br>'); $('messages').appendChild(div); $('messages').scrollTop = $('messages').scrollHeight;
}
function plannerReply(q){
  const text = q.toLowerCase();
  if(text.includes('ready')){ const d = readinessData(); return `Readiness: ${d.score}%\n\nNeeds attention:\n${d.issues.join('\n') || 'Nothing major flagged.'}`; }
  if(text.includes('gap') || text.includes('calendar') || text.includes('hotel') || text.includes('stay')) return checkGapsText();
  if(text.includes('book')) return 'Book first: Dublin/Galway/Doolin/Belfast lodging, Belfast to Cairnryan ferry, rental car strategy, UK ETA, Kilmainham, Trinity/Book of Kells, and Scotland lodging if Skye stays in.';
  if(text.includes('dublin')) return 'For this route, 2 nights in Dublin is cleaner than 3 because you need to protect Galway, Cliffs/Doolin, Belfast, the ferry, and Scotland time.';
  if(text.includes('ferry') || text.includes('rental') || text.includes('car')) return 'Main transport decision: one rental car on the Belfast to Cairnryan ferry, or separate Ireland and Scotland rentals. Separate rentals are cleaner administratively; one car is easier with luggage if allowed.';
  if(text.includes('skye')) return 'Skye is worth it only if you can give it breathing room. Avoid a one-night drive-by unless you accept an aggressive Scotland segment.';
  if(text.includes('prompt')) return 'Paste this into ChatGPT:\n\nHelp me refine this trip in Atlast. I want minimal hotel chaos, strong scenery, and full lodging coverage. Current app state:\n\n' + routeSummary();
  return 'I can help with route pacing, lodging gaps, readiness, booking priorities, ferry/rental strategy, Dublin vs Doolin decisions, and Scotland pacing.';
}
function sendAgent(){ const input = $('agentInput'); const q = input.value.trim(); if(!q) return; addMessage(q,true); input.value=''; setTimeout(()=>addMessage(plannerReply(q)),120); }
function exportJson(){ const blob = new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'atlast-trip-state.json'; a.click(); }
function resetApp(){ if(!confirm('Reset all app data?')) return; localStorage.removeItem(STORE); state = loadState(); renderAll(); redrawMap(); fitRoute(); renderReadiness(); }
function renderAll(){ renderVersions(); renderStopList(); renderBuilderStops(); renderCalendar(); renderBuilderBlocks(); renderBookings(); renderReadiness(); }
function bindEvents(){
  initTabs();
  $('fitRoute').addEventListener('click', fitRoute);
  $('toggleHotels').addEventListener('click', () => { hotelsOnly = !hotelsOnly; $('toggleHotels').classList.toggle('primary',hotelsOnly); redrawMap(); renderStopList(); fitRoute(); });
  $('toggleTheme').addEventListener('click', () => { document.body.classList.toggle('dark'); state.dark = document.body.classList.contains('dark'); save(); });
  $('versionSelect').addEventListener('change', event => changeVersion(event.target.value));
  $('builderVersionSelect').addEventListener('change', event => changeVersion(event.target.value));
  $('duplicateVersion').addEventListener('click', duplicateVersion);
  $('renameVersion').addEventListener('click', renameVersion);
  $('deleteVersion').addEventListener('click', deleteVersion);
  $('stopSearch').addEventListener('input', renderStopList);
  $('stopForm').addEventListener('submit', saveStop);
  $('clearStopForm').addEventListener('click', () => $('stopForm').reset());
  $('blockForm').addEventListener('submit', saveBlock);
  $('clearBlockForm').addEventListener('click', () => $('blockForm').reset());
  $('bookingForm').addEventListener('submit', saveBooking);
  $('clearBookingForm').addEventListener('click', () => $('bookingForm').reset());
  $('showAllBlocks').addEventListener('click', () => { calendarHotelsOnly = false; $('showAllBlocks').classList.add('primary'); $('showHotelBlocks').classList.remove('primary'); renderCalendar(); });
  $('showHotelBlocks').addEventListener('click', () => { calendarHotelsOnly = true; $('showHotelBlocks').classList.add('primary'); $('showAllBlocks').classList.remove('primary'); renderCalendar(); });
  $('jumpAddStay').addEventListener('click', () => document.querySelector('[data-view="builder"]').click());
  $('exportJson').addEventListener('click', exportJson);
  $('resetApp').addEventListener('click', resetApp);
  $('sendAgent').addEventListener('click', sendAgent);
  $('agentInput').addEventListener('keydown', event => { if(event.key === 'Enter') sendAgent(); });
  document.addEventListener('click', event => {
    const select = event.target.closest('[data-select-stop]'); if(select) selectStop(select.dataset.selectStop,true);
    const toggle = event.target.closest('[data-toggle-stop]'); if(toggle){ event.stopPropagation(); toggleStop(toggle.dataset.toggleStop); }
    const edit = event.target.closest('[data-edit-stop]'); if(edit){ event.stopPropagation(); editStop(edit.dataset.editStop); }
    const del = event.target.closest('[data-delete-stop]'); if(del){ event.stopPropagation(); deleteStop(del.dataset.deleteStop); }
    const delBlock = event.target.closest('[data-delete-block]'); if(delBlock){ event.stopPropagation(); deleteBlock(delBlock.dataset.deleteBlock); }
    const editBookingBtn = event.target.closest('[data-edit-booking]'); if(editBookingBtn){ event.stopPropagation(); editBooking(editBookingBtn.dataset.editBooking); }
    const delBookingBtn = event.target.closest('[data-delete-booking]'); if(delBookingBtn){ event.stopPropagation(); deleteBooking(delBookingBtn.dataset.deleteBooking); }
  });
}
function init(){
  if(state.dark) document.body.classList.add('dark');
  bindEvents();
  addMessage('Planner helper ready. Ask about gaps, readiness, bookings, ferry logistics, Skye pacing, or type “prompt” to generate a planning prompt from your route.');
  renderAll(); initMap();
}
document.addEventListener('DOMContentLoaded', init);
