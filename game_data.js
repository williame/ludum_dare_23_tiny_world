
var locations = {
	quay: {
		name:"The Quay",
		illustrated:{
			x:104,y:3096,w:500,h:600,
		},
		commands:[
			Go("north","boat_shed"),
		],
	},
	boat_shed: {
		name:"The Boat Shed",
		illustrated:{
			x:312,y:2864,w:269,h:344,
		},
		commands:[
			Go("south","quay"),
			Go("west","wood_pile"),
		],
	},
	house: {
		illustrated:{
			x:403,y:1252,x2:998,y2:2022,
		},
		commands:[
			Go("north","yard"),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	yard: {
		illustrated:{
			x:729,y:930,x2:1073,y2:1244,
		},
		commands:[
			Go("north",""),
			Go("east","garden_shed"),
			Go("south",""),
			Go("west",""),
		],
	},
	steps: {
		illustrated:{
			x:2919,y:1271,x2:3193,y2:1400,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	light_house: {
		illustrated:{
			x:2745,y:830,x2:3368,y2:1258,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	mysterious_path: {
		illustrated:{
			x:1821,y:817,x2:2735,y2:1242,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	vegatable_garden: {
		illustrated:{
			x:1104,y:352,x2:1759,y2:1025,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	potting_shed: {
		illustrated:{
			x:1148,y:161,x2:1457,y2:319,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	north_lawn: {
		illustrated:{
			x:1230,y:1065,x2:1802,y2:1572,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	lawn: {
		illustrated:{
			x:1225,y:1594,x2:1798,y2:2149,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	beach: {
		illustrated:{
			x:1802,y:1601,x2:2388,y2:2199,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	west_point: {
		illustrated:{
			x:2733,y:2181,x2:3507,y2:2833,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	promontory: {
		illustrated:{
			x:2422,y:3258,x2:3259,y2:3917,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	balloon_shed: {
		illustrated:{
			x:1669,y:2691,x2:1949,y2:2953,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	rope_bridge_north: {
		illustrated:{
			x:1777,y:3555,x2:2055,y2:3897,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	jetty: {
		illustrated:{
			x:516,y:3379,x2:768,y2:3556,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	tennis_court: {
		illustrated:{
			x:1072,y:2792,x2:1388,y2:3278,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	wood_pile: {
		illustrated:{
			x:617,y:2885,x2:874,y2:3030,
		},
		commands:[
			Go("north",""),
			Go("east","boat_shed"),
			Go("south","jetty"),
			Go("west",""),
		],
	},
	secret_garden: {
		illustrated:{
			x:411,y:2432,x2:975,y2:2868,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	conservatory: {
		illustrated:{
			x:678,y:2030,x2:970,y2:2359,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	terrace: {
		illustrated:{
			x:1004,y:1252,x2:1207,y2:2021,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
	garden_shed: {
		illustrated:{
			x:405,y:943,x2:719,y2:1214,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west","yard"),
		],
	},
	maze: {
		illustrated:{
			x:397,y:317,x2:1073,y2:919,
		},
		commands:[
			Go("north",""),
			Go("east",""),
			Go("south",""),
			Go("west",""),
		],
	},
}, current_location;

// init them; todo: validate them?
for(current_location in locations) {
	locations[current_location].key = current_location;
	if(!locations[current_location].name)
		locations[current_location].name = "!"+current_location;
}
current_location = null;
