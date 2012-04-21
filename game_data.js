
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
			Go("east","wood_pile"),
		],
	},
	house: {
		illustrated:{
			x:403,y:1252,x2:998,y2:2022,
		},
		commands:[
			Go("north","yard"),
			Go("south","conservatory"),
			Go("east","terrace"),
		],
	},
	yard: {
		illustrated:{
			x:729,y:930,x2:1073,y2:1244,
		},
		commands:[
			Go("west","garden_shed"),
			Go("south","house"),
			Go("north","maze"),
			Go("east","north_lawn"),
		],
	},
	steps: {
		illustrated:{
			x:2919,y:1271,x2:3193,y2:1400,
		},
		commands:[
			Go("north","light_house"),
		],
	},
	light_house: {
		illustrated:{
			x:2745,y:830,x2:3368,y2:1258,
		},
		commands:[
			Go("west","mysterious_path"),
			Go("south","steps"),
			Go("up","lantern"),
		],
	},
	lantern:{
		illustrated:{
			x:2745,y:830,x2:3368,y2:1258,
		},
		commands:[
			Go("down","light_house"),
		],
	},
	mysterious_path: {
		illustrated:{
			x:1821,y:817,x2:2735,y2:1242,
		},
		commands:[
			Go("west","north_lawn"),
			Go("east","light_house"),
			Go("south","coppice"),
		],
	},
	vegetable_garden: {
		illustrated:{
			x:1104,y:352,x2:1759,y2:1025,
		},
		commands:[
			Go("south","north_lawn"),
			Go("north","potting_shed"),
		],
	},
	potting_shed: {
		illustrated:{
			x:1148,y:161,x2:1457,y2:319,
		},
		commands:[
			Go("south","vegetable_garden"),
		],
	},
	coppice:{
		illustrated:{
			x:1822,y:1253,w:412,h:330,
		},
		commands:[
			Go("north","mysterious_path"),
		],
	},
	north_lawn: {
		illustrated:{
			x:1230,y:1065,x2:1802,y2:1572,
		},
		commands:[
			Go("west","yard"),
			Go("north","vegetable_garden"),
			Go("east","mysterious_path"),
		],
	},
	lawn: {
		illustrated:{
			x:1225,y:1594,x2:1798,y2:2149,
		},
		commands:[
			Go("east","beach"),
			Go("west","terrace"),
		],
	},
	beach: {
		illustrated:{
			x:1802,y:1601,x2:2388,y2:2199,
		},
		commands:[
			Go("west","lawn"),
		],
	},
	west_point: {
		illustrated:{
			x:2733,y:2181,x2:3507,y2:2833,
		},
		commands:[
			Go("south","promontory"),
			Go("west","rough_ridge"),
		],
	},
	promontory: {
		illustrated:{
			x:2422,y:3258,x2:3259,y2:3917,
		},
		commands:[
			Go("north","west_point"),
			Go("west","rope_bridge_north"),
		],
	},
	rough_ridge:{
		illustrated:{
			x:1457,y:2229,w:792,h:452,
		},
		commands:[
			Go("south","balloon_shed"),
			Go("east","west_point"),
			Go("west","south_yard"),
		],
	},
	south_yard:{
		illustrated:{
			x:984,y:2149,w:455,h:570,
		},
		commands:[
			Go("east","rough_ridge"),
			Go("west","secret_garden"),
			Go("south","tennis_court"),
			Go("north","terrace"),
			Go("take muddy path","wood_pile"),
		],
	},
	balloon_shed: {
		illustrated:{
			x:1669,y:2691,x2:1949,y2:2953,
		},
		commands:[
			Go("north","rough_ridge"),
		],
	},
	rope_bridge_north: {
		illustrated:{
			x:1777,y:3555,x2:2055,y2:3897,
		},
		commands:[
			Go("west","t_path"),
			Go("east","promontory"),
		],
	},
	jetty: {
		illustrated:{
			x:516,y:3379,x2:768,y2:3556,
		},
		commands:[
			Go("north","wood_pile"),
			Go("east","t_path"),
		],
	},
	t_path: {
		illustrated:{
			x:818,y:3319,w:800,h:252,
		},
		commands:[
			Go("north","tennis_court"),
			Go("west","jetty"),
			Go("east","rope_bridge_north"),
		],
	},
	tennis_court: {
		illustrated:{
			x:1072,y:2792,x2:1388,y2:3278,
		},
		commands:[
			Go("south","t_path"),
			Go("north","south_yard"),
		],
	},
	wood_pile: {
		illustrated:{
			x:617,y:2885,x2:874,y2:3030,
		},
		commands:[
			Go("west","boat_shed"),
			Go("south","jetty"),
			Go("take muddy path","south_yard"),
		],
	},
	secret_garden: {
		illustrated:{
			x:411,y:2432,x2:975,y2:2868,
		},
		commands:[
			Go("east","south_yard"),
		],
	},
	conservatory: {
		illustrated:{
			x:678,y:2030,x2:970,y2:2359,
		},
		commands:[
			Go("north","house"),
		],
	},
	terrace: {
		illustrated:{
			x:1004,y:1252,x2:1207,y2:2021,
		},
		commands:[
			Go("south","south_yard"),
			Go("north","yard"),
			Go("west","house"),
			Go("east","lawn"),
		],
	},
	garden_shed: {
		illustrated:{
			x:405,y:943,x2:719,y2:1214,
		},
		commands:[
			Go("east","yard"),
		],
	},
	maze: {
		illustrated:{
			x:397,y:317,x2:1073,y2:919,
		},
		commands:[],
	},
}, current_location;

// init them; todo: validate them?
for(current_location in locations) {
	locations[current_location].key = current_location;
	if(!locations[current_location].name)
		locations[current_location].name = "!"+current_location;
}
current_location = null;
