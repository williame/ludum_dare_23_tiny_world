
var locations = {
	quay: {
		name:"The Quay",
		illustrated:{
			x:1920,y:900,w:500,h:100,
		},
		commands:[
			Go("west","beach"),
		],
	},
	beach: {
		name:"The Beach",
		illustrated:{
			x:600,y:100,w:100,h:100,
		},
		commands:[
			Go("east","quay"),
		],
	},
}, current_location;

// init them; todo: validate them?
for(current_location in locations)
	locations[current_location].key = current_location;
current_location = null;
