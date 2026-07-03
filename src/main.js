const STOPS = [
  ['dub-air',1,'Dublin Airport','Ireland','Dublin',53.4264,-6.2499,'airport','Arrive in Ireland and transfer into Dublin.',true],
  ['dub-city',1,'Dublin City Centre','Ireland','Dublin',53.3498,-6.2603,'sleep','First Dublin base.',true],
  ['trinity',2,'Trinity / Book of Kells','Ireland','Dublin',53.3438,-6.2546,'book','Core Dublin booking.',true],
  ['kilmainham',2,'Kilmainham Gaol','Ireland','Dublin',53.3420,-6.3099,'book','Must-book Dublin history stop.',true],
  ['galway',3,'Galway','Ireland','West Ireland',53.2707,-9.0568,'sleep','West coast city base.',true],
  ['clonmacnoise',3,'Clonmacnoise','Ireland','West Ireland',53.3277,-7.9865,'optional','Optional monastic stop.',false],
  ['moher',4,'Cliffs of Moher','Ireland','West Ireland',52.9715,-9.4309,'sight','West coast headline stop.',true],
  ['doolin',4,'Doolin','Ireland','West Ireland',53.0167,-9.3775,'sleep','Recommended sleep after the Cliffs.',true],
  ['belfast',5,'Belfast','Northern Ireland','Northern Ireland',54.5973,-5.9301,'sleep','Base before Causeway and ferry.',true],
  ['causeway',6,'Giant’s Causeway','Northern Ireland','Northern Ireland',55.2408,-6.5116,'sight','Basalt columns on Antrim Coast.',true],
  ['belfast-ferry',7,'Belfast Ferry Terminal','Northern Ireland','Ferry',54.6310,-5.8920,'ferry','Belfast to Cairnryan ferry.',true],
  ['cairnryan',7,'Cairnryan Ferry Port','Scotland','Ferry',54.9683,-5.0144,'ferry','Arrive in Scotland.',true],
  ['glasgow',7,'Glasgow','Scotland','Lowlands',55.8642,-4.2518,'sleep','First Scotland overnight.',true],
  ['loch-lomond',8,'Loch Lomond','Scotland','Lowlands',56.0790,-4.6190,'sight','Scenic start to Scotland.',true],
  ['glencoe',9,'Glencoe','Scotland','Highlands',56.6826,-5.1023,'sight','Cinematic Highlands valley.',true],
  ['fort-william',9,'Fort William','Scotland','Highlands',56.8198,-5.1052,'sleep','Practical Highlands base.',true],
  ['portree',10,'Portree / Isle of Skye','Scotland','Skye',57.4125,-6.1942,'sleep','Skye base placeholder.',true],
  ['storr',11,'Old Man of Storr','Scotland','Skye',57.5065,-6.1831,'hike','Classic Skye viewpoint.',true],
  ['inverness',12,'Inverness','Scotland','Highlands',57.4778,-4.2247,'sleep','Highlands city base.',true],
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
  ['skye-stay','Isle of Skye','hotel','2026-08-02','2026-08-04','indigo','Draft Skye block.'],
  ['edin-stay','Edinburgh','hotel','2026-08-05','2026-08-07','pink','Final Scotland city base.']
].map(([id,label,type,start,end,color,note]) => ({ id, label, type, start, end, color, note }));

const STORE = 'atlast-static-v1';
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
    return { stops: saved.stops || structuredClone(STOPS), blocks: saved.blocks || structuredClone(BLOCKS), dark: !!saved.dark };
  } catch {
    return { stops: structuredClone(STOPS), blocks: structuredClone(BLOCKS), dark: false };
  }
}
function save(){ localStorage.setItem(STORE, JSON.stringify(state)); }
function activeStops(){ return state.stops.filter(s => s.enabled).filter(s => !hotelsOnly || ['sleep','airport','ferry'].includes(s.type)).sort((a,b) => a.day - b.day || a.name.localeCompare(b.name)); }

function initTabs(){
  document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      button.classList.add('active');
      $(`view-${button.dataset.view}`).classList.add('active');
      if(button.dataset.view === 'map' && map) setTimeout(() => map.invalidateSize(), 80);
    });
  });
}

function initMap(){
  if(!window.L) return;
  map = L.map('map').setView([54.6,-6.0],6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ maxZoom:19, attribution:'&copy; OpenStreetMap contributors' }).addTo(map);
  redrawMap();
  fitRoute();
}
function redrawMap(){
  if(!map) return;
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
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
  const stop = state.stops.find(s => s.id === id);
  if(!stop) return;
  $('selectedStop').innerHTML = `<h3>${esc(stop.name)}</h3><p class="small">Day ${stop.day} · ${esc(stop.country)} · ${esc(stop.region)} · ${esc(stop.type)}</p><p>${esc(stop.description)}</p><div class="actions"><button data-edit-stop="${stop.id}">Edit</button><button data-toggle-stop="${stop.id}">${stop.enabled ? 'Disable' : 'Enable'}</button></div>`;
  if(pan && map) map.setView([stop.lat,stop.lng], Math.max(map.getZoom(),9), { animate:true });
  renderAll();
  redrawMap();
}
function toggleStop(id){ const stop = state.stops.find(s => s.id === id); if(stop){ stop.enabled = !stop.enabled; save(); renderAll(); redrawMap(); } }
function deleteStop(id){ if(confirm('Delete this stop?')){ state.stops = state.stops.filter(s => s.id !== id); save(); renderAll(); redrawMap(); } }
function editStop(id){
  const stop = state.stops.find(s => s.id === id); if(!stop) return;
  const form = $('stopForm');
  form.elements.id.value = stop.id; form.elements.name.value = stop.name; form.elements.day.value = stop.day; form.elements.lat.value = stop.lat; form.elements.lng.value = stop.lng; form.elements.country.value = stop.country; form.elements.region.value = stop.region; form.elements.type.value = stop.type; form.elements.enabled.value = String(stop.enabled); form.elements.description.value = stop.description;
  document.querySelector('[data-view="builder"]').click();
}
function saveStop(event){
  event.preventDefault();
  const f = event.currentTarget.elements;
  const stop = { id:f.id.value || uid('stop'), name:f.name.value.trim() || 'New stop', day:Number(f.day.value || 1), lat:Number(f.lat.value), lng:Number(f.lng.value), country:f.country.value.trim() || 'Unknown', region:f.region.value.trim() || 'Custom', type:f.type.value, enabled:f.enabled.value === 'true', description:f.description.value.trim() || 'Custom stop.' };
  if(!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) return alert('Latitude and longitude are required.');
  const index = state.stops.findIndex(s => s.id === stop.id);
  if(index >= 0) state.stops[index] = stop; else state.stops.push(stop);
  event.currentTarget.reset(); f.id.value = ''; save(); renderAll(); redrawMap(); fitRoute();
}

const CAL_START = '2026-07-23';
const CAL_DAYS = 16;
function addDays(date,n){ const d = new Date(date+'T00:00:00'); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); }
function diffDays(a,b){ return Math.round((new Date(b+'T00:00:00') - new Date(a+'T00:00:00')) / 86400000); }
function fmt(date){ return new Date(date+'T00:00:00').toLocaleDateString('en-US',{ month:'short', day:'numeric' }); }
function dow(date){ return new Date(date+'T00:00:00').toLocaleDateString('en-US',{ weekday:'short' }); }
function renderCalendar(){
  const dates = Array.from({ length:CAL_DAYS }, (_,i) => addDays(CAL_START,i));
  const blocks = state.blocks.filter(b => !calendarHotelsOnly || b.type === 'hotel');
  const header = `<div class="cal-head"><div>Block</div>${dates.map(d => `<div><b>${fmt(d)}</b><br>${dow(d)}</div>`).join('')}</div>`;
  const rows = blocks.map(b => {
    const start = Math.max(0,diffDays(CAL_START,b.start));
    let end = diffDays(CAL_START,b.end);
    if(b.type === 'ferry') end = start + 1;
    end = Math.max(start+1, Math.min(CAL_DAYS,end));
    const span = end - start;
    const cells = dates.map(() => '<div class="cal-cell"></div>').join('');
    const nights = b.type === 'hotel' ? `${diffDays(b.start,b.end)} night(s)` : b.type;
    return `<div class="cal-row"><div class="cal-label"><b>${esc(b.label)}</b><span>${esc(nights)}</span></div>${cells}<div class="cal-block ${esc(b.color)}" style="grid-column:${start+2}/span ${span};grid-row:1" title="${esc(b.note)}">${esc(b.label)}</div></div>`;
  }).join('');
  $('calendarGrid').innerHTML = header + rows;
  renderCoverage();
}
function renderCoverage(){
  const nights = [];
  for(let i=1;i<CAL_DAYS-1;i++){
    const date = addDays(CAL_START,i);
    if(date < '2026-07-24' || date > '2026-08-06') continue;
    const covering = state.blocks.filter(b => b.type === 'hotel' && b.start <= date && b.end > date);
    nights.push({ date, covering });
  }
  $('coverageGrid').innerHTML = nights.map(n => {
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
  event.currentTarget.reset(); f.id.value = ''; save(); renderAll();
}
function deleteBlock(id){ if(confirm('Delete this calendar block?')){ state.blocks = state.blocks.filter(b => b.id !== id); save(); renderAll(); } }
function renderStopList(){
  const q = $('stopSearch').value.toLowerCase().trim();
  const stops = state.stops.filter(s => !q || JSON.stringify(s).toLowerCase().includes(q)).sort((a,b)=>a.day-b.day || a.name.localeCompare(b.name));
  $('stopList').innerHTML = stops.map(s => `<div class="stop-card ${s.enabled ? '' : 'off'}" data-select-stop="${s.id}"><input type="checkbox" ${s.enabled?'checked':''} data-toggle-stop="${s.id}"><div><b>Day ${String(s.day).padStart(2,'0')} · ${esc(s.name)}</b><span>${esc(s.region)} · ${esc(s.type)}</span></div><button data-edit-stop="${s.id}">Edit</button></div>`).join('');
}
function renderBuilderStops(){
  $('builderStops').innerHTML = state.stops.slice().sort((a,b)=>a.day-b.day || a.name.localeCompare(b.name)).map(s => `<div class="stop-card ${s.enabled?'':'off'}"><input type="checkbox" ${s.enabled?'checked':''} data-toggle-stop="${s.id}"><div><b>Day ${String(s.day).padStart(2,'0')} · ${esc(s.name)}</b><span>${esc(s.country)} · ${esc(s.region)} · ${esc(s.type)}</span></div><div><button data-edit-stop="${s.id}">Edit</button><button class="danger" data-delete-stop="${s.id}">Delete</button></div></div>`).join('');
}
function renderBuilderBlocks(){
  $('builderBlocks').innerHTML = state.blocks.map(b => `<div class="stop-card"><div></div><div><b>${esc(b.label)}</b><span>${fmt(b.start)} → ${fmt(b.end)} · ${esc(b.type)} · ${esc(b.color)}</span></div><button class="danger" data-delete-block="${b.id}">Delete</button></div>`).join('');
}
function routeSummary(){
  const route = activeStops().map(s => `Day ${s.day}: ${s.name}`).join('\n');
  const stays = state.blocks.filter(b => b.type === 'hotel').map(b => `${b.start} → ${b.end}: ${b.label}`).join('\n');
  return `Route stops:\n${route}\n\nLodging blocks:\n${stays}`;
}
function checkGapsText(){
  const lines = [];
  for(let i=1;i<CAL_DAYS-1;i++){
    const date = addDays(CAL_START,i);
    if(date < '2026-07-24' || date > '2026-08-06') continue;
    const covering = state.blocks.filter(b => b.type === 'hotel' && b.start <= date && b.end > date);
    lines.push(`${fmt(date)} night: ${covering.length ? covering.map(x=>x.label).join(' + ') : 'NO STAY SHOWN'}`);
  }
  return lines.join('\n');
}
function addMessage(text,user=false){
  const div = document.createElement('div');
  div.className = `msg ${user ? 'user' : ''}`;
  div.innerHTML = esc(text).replaceAll('\n','<br>');
  $('messages').appendChild(div);
  $('messages').scrollTop = $('messages').scrollHeight;
}
function plannerReply(q){
  const text = q.toLowerCase();
  if(text.includes('gap') || text.includes('calendar') || text.includes('hotel') || text.includes('stay')) return checkGapsText();
  if(text.includes('dublin')) return 'For this route, 2 nights in Dublin is cleaner than 3 because you need to protect Galway, Cliffs/Doolin, Belfast, the ferry, and Scotland time.';
  if(text.includes('ferry') || text.includes('rental') || text.includes('car')) return 'Main transport decision: one rental car on the Belfast to Cairnryan ferry, or separate Ireland and Scotland rentals. Separate rentals are cleaner administratively; one car is easier with luggage if allowed.';
  if(text.includes('skye')) return 'Skye is worth it only if you can give it breathing room. Avoid a one-night drive-by unless you accept an aggressive Scotland segment.';
  if(text.includes('book')) return 'Book first: Dublin/Galway/Doolin/Belfast lodging, Belfast to Cairnryan ferry, rental car strategy, Kilmainham, Trinity/Book of Kells, and Scotland lodging if Skye stays in.';
  if(text.includes('prompt')) return 'Paste this into ChatGPT:\n\nHelp me refine this 14-day Ireland and Scotland route. I want minimal hotel chaos, strong scenery, and full lodging coverage. Current app state:\n\n' + routeSummary();
  return 'I can help with route pacing, lodging gaps, booking priorities, ferry/rental strategy, Dublin vs Doolin decisions, and Scotland pacing.';
}
function sendAgent(){ const input = $('agentInput'); const q = input.value.trim(); if(!q) return; addMessage(q,true); input.value=''; setTimeout(()=>addMessage(plannerReply(q)),120); }
function exportJson(){ const blob = new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'atlast-trip-state.json'; a.click(); }
function resetApp(){ if(!confirm('Reset all app data?')) return; localStorage.removeItem(STORE); state = loadState(); renderAll(); redrawMap(); fitRoute(); }
function renderAll(){ renderStopList(); renderBuilderStops(); renderCalendar(); renderBuilderBlocks(); }
function bindEvents(){
  initTabs();
  $('fitRoute').addEventListener('click', fitRoute);
  $('toggleHotels').addEventListener('click', () => { hotelsOnly = !hotelsOnly; $('toggleHotels').classList.toggle('primary',hotelsOnly); redrawMap(); renderStopList(); fitRoute(); });
  $('toggleTheme').addEventListener('click', () => { document.body.classList.toggle('dark'); state.dark = document.body.classList.contains('dark'); save(); });
  $('stopSearch').addEventListener('input', renderStopList);
  $('stopForm').addEventListener('submit', saveStop);
  $('clearStopForm').addEventListener('click', () => $('stopForm').reset());
  $('blockForm').addEventListener('submit', saveBlock);
  $('clearBlockForm').addEventListener('click', () => $('blockForm').reset());
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
  });
}
function init(){
  if(state.dark) document.body.classList.add('dark');
  bindEvents();
  addMessage('Planner helper ready. Ask about gaps, bookings, ferry logistics, Skye pacing, or type “prompt” to generate a planning prompt from your route.');
  renderAll();
  initMap();
}
document.addEventListener('DOMContentLoaded', init);
