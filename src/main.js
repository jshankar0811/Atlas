const TRIP = [
  {id:'flight-out',date:'2026-07-23',label:'Jul 23',title:'Fly to Dublin',place:'XNA → Dublin',lat:36.2819,lng:-94.3068,type:'flight',time:'Overnight',detail:'American Airlines outbound. Keep passport, charger, medications, and one change of clothes in your personal item.',status:'booked'},
  {id:'dublin',date:'2026-07-24',end:'2026-07-26',label:'Jul 24–26',title:'Dublin',place:'Beckett Locke',lat:53.3498,lng:-6.2603,type:'hotel',detail:'Two nights in Dublin. Arrival day should stay light; use Jul 25 for the main city sights.',status:'booked'},
  {id:'galway',date:'2026-07-26',end:'2026-07-28',label:'Jul 26–28',title:'Galway',place:'Eyre Square Townhouse',lat:53.2743,lng:-9.0491,type:'hotel',detail:'Two-night Galway base. Pick up or continue with the Ireland rental car and keep the west-coast pace easy.',status:'booked'},
  {id:'dingle',date:'2026-07-28',end:'2026-07-30',label:'Jul 28–30',title:'Dingle',place:'Lantern Townhouse',lat:52.1409,lng:-10.2689,type:'hotel',detail:'Two nights in Dingle. Prioritize Slea Head Drive and leave room for weather changes.',status:'booked'},
  {id:'killarney',date:'2026-07-30',end:'2026-07-31',label:'Jul 30–31',title:'Killarney',place:'The Heights Hotel',lat:52.0599,lng:-9.5044,type:'hotel',detail:'One night. Booking reference IREnjq3ndung-6474556. Use the afternoon for Killarney National Park if timing allows.',status:'booked',confirmation:'IREnjq3ndung-6474556'},
  {id:'drogheda',date:'2026-07-31',label:'Jul 31',title:'Return car in Drogheda',place:'Drogheda, Ireland',lat:53.7179,lng:-6.3561,type:'car',detail:'Drive from Killarney, return the Ireland rental car in Drogheda, then continue to Belfast by rail or bus. Leave a generous buffer.',status:'booked'},
  {id:'belfast',date:'2026-07-31',end:'2026-08-01',label:'Jul 31–Aug 1',title:'Belfast',place:'Titanic Hotel Belfast',lat:54.6082,lng:-5.9097,type:'hotel',detail:'One night before the ferry. Keep ferry documents and UK ETA accessible.',status:'booked'},
  {id:'ferry',date:'2026-08-01',label:'Aug 1',title:'Ferry to Scotland',place:'Belfast → Cairnryan',lat:54.6310,lng:-5.8920,type:'ferry',detail:'Stena Line sailing to Cairnryan. Confirm terminal transfer and required check-in time the night before.',status:'booked'},
  {id:'cairnryan',date:'2026-08-01',label:'Aug 1',title:'Arrive in Scotland',place:'Cairnryan',lat:54.9683,lng:-5.0144,type:'transfer',detail:'Continue from Cairnryan toward Glasgow. Verify the onward coach or transfer connection.',status:'booked'},
  {id:'glasgow',date:'2026-08-01',end:'2026-08-03',label:'Aug 1–3',title:'Glasgow',place:'Holiday Inn Express Glasgow Airport',lat:55.8642,lng:-4.4331,type:'hotel',detail:'Two nights with breakfast. Confirmation B_56773334. Aug 2 is the Highlands day.',status:'booked',confirmation:'B_56773334'},
  {id:'highlands',date:'2026-08-02',label:'Aug 2',title:'Highlands day',place:'Glencoe / Highlands',lat:56.6826,lng:-5.1023,type:'activity',detail:'Current decision: Rabbie’s Loch Ness, Glencoe & Highlands tour versus a one-day rental car focused on Loch Lomond and Glencoe.',status:'open'},
  {id:'train',date:'2026-08-03',label:'Aug 3',title:'Train to Edinburgh',place:'Glasgow → Edinburgh',lat:55.9533,lng:-3.1883,type:'train',detail:'ScotRail transfer. Keep ticket available offline and verify departure station and time.',status:'booked'},
  {id:'edinburgh',date:'2026-08-03',end:'2026-08-07',label:'Aug 3–7',title:'Edinburgh',place:'Hotel not yet verified',lat:55.9533,lng:-3.1883,type:'hotel',detail:'Final Scotland base. Lodging confirmation still needs to be added to Atlas.',status:'open'},
  {id:'flight-home',date:'2026-08-07',label:'Aug 7',title:'Fly home',place:'Edinburgh → United States',lat:55.9508,lng:-3.3615,type:'flight',detail:'Return flight. Check in when the airline window opens and allow extra airport time.',status:'booked'}
];

const BOOKINGS = [
  {title:'American Airlines outbound',category:'Flight',status:'booked',date:'Jul 23',confirmation:'NWNHLU',notes:'Overnight flight into Dublin.'},
  {title:'Beckett Locke',category:'Lodging',status:'booked',date:'Jul 24–26',notes:'Dublin base.'},
  {title:'Eyre Square Townhouse',category:'Lodging',status:'booked',date:'Jul 26–28',notes:'Galway base.'},
  {title:'Lantern Townhouse',category:'Lodging',status:'booked',date:'Jul 28–30',notes:'Dingle base.'},
  {title:'The Heights Hotel',category:'Lodging',status:'booked',date:'Jul 30–31',confirmation:'IREnjq3ndung-6474556',notes:'Killarney, 2 adults.'},
  {title:'Ireland rental car',category:'Rental car',status:'booked',date:'Ireland segment',notes:'Return confirmed in Drogheda. Add pickup/drop-off times when available.'},
  {title:'Titanic Hotel Belfast',category:'Lodging',status:'booked',date:'Jul 31–Aug 1',notes:'One night before ferry.'},
  {title:'Stena Line ferry',category:'Ferry',status:'booked',date:'Aug 1',notes:'Belfast to Cairnryan. Verify terminal arrival time and transfer.'},
  {title:'Holiday Inn Express Glasgow Airport',category:'Lodging',status:'booked',date:'Aug 1–3',confirmation:'B_56773334',notes:'Two nights; breakfast included.'},
  {title:'ScotRail Glasgow → Edinburgh',category:'Train',status:'booked',date:'Aug 3',notes:'Save ticket offline.'},
  {title:'Edinburgh lodging',category:'Lodging',status:'open',date:'Aug 3–7',notes:'Confirmation has not yet been verified.'},
  {title:'Highlands day plan',category:'Activity',status:'open',date:'Aug 2',notes:'Choose Rabbie’s tour or one-day car.'},
  {title:'Travel Guard insurance',category:'Insurance',status:'booked',date:'Full trip',notes:'Keep policy and assistance number offline.'}
];

const CHECKS = [
  {group:'Documents & admin',items:[
    ['eta','UK ETA approved for each traveler','Required for Northern Ireland and Scotland.'],
    ['passport','Passport valid and packed','Store a photo securely on your phone.'],
    ['insurance','Travel insurance policy saved offline','Include emergency assistance number.'],
    ['confirmations','All confirmations downloaded','Hotels, flights, ferry, train, and rental car.']
  ]},
  {group:'Transport',items:[
    ['car-times','Rental car pickup and Drogheda return times verified','Build in a large Jul 31 driving buffer.'],
    ['drogheda-transfer','Drogheda → Belfast transport selected','Train or bus after the car return.'],
    ['ferry-transfer','Belfast hotel → ferry terminal transfer planned','Check-in deadline matters.'],
    ['cairnryan-transfer','Cairnryan → Glasgow transfer confirmed','Do not assume easy walk-up transit.'],
    ['highlands','Aug 2 Highlands plan booked','Tour or rental car.']
  ]},
  {group:'Buy before leaving',items:[
    ['adapter','Type G travel adapter','Ireland and the UK use Type G plugs.'],
    ['powerbank','10,000–20,000 mAh power bank','Useful on long driving and ferry days.'],
    ['raincoat','Waterproof rain jacket','More useful than relying only on an umbrella.'],
    ['meds','Small travel medicine kit','Ibuprofen, Tylenol, Imodium, Pepto, allergy medicine, Band-Aids.'],
    ['airtags','AirTag or luggage tracker','Place one in each checked bag.'],
    ['compression','Compression socks','For the long flights.']
  ]},
  {group:'Pack',items:[
    ['shirts','7–8 casual shirts and 2 nicer shirts','Plan one laundry stop.'],
    ['layers','Light sweater or hoodie','Weather changes quickly.'],
    ['pants','3–4 versatile pants','Favor comfortable travel pants over heavy jeans.'],
    ['shoes','Walking shoes plus one nicer pair','Avoid bringing more than two main pairs.'],
    ['underwear','10–12 underwear and socks','Or reduce with laundry.'],
    ['daybag','Daypack with water bottle and rain shell','Keep passport and documents secure.'],
    ['toiletries','Travel toiletries and prescriptions','Keep prescriptions in original packaging.']
  ]},
  {group:'Phone & money',items:[
    ['esim','International roaming or eSIM active','Test before departure.'],
    ['offline-maps','Offline maps downloaded','Dublin, west Ireland, Belfast, Glasgow, Highlands, Edinburgh.'],
    ['wallet','Two credit cards plus debit card','Store backup card separately.'],
    ['apps','Airline, Stena Line, ScotRail, Google Maps and WhatsApp installed','Sign in before leaving.']
  ]}
];

const STORE='atlas-travel-ready-v1';
const oldStore='atlast-static-v2';
const $=id=>document.getElementById(id);
let checks=loadChecks();
let map,routeLine,markers=[];

function loadChecks(){try{return JSON.parse(localStorage.getItem(STORE)||'{}').checks||{}}catch{return {}}}
function saveChecks(){localStorage.setItem(STORE,JSON.stringify({checks,migratedFrom:localStorage.getItem(oldStore)?oldStore:null}))}
function fmtDate(date){return new Date(date+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}
function tripStatus(){const total=CHECKS.flatMap(g=>g.items).length;const done=Object.values(checks).filter(Boolean).length;return {total,done,score:Math.round(done/total*100)}}
function openItems(){return BOOKINGS.filter(b=>b.status==='open')}

function initTabs(){document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.view)));document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.go)))}
function showView(view){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===view));document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${view}`));if(view==='map'&&map)setTimeout(()=>{map.invalidateSize();fitRoute()},100)}

function renderToday(){const s=tripStatus();$('heroScore').textContent=`${s.score}%`;$('todayMetrics').innerHTML=`<div class="metric"><b>15 days</b><span>Jul 23–Aug 7</span></div><div class="metric"><b>9 bases</b><span>Ireland, NI & Scotland</span></div><div class="metric"><b>${BOOKINGS.filter(b=>b.status==='booked').length}</b><span>confirmed bookings</span></div><div class="metric"><b>${openItems().length}</b><span>loose ends</span></div>`;
$('nextCard').innerHTML=`<h2 style="margin:14px 0 6px">Complete final travel prep</h2><p class="muted">Apply for the UK ETA, verify Edinburgh lodging, choose the Highlands plan, and lock the Drogheda/Belfast/ferry transfers.</p><button class="primary" data-go="readiness">Open Mission Control</button>`;
$('todayIssues').innerHTML=openItems().map(b=>`<div class="issue"><b>${b.title}</b><div class="muted">${b.notes}</div></div>`).join('')||'<div class="win">No major loose ends.</div>';
$('todayTimeline').innerHTML=TRIP.map(t=>timelineItem(t)).join('');document.querySelectorAll('[data-go="readiness"]').forEach(b=>b.addEventListener('click',()=>showView('readiness')))}
function timelineItem(t){return `<button class="timeline-item" data-day="${t.id}"><span class="date">${t.label}</span><span class="dot"></span><span class="timeline-card"><b>${t.title}</b><span>${t.place}</span></span></button>`}
function renderTrip(){ $('tripTimeline').innerHTML=TRIP.map(t=>timelineItem(t)).join('');document.querySelectorAll('[data-day]').forEach(btn=>btn.addEventListener('click',()=>selectDay(btn.dataset.day)));selectDay(TRIP[0].id)}
function selectDay(id){const t=TRIP.find(x=>x.id===id);if(!t)return;document.querySelectorAll('[data-day]').forEach(x=>x.classList.toggle('active',x.dataset.day===id));$('dayDetail').innerHTML=`<span class="eyebrow">${t.label}</span><h2>${t.title}</h2><p class="muted">${t.place}</p><span class="status-pill ${t.status==='booked'?'good':'warn'}">${t.status}</span><div class="detail-list"><div class="detail-row"><small>Plan</small>${t.detail}</div>${t.confirmation?`<div class="detail-row"><small>Confirmation</small><b>${t.confirmation}</b></div>`:''}<div class="detail-row"><small>Atlas note</small>${t.status==='open'?'This still needs a final decision or verified booking.':'This item is currently marked confirmed.'}</div></div>`}

function initMap(){if(!window.L)return;map=L.map('map',{zoomControl:true}).setView([54.5,-7],6);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);drawMap();fitRoute()}
function mapStops(){return TRIP.filter(t=>Number.isFinite(t.lat)&&Number.isFinite(t.lng)&&!['flight'].includes(t.type))}
function drawMap(){markers.forEach(m=>map.removeLayer(m));markers=[];if(routeLine)map.removeLayer(routeLine);const stops=mapStops();routeLine=L.polyline(stops.map(s=>[s.lat,s.lng]),{color:'#173f2b',weight:4,opacity:.75}).addTo(map);stops.forEach((s,i)=>{const icon=L.divIcon({className:'',html:`<div class="marker">${i+1}</div>`,iconSize:[30,30],iconAnchor:[15,15]});const marker=L.marker([s.lat,s.lng],{icon}).addTo(map).bindPopup(`<b>${s.title}</b><br>${s.place}<br><small>${s.label}</small>`);marker.on('click',()=>selectMapStop(s.id));markers.push(marker)})}
function fitRoute(){if(map){const pts=mapStops().map(s=>[s.lat,s.lng]);if(pts.length)map.fitBounds(pts,{padding:[35,35]})}}
function renderStopList(){const q=$('stopSearch').value.toLowerCase().trim();const stops=mapStops().filter(s=>!q||JSON.stringify(s).toLowerCase().includes(q));$('stopList').innerHTML=stops.map((s,i)=>`<div class="stop-card" data-map-stop="${s.id}"><span class="stop-num">${i+1}</span><div><b>${s.title}</b><span>${s.label} · ${s.place}</span></div></div>`).join('');document.querySelectorAll('[data-map-stop]').forEach(x=>x.addEventListener('click',()=>selectMapStop(x.dataset.mapStop)))}
function selectMapStop(id){const s=TRIP.find(x=>x.id===id);if(!s||!map)return;map.setView([s.lat,s.lng],Math.max(map.getZoom(),9));const idx=mapStops().findIndex(x=>x.id===id);if(markers[idx])markers[idx].openPopup()}

function renderBookings(){const booked=BOOKINGS.filter(b=>b.status==='booked').length;$('bookingMetrics').innerHTML=`<div class="metric"><b>${BOOKINGS.length}</b><span>tracked items</span></div><div class="metric"><b>${booked}</b><span>confirmed</span></div><div class="metric"><b>${BOOKINGS.length-booked}</b><span>needs attention</span></div><div class="metric"><b>1</b><span>car return: Drogheda</span></div>`;$('bookingList').innerHTML=BOOKINGS.map(b=>`<article class="booking-card"><span class="eyebrow">${b.category}</span><h3>${b.title}</h3><p>${b.date}</p><span class="status-pill ${b.status==='booked'?'good':'warn'}">${b.status}</span>${b.confirmation?`<span class="status-pill"># ${b.confirmation}</span>`:''}<p>${b.notes}</p></article>`).join('')}

function renderReadiness(){const s=tripStatus();$('readinessScore').textContent=`${s.score}%`;$('progressBar').style.width=`${s.score}%`;$('progressLabel').textContent=`${s.done} of ${s.total} preparation items complete`;$('scoreCopy').textContent=s.score>=90?'Nearly ready. Focus only on the final transport and document checks.':s.score>=60?'Good progress. Finish the unresolved transport and booking items next.':'Start with documents, critical transport, and the Walmart purchase list.';$('checkGroups').innerHTML=CHECKS.map(g=>`<section class="panel check-group"><span class="eyebrow">Checklist</span><h3>${g.group}</h3>${g.items.map(([id,label,note])=>`<div class="check-row"><input type="checkbox" id="${id}" data-check="${id}" ${checks[id]?'checked':''}><label for="${id}">${label}<small>${note}</small></label></div>`).join('')}</section>`).join('');document.querySelectorAll('[data-check]').forEach(c=>c.addEventListener('change',()=>{checks[c.dataset.check]=c.checked;saveChecks();renderReadiness();renderToday()}))}

function init(){initTabs();renderToday();renderTrip();renderStopList();renderBookings();renderReadiness();initMap();$('fitRoute').addEventListener('click',fitRoute);$('stopSearch').addEventListener('input',renderStopList);$('printTrip').addEventListener('click',()=>window.print());$('resetChecks').addEventListener('click',()=>{if(confirm('Reset every readiness checkbox?')){checks={};saveChecks();renderReadiness();renderToday()}})}
document.addEventListener('DOMContentLoaded',init);