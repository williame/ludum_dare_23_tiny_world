var locations = {
	quay: {
		name:"The Quay",
		description:"",
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
			layer:"boat_shed",
			x:0,y:0,w:269,h:344,
		},
		commands:[
			Go("south","quay"),
			Go("east","wood_pile"),
		],
	},
	yard: {
		name:"Yard",
		description:"This cobbled yard is a very relaxing place to be, with stunning views of the shed and the back of the house. The pot plant seems to be growing upside down, possibly showing its opinions of the said view.",
		illustrated:{
			x:729,y:930,x2:1073,y2:1244,
		},
		commands:[
			Go("west","garage"),
			Go("south","hg_piano"),
			Go("north","maze"),
			Go("east","north_lawn"),
		],
	},
	steps: {
		name:"Steps",
		description:"The narrow path round the light house is slippery, but it's nothing compared to the stone steps leading down to the water. More than once you break your fall and get a slimy white substance on your hands. Is this flying fish guano?",
		illustrated:{
			x:2919,y:1271,x2:3193,y2:1400,
		},
		commands:[
			Go("north","light_house"),
		],
	},
	light_house: {
		name:"Lighthouse",
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
		name:"Mysterious Path",
		description:"Dare you tread such an intrigue-inducing right-of-way? What, for example, are the paving slabs made of? It seems to be some kind of metal. As the idyllic fluffy, white clouds scud over and the sun sees the ground, the paving slabs seem to ooze warmth and happiness. Why follow this friendly path when you could sit on the grass and sing songs to yourself?",
		illustrated:{
			x:1821,y:817,x2:2735,y2:1242,
		},
		commands:[
			Go("west","north_lawn"),
			Go("east","light_house"),
			Go("south","coppice"),
		],
	},
	secret_garden: {
		name:"Secret Garden",
		description:"Secret but not forgotten. The gardener obviously keeps this little patch in perfect condition safe in the knowledge that no-one will ever criticise his choice to put hydrangea next to polyanthus, hibiscus next to polypropylene.",
		unlocked:false,
		illustrated:{
			x:1104,y:352,x2:1759,y2:1025,
		},
		commands:[
			Go("south","north_lawn"),
			Go("north","workshop"),
			Go("east","north_path"),
		],
	},
	workshop: {
		illustrated:{
			x:1148,y:161,x2:1457,y2:319,
		},
		commands:[
			Go("south","secret_garden"),
		],
	},
	coppice:{
		name:"Coppice",
		description:"Trees. That's definitely what they are. Plenty of them all sort of grouped round a clearing. Like a wall or a fence. Turning round; the view is absolutely amazing, marred only by the large and indecently anatomical carving of the common eight-legged arctic bat on the rocks between you and the sea.",
		illustrated:{
			x:1822,y:1253,w:412,h:330,
		},
		commands:[
			Go("north","mysterious_path"),
		],
	},
	north_lawn: {
		name:"North Lawn",
		description:"The beautifully manicured lawn, cut in that chessboard fashion so admired by the gentry, is perfectly flat. Gardeners for years to come will use the phrase as flat as the North Lawn' when praising the work of a Master Lawncutter. The thirty degree angle of the lawn would make croquet quite an active sport, but it certainly looks the part.",
		illustrated:{
			x:1230,y:1065,x2:1802,y2:1572,
		},
		commands:[
			Go("west","yard"),
			Go("north","secret_garden", function(){ 
				return locations.secret_garden.unlocked;
			}),
			Cmd(function(){
				ui.set_error(current_location,"The door is locked; the door is too heavy to break down");
			},["go north","exit north","north","open door"], function(){ 
				return !locations.secret_garden.unlocked;
			}),
			Go("east","mysterious_path"),
		],
	},
	lawn: {
		name:"Lawn",
		description:"This is a windy place to stand. Do you really want to stand here? I'd move along if I were you.",
		illustrated:{
			x:1225,y:1594,x2:1798,y2:2149,
		},
		commands:[
			Go("east","beach"),
			Go("west","terrace"),
		],
	},
	beach: {
		name:"Beach",
		description:"This is really not much better. You begin to feel you should have brought a coat with you. The wind's very refreshing, very bracing, and very much not the sort of weather you want to be standing in without a coat.",
		illustrated:{
			x:1802,y:1601,x2:2388,y2:2199,
		},
		commands:[
			Go("west","lawn"),
		],
	},
	west_point: {
		name:"West Point",
		description:"The sun comes out from behind a fluffy, white cloud, the wind blows your hair back from your face, and you think This is the way to live'. You see a dwarf whale surfing the little waves towards the island and wonder what it would be like if they grew really, really big. How would they surf?",
		illustrated:{
			x:2733,y:2181,x2:3507,y2:2833,
		},
		commands:[
			Go("south","promontory"),
			Go("west","rough_ridge"),
		],
	},
	promontory: {
		name:"Promontory",
		description:"You suffer a flying fish attack. Their cruel claws tickle your skin and one tries to swallow your earlobe whole. Where is that flying fish net when you need it?",
		illustrated:{
			x:2422,y:3258,x2:3259,y2:3917,
		},
		commands:[
			Go("north","west_point"),
			Go("west","rope_bridge"),
		],
	},
	rough_ridge:{
		name:"Rough Ridge",
		description:"You stumble across a stone protruding from the back of the ridge and realise that the ridge must form some ancient wall or mount. As you stand in the sun, it's funny to think that people might once have waged war here. As you move round the ridge, you realise that it is actually an extremely overgrown rockery.",
		illustrated:{
			x:1457,y:2229,w:792,h:452,
		},
		commands:[
			Go("south","balloon_shed",function(){
				return !locations.balloon_shed.open;
			}),
			Go("south","balloon_shed_open",function(){
				return locations.balloon_shed.open;
			}),
			Go("east","west_point"),
			Go("west","south_yard"),
		],
	},
	south_yard:{
		name:"South Yard",
		description:"This is a sandy area, and the sand gets into your shoes. You thank god you're not carrying any sandwiches. You retract that last thought as you realise that your uncle won't be treating you to a meal this evening. A small wading bird has been making patterns in the sand, and you console yourself with the fact that almost it's entire diet must be that sand.",
		illustrated:{
			x:984,y:2149,w:455,h:570,
		},
		commands:[
			Go("east","rough_ridge"),
			Go("west","vegetable_garden"),
			Go("south","tennis_court"),
			Go("north","terrace"),
			Go("take muddy path","wood_pile"),
		],
	},
	balloon_shed: {
		open:false,
		flown:false,
		illustrated:{
			layer:"balloon_shed_interior",
			x:0,y:0,w:281,h:293,
		},
		commands:[
			Go("north","rough_ridge"),
			Cmd(function(){
				locations.balloon_shed.open=true;
				go_to("balloon_shed_open");
				if(!locations.balloon_shed.flown) {
					locations.balloon_shed.flown=true;
					locations.balloon_shed.illustrated.layer = "balloon_shed_interior_flown";
					var desc = document.createElement("p");
					desc.setAttribute("class","modal_description");
					desc.innerHTML =
						"<img src=\"balloon_trip.jpg\" style=\"max-height:40%; max-width:40%;\"/><br/>"+
						"The balloon rises and rises; you jump aboard just in time.<br/>"+
						"As it rises higher and higher you get a glimpse of the whole island for the first time.<br>"+
						"You notice something sparkling in the long grass to the south of the balloon shed;<br/>"+
						"You wonder what that might be?<br/>"+
						"Fearing for your life, you jump to the ground just in time.";
					show_modal(desc);
					locations.rope_bridge.commands.push(Go("north","long_grass"));
					go_to("rope_bridge");
					ui.perform_layout();
				}
			},["open roof"]),
		],
	},
	balloon_shed_open: {
		illustrated:{
			layer:"balloon_shed_open",
			x:0,y:0,w:281,h:293,
		},
		commands:[
			Go("north","rough_ridge"),
			Cmd(function(){
				locations.balloon_shed.open=false;
				go_to("balloon_shed");
			},["close roof"]),
		],
	},
	rope_bridge: {
		repaired:false,
		illustrated:{
			x:1777,y:3555,x2:2055,y2:3897,
		},
		commands:[
			Go("west","t_path"),
			Go("east","promontory"),
			Go("south","rock",function(){
				return locations.rope_bridge.repaired;
			}),
			Cmd(function(){
				ui.set_error(current_location,"you cannot go south because the bridge is broken; it is missing some treads and you dare not jump them");
			},["go south","exit south","south"],function() {
				return !locations.rope_bridge.repaired;
			}),
		],
	},
	jetty: {
		name:"The Jetty",
		description: "You are standing on the jetty of your good friend the Professor, awaiting his arrival. His little steam launch is due precisely now and you hope to listen to tales of his adventures around the fire this evening. As you stand watching the flying fish struggling on the large piece of parchment floating in the sea to your south, you notice a small, green bottle floating towards you in murky water. You collect the bottle using the handy flying fish net.",
		illustrated:{
			x:516,y:3379,x2:768,y2:3556,
		},
		objects:[
			"bottle_closed_message",
		],
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
			Go("east","rope_bridge"),
		],
	},
	tennis_court: {
		name:"Tennis Court",
		description:"This court looks like it hasn't been used in years. The wonky net and long grass suggest that your uncle may not actually be that keen on tennis. As you wander, you trip over an old tennis racquet and try to pick it up, but the grass has claimed it as it's own and doesn't seem likely to relinquish it.",
		illustrated:{
			x:1072,y:2792,x2:1388,y2:3278,
		},
		commands:[
			Go("south","t_path"),
			Go("north","south_yard"),
		],
	},
	wood_pile: {
		name:"Wood Pile",
		description:"A pile of wood. It's mostly garden hardwoods such as willow and apple, but there are a few leylandii in there. You give it a kick and a long-tailed hedgehog makes a bid for freedom, waggling said tail and flapping its ears in a bid to move faster.",
		illustrated:{
			x:617,y:2885,x2:874,y2:3030,
		},
		objects:[
			"plank",
		],
		commands:[
			Go("west","boat_shed"),
			Go("south","jetty"),
			Go("take muddy path","south_yard"),
		],
	},
	vegetable_garden: {
		name:"Vegetable Garden",
		description:"The carrots are coming up lovely this year, with only a little help from the moles pushing from below. Purple sprouting broccoli and artichokes take pride of place in this garden, with the more tasty foods sidelined in little beds around the edges.",
		illustrated:{
			x:411,y:2432,x2:975,y2:2868,
		},
		commands:[
			Go("east","south_yard"),
		],
	},
	conservatory: {
		illustrated:{
			layer:"house_ground_floor",
			x:285,y:781,x2:277,y2:330,
		},
		commands:[
			Go("north","hg_dining"),
		],
	},
	terrace: {
		name:"Terrace",
		description:"The table and chairs are set our for two people, ready to share hilarious stories of travels around the world. Upon closer inspection, you realise that someone has carefully driven a nail up through the seat of each chair. You hope neither of them were meant for you.",
		illustrated:{
			x:1004,y:1252,x2:1207,y2:2021,
		},
		commands:[
			Go("south","south_yard"),
			Go("north","yard"),
			Go("west","hg_hall"),
			Go("east","lawn"),
		],
	},
	garage: {
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
	long_grass:{
		name:"Long Grass",
		description:"The grass is very long, and you keep tripping over things. This is obviously a place to put gardening tools and machinery when it reaches the end of its useful life. You stand on the head of a rake and its handle smacks you in the face. As the clouds cover the sun for a few moments, you feel a sense-of-humour failure coming on.",
		illustrated:{
			x:1730,y:3018,w:348,h:383,
		},
		commands:[
			Go("south","rope_bridge"),
		],
	},
	rock:{
		name:"Rock",
		description:"A rock is a rock is a rock. Or is it?",
		illustrated:{
			x:1725,y:4132,w:585,h:603,
		},
		objects:[
			"secret_garden_key",
		],
		commands:[
			Go("north","rope_bridge"),
		],
	},
	north_path:{
		illustrated:{
			x:2161,y:571,w:522,h:215,
		},
		has_zeppelin_boat: false,
		on_enter:[
			function() {
				if(locations.north_path.has_zeppelin_boat) return;
				locations.north_path.has_zeppelin_boat = true;
				var zep = document.createElement("p");
				zep.setAttribute("class","modal_description");
				zep.innerHTML =
					"<img src=\"zeppelin.png\"/><br/>"+
					"As you reach the stony shore you look out and notice a small smokey dot on the east horizon.<br/>"+
					"As it grows nearer and nearer, and bigger and bigger, you see that it is a ginormous,<br/>"+
					"steam-belching Zeppelin!<br/>"+
					"It heads straight for the island and stops just a short distance from the shore.<br/>"+
					"Hovering just feet above the waves, it lowers a small rowing boat and a man rows powerfully,<br/>"+
					"deliberately towards you.";
				show_modal(zep);
				locations.north_path.illustrated.images = [
					{
						x:locations.north_path.illustrated.w-150,y:-25,
						image:"zeppelin_boat.png",
					},
				];
				locations.north_path.illustrated.w += 300;
			},
		],
		commands:[
			Go("west","secret_garden"),
		],
	},
	hg_hall:{
		illustrated:{
			layer:"house_ground_floor",
			x:299,y:187,w:289,h:158,
		},
		commands:[
			Go("east","terrace"),
			Go("south","hg_fireplace"),
			Go("west","hg_front_hall"),
			Go("north","hg_piano"),
		],
	},
	hg_fireplace:{
		illustrated:{
			layer:"house_ground_floor",
			x:300,y:350,w:288,h:183,
		},
		commands:[
			Go("south","hg_dining"),
			Go("north","hg_hall"),
			Go("west","hg_kitchen"),
		],
	},
	hg_dining:{
		illustrated:{
			layer:"house_ground_floor",
			x:298,y:543,w:291,h:228,
		},
		commands:[
			Go("north","hg_fireplace"),
			Go("west","hg_library"),
			Go("south","conservatory"),
		],
	},
	hg_front_hall:{
		illustrated:{
			layer:"house_ground_floor",
			x:18,y:193,w:269,h:148,
		},
		commands:[
			Go("east","hg_hall"),
			Go("upstairs","ht_landing"),
			Go("north","hg_toilet"),
		],
	},
	hg_toilet:{
		illustrated:{
			layer:"house_ground_floor",
			x:174,y:19,w:117,h:164,
		},
		commands:[
			Go("south","hg_front_hall"),
		],
	},
	hg_library:{
		illustrated:{
			layer:"house_ground_floor",
			x:22,y:591,w:264,h:178,
		},
		commands:[
			Go("east","hg_dining"),
		],
	},
	hg_kitchen:{
		illustrated:{
			layer:"house_ground_floor",
			x:20,y:350,w:263,h:226,
		},
		objects:[
			"dumb_waiter",
		],
		commands:[
			Go("east","hg_fireplace"),
			Cmd(function() { go_to("hg_dumb_waiter"); },["climb into dumb waiter"],
				function() { return objects.dumb_waiter.examined; }),
		],
	},
	hg_dumb_waiter:{
		name:"Dumb Waiter",
		description:"you are on the ground floor, in the kitchen",
		illustrated:{
			layer:"house_ground_floor",
			x:-200,y:290,w:308,h:168,
		},
		commands:[
			Go("down","hb_dumb_waiter"),
			Go("up","ht_dumb_waiter"),
			Cmd(function(){
				go_to("hg_kitchen");
			},["climb out","get out"]),
		],
	},
	ht_dumb_waiter:{
		name:"Dumb Waiter",
		description:"you are on the top floor",
		illustrated:{
			layer:"house_top_floor",
			x:-200,y:290,w:308,h:168,
		},
		commands:[
			Go("down","hg_dumb_waiter"),
			Cmd(function(){
				go_to("hg_kitchen"); //#####
			},["climb out","get out"]),
		],
	},
	hb_dumb_waiter:{
		name:"Dumb Waiter",
		description:"you are in the celler under the house",
		illustrated:{
			layer:"house_basement",
			x:-200,y:290,w:308,h:168,
		},
		commands:[
			Go("up","hg_dumb_waiter"),
			Cmd(function(){
				go_to("lab");
			},["climb out","get out"]),
		],
	},
	lab:{
		name:"The Secret Lab",
		illustrated:{
			layer:"house_basement",
			x:18,y:310,w:394,h:358,
		},
		objects:[
			"dumb_waiter",
			"small_stove",
			"spanner",
			"hammar",
			"lab_bench",
			"lab_drawing_board",
		],
		commands:[
			Cmd(function(){
				go_to("hb_dumb_waiter");
			},["climb into dumb waiter"]),
		],
	},
	hg_piano:{
		illustrated:{
			layer:"house_ground_floor",
			x:301,y:19,w:285,h:165,
		},
		commands:[
			Go("north","yard"),
			Go("south","hg_hall"),
		],
	},
	ht_landing:{
		illustrated:{
			layer:"house_top_floor",
			x:19,y:22,w:145,h:159,
		},
		commands:[
			Go("downstairs","hg_front_hall"),
		],
	},
}, current_location = null;

var illustrated_layers = {
	house_ground_floor:{
		x:400,y:1240,
		image:"house_groundfloor.jpg",
	},
	house_top_floor:{
		x:400,y:1240,
		image:"house_topfloor.jpg",
	},
	house_basement:{
		x:400,y:1240,
		image:"lab.jpg",
	},
	balloon_shed_interior:{
		x:1669,y:2691,
		image:"balloon_shed_interior.jpg",
	},
	balloon_shed_interior_flown:{
		x:1669,y:2691,
		image:"balloon_shed_interior_empty.jpg",
	},
	balloon_shed_open:{
		x:1545,y:2585, //x:1669,y:2691,
		image:"balloon_shed_open.jpg",
	},
	boat_shed:{
		x:312,y:2864,
		image:"boat_shed_interior.jpg",
	},
};

var objects = {
	bottle_closed_message:{
		name:"bottle",
		take:Take("bottle_closed_message","bottle"),
		drop:Drop("bottle_closed_message","bottle"),
		commands:[
			Msg("the bottle is corked; it contains a letter",["examine bottle"]),
			Cmd(function() {
				exchange_object("bottle_closed_message",["bottle_open","bottle_message"],
					"you uncork the bottle; the letter falls out");
			},["open bottle","uncork bottle"]),
		],
	},
	bottle_open:{
		name:"bottle",
		take:Take("bottle_open","bottle"),
		drop:Drop("bottle_open","bottle"),
		commands:[
			Msg("the bottle is open",["examine bottle"]),
			Cmd(function() {
				exchange_object("bottle_open",["bottle_closed"],
					"you cork the bottle again");
			},["close bottle","cork bottle"]),
		],
	},
	bottle_closed:{
		name:"bottle",
		take:Take("bottle_closed","bottle"),
		drop:Drop("bottle_closed","bottle"),
		commands:[
			Msg("the bottle is closed",["examine bottle"]),
			Cmd(function() {
				exchange_object("bottle_closed",["bottle_open"],
					"you uncork the bottle");
			},["open bottle","uncork bottle"]),
		],
	},
	bottle_message:{
		name:"letter",
		take:Take("bottle_message","letter"),
		drop:Drop("bottle_message","letter"),
		commands:[
			Cmd(function() {
				var img = document.createElement("img");
				img.src = "letter.jpg";
				show_modal(img);
			},["read letter","examine letter"]),
			Cmd(function() {
				exchange_object("bottle_open",["bottle_closed_message"],"you put the letter back in the bottle");
				exchange_object("bottle_message",[]); // remove it
			},["put letter in the bottle"],
			function() {
				return in_array(inventory,"bottle_open") || in_array(current_location.objects,"bottle_open");
			}),
		],
	},
	plank:{
		name:"a plank",
		used:false,
		take:Take("plank","plank"),
		drop:Drop("plank","plank"),
		commands:[
			Msg("You examine the perfectly ordinary plank of wood",["examine plank"]),
			Cmd(function() {
				locations.rope_bridge.repaired = true;
				objects.plank.used = true;
				exchange_object("plank",[],"you use the plank to repair the bridge"); // remove it
			},["repair the bridge","use the plank"],
			function() {
				return current_location == locations.rope_bridge;
			}),
		],
	},
	secret_garden_key:{
		name:"a heavy iron key",
		used:false,
		take:Take("secret_garden_key","key"),
		drop:Drop("secret_garden_key","key"),
		commands:[
			Msg("Its a very heavy iron key",["examine key","look at the key"]),
			Cmd(function() {
				locations.secret_garden.unlocked = true;
				objects.secret_garden_key.used = true;
				exchange_object("secret_garden_key",[],"the key fits the lock perfectly; you unlock the door"); // removed
			},["open the door","unlock the door","use key"],
			function() {
				return current_location == locations.north_lawn;
			}),
		],
	},
	dumb_waiter:{
		name:"a dumb waiter",
		examined:false,
		commands:[
			Cmd(function(){
				add_message(current_location,"Clearly whoever does the cooking doesn't take the stairs");
				objects.dumb_waiter.examined = true;
			},["examine dumb waiter","look at dumb waiter"]),
		],
	},
	small_stove:{
		name:"a small iron stove",
		take:Take("small_stove","stove"),
		drop:Drop("small_stove","stove"),
		commands:[
			Msg("its a small blackened iron stove",["examine stove","examine iron stove"]),
		],
	},
	spanner:{
		name:"a spanner",
		hidden:true,
		take:Take("spanner","spanner",function(){return !objects.spanner.hidden;}),
		drop:Drop("spanner","spanner"),
		commands:[
			Msg("It looks like a perfectly normal spanner.  Very useful.",["examine spanner"],function(){return !objects.spanner.hidden;}),
		],
	},
	hammar:{
		name:"a hammar",
		hidden:true,
		take:Take("hammar","hammar",function(){return !objects.hammar.hidden;}),
		drop:Drop("hammar","hammar"),
		commands:[
			Msg("It looks like a perfectly normal hammar.  Very useful.",["examine hammar"],function(){return !objects.hammar.hidden;}),
		],
	},
	lab_bench:{
		name:"a lab bench",
		examined:false,
		commands:[
			Cmd(function() {
				add_message(current_location,"There are what appears to a half-assembled robot on the bench.  It doesn't look like its in workable condition.");
				if(!objects.lab_bench.examined) {
					add_message(current_location,"There are some tools littering the table.");
					objects.lab_bench.examined = true;
					objects.hammar.hidden = objects.spanner.hidden = false;
				}
			},["examine lab bench","examine table"]),
		],
	},
	lab_drawing_board:{
		name:"a drawing board",
		commands:[
			Cmd(function() {
				var img = document.createElement("img");
				img.src = "lab_pic.jpg";
				show_modal(img);
			},["examine drawing board"]),
		],
	},
};

