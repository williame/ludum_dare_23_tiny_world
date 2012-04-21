
var locations = {
	quay: {
		name:"The Quay",
		commands:[
			Go("west","beach"),
		],
	},
	beach: {
		name:"The Beach",
		commands:[
			Go("east","quay"),
		],
	},
}, current_location;

// init them; todo: validate them?
for(current_location in locations)
	locations[current_location].key = current_location;
current_location = null;
