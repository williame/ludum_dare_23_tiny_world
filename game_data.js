
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
			Go("north","walled_garden"),
			Go("south","quay"),
		],
	},
	walled_garden: {
		name:"The Walled Garden",
		illustrated:{
			x:424,y:2448,w:520,h:424,
		},
		commands:[
			Go("south","boat_shed"),
		],
	},
}, current_location;

// init them; todo: validate them?
for(current_location in locations)
	locations[current_location].key = current_location;
current_location = null;
