export type TripDay = { id:string; date:string; end?:string; label:string; title:string; place:string; lat:number; lng:number; type:string; detail:string; status:'booked'|'open'; confirmation?:string };
export type Booking = { title:string; category:string; status:'booked'|'open'; date:string; notes:string; confirmation?:string };
export type ChecklistItem = { id:string; label:string; note:string };
export type ChecklistGroup = { group:string; items:ChecklistItem[] };
export type Trip = { id:string; title:string; subtitle:string; startDate:string; endDate:string; regions:string[]; days:TripDay[]; bookings:Booking[]; checklists:ChecklistGroup[] };

export const trip: Trip = {
  id:'ireland-scotland-2026', title:'Ireland & Scotland 2026', subtitle:'Jul 23–Aug 7, 2026', startDate:'2026-07-23', endDate:'2026-08-07', regions:['Ireland','Northern Ireland','Scotland'],
  days:[
    {id:'flight-out',date:'2026-07-23',label:'Jul 23',title:'Fly to Dublin',place:'XNA → Dublin',lat:36.2819,lng:-94.3068,type:'flight',detail:'American Airlines outbound. Keep passport, charger, medications, and one change of clothes in your personal item.',status:'booked'},
    {id:'dublin',date:'2026-07-24',end:'2026-07-26',label:'Jul 24–26',title:'Dublin',place:'Beckett Locke',lat:53.3498,lng:-6.2603,type:'hotel',detail:'Two nights in Dublin. Arrival day should stay light; use Jul 25 for the main city sights.',status:'booked'},
    {id:'galway',date:'2026-07-26',end:'2026-07-28',label:'Jul 26–28',title:'Galway',place:'Eyre Square Townhouse',lat:53.2743,lng:-9.0491,type:'hotel',detail:'Two-night Galway base. Keep the west-coast pace easy.',status:'booked'},
    {id:'dingle',date:'2026-07-28',end:'2026-07-30',label:'Jul 28–30',title:'Dingle',place:'Lantern Townhouse',lat:52.1409,lng:-10.2689,type:'hotel',detail:'Prioritize Slea Head Drive and leave room for weather changes.',status:'booked'},
    {id:'killarney',date:'2026-07-30',end:'2026-07-31',label:'Jul 30–31',title:'Killarney',place:'The Heights Hotel',lat:52.0599,lng:-9.5044,type:'hotel',detail:'Use the afternoon for Killarney National Park if timing allows.',status:'booked',confirmation:'IREnjq3ndung-6474556'},
    {id:'drogheda',date:'2026-07-31',label:'Jul 31',title:'Return car in Drogheda',place:'Drogheda, Ireland',lat:53.7179,lng:-6.3561,type:'car',detail:'Drive from Killarney, return the rental car, then continue to Belfast with a generous buffer.',status:'booked'},
    {id:'belfast',date:'2026-07-31',end:'2026-08-01',label:'Jul 31–Aug 1',title:'Belfast',place:'Titanic Hotel Belfast',lat:54.6082,lng:-5.9097,type:'hotel',detail:'One night before the ferry. Keep ferry documents and UK ETA accessible.',status:'booked'},
    {id:'ferry',date:'2026-08-01',label:'Aug 1',title:'Ferry to Scotland',place:'Belfast → Cairnryan',lat:54.631,lng:-5.892,type:'ferry',detail:'Confirm terminal transfer and check-in time the night before.',status:'booked'},
    {id:'glasgow',date:'2026-08-01',end:'2026-08-03',label:'Aug 1–3',title:'Glasgow',place:'Holiday Inn Express Glasgow Airport',lat:55.8642,lng:-4.4331,type:'hotel',detail:'Two nights with breakfast. Aug 2 is the Highlands day.',status:'booked',confirmation:'B_56773334'},
    {id:'highlands',date:'2026-08-02',label:'Aug 2',title:'Highlands day',place:'Glencoe / Highlands',lat:56.6826,lng:-5.1023,type:'activity',detail:'Choose Rabbie’s tour or a one-day rental car focused on Loch Lomond and Glencoe.',status:'open'},
    {id:'train',date:'2026-08-03',label:'Aug 3',title:'Train to Edinburgh',place:'Glasgow → Edinburgh',lat:55.9533,lng:-3.1883,type:'train',detail:'Keep ticket available offline and verify departure station and time.',status:'booked'},
    {id:'edinburgh',date:'2026-08-03',end:'2026-08-07',label:'Aug 3–7',title:'Edinburgh',place:'Hotel not yet verified',lat:55.9533,lng:-3.1883,type:'hotel',detail:'Final Scotland base. Lodging confirmation still needs to be added.',status:'open'},
    {id:'flight-home',date:'2026-08-07',label:'Aug 7',title:'Fly home',place:'Edinburgh → United States',lat:55.9508,lng:-3.3615,type:'flight',detail:'Check in when the airline window opens and allow extra airport time.',status:'booked'}
  ],
  bookings:[
    {title:'American Airlines outbound',category:'Flight',status:'booked',date:'Jul 23',confirmation:'NWNHLU',notes:'Overnight flight into Dublin.'},
    {title:'Beckett Locke',category:'Lodging',status:'booked',date:'Jul 24–26',notes:'Dublin base.'},
    {title:'Eyre Square Townhouse',category:'Lodging',status:'booked',date:'Jul 26–28',notes:'Galway base.'},
    {title:'Lantern Townhouse',category:'Lodging',status:'booked',date:'Jul 28–30',notes:'Dingle base.'},
    {title:'The Heights Hotel',category:'Lodging',status:'booked',date:'Jul 30–31',confirmation:'IREnjq3ndung-6474556',notes:'Killarney, 2 adults.'},
    {title:'Titanic Hotel Belfast',category:'Lodging',status:'booked',date:'Jul 31–Aug 1',notes:'One night before ferry.'},
    {title:'Stena Line ferry',category:'Ferry',status:'booked',date:'Aug 1',notes:'Belfast to Cairnryan.'},
    {title:'Holiday Inn Express Glasgow Airport',category:'Lodging',status:'booked',date:'Aug 1–3',confirmation:'B_56773334',notes:'Two nights; breakfast included.'},
    {title:'ScotRail Glasgow → Edinburgh',category:'Train',status:'booked',date:'Aug 3',notes:'Save ticket offline.'},
    {title:'Edinburgh lodging',category:'Lodging',status:'open',date:'Aug 3–7',notes:'Confirmation has not yet been verified.'},
    {title:'Highlands day plan',category:'Activity',status:'open',date:'Aug 2',notes:'Choose tour or rental car.'}
  ],
  checklists:[
    {group:'Documents & admin',items:[{id:'eta',label:'UK ETA approved',note:'Required for Northern Ireland and Scotland.'},{id:'passport',label:'Passport valid and packed',note:'Store a secure photo.'},{id:'confirmations',label:'All confirmations downloaded',note:'Hotels, flights, ferry, train, and rental car.'}]},
    {group:'Transport',items:[{id:'car-times',label:'Rental car times verified',note:'Build in a large Jul 31 buffer.'},{id:'ferry-transfer',label:'Belfast ferry transfer planned',note:'Check-in deadline matters.'},{id:'highlands',label:'Highlands plan booked',note:'Tour or rental car.'}]},
    {group:'Pack',items:[{id:'adapter',label:'Type G adapter',note:'Ireland and UK use Type G.'},{id:'raincoat',label:'Waterproof rain jacket',note:'Weather changes quickly.'},{id:'offline-maps',label:'Offline maps downloaded',note:'All major stops and driving regions.'}]}
  ]
};
