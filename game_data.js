var locations = {
	quay: {
		name:"The Quay",
		description:"The small quay has mooring for several craft. It is empty",
		illustrated:{
			x:104,y:3096,w:500,h:600,
		},
		visits:0,
		on_enter:[
			function(){
				if(++locations.quay.visits != 2) return;
				function done() {
					move_npc(npcs.sioux,current_location);
					locations.quay.illustrated.images = [{
						x:180,
						y:300,
						image:"canoe.png",
					}];
					refresh_location(current_location.key);
				}
				var desc = "Approaching fast without apparent effort, a Sioux in a canoe lands at the quay";
				if(ui.nongraphical) {
					add_message(current_location,desc,60);
					done();
				} else {
					var div = document.createElement("div");
					div.innerHTML = desc + "<br/><img src=\"sioux_arrive.jpg\"/>";
					show_modal(div);
					// do extra things when the message is dismissed by the user and they return to the game
					var dismiss = modaliser.dismiss;
					modaliser.dismiss = function(){
						done();
						dismiss(); // call framework stuff
					};
				}
			},
		],
		commands:[
			Go("north","boat_shed"),
			Cmd(function(){
				if(npcs.sioux.location == current_location)
					add_message(current_location,"A quick glance at the tomahawk blade glimmering in the sunshine disuades you");
				else {
					add_message(current_location,"The war cry of the Indians charging down to the quay strikes fear into your heart; you've been observed!");
					npc_says(npcs.sioux,current_location,["You cannot leave us stranded here!"]);
					move_npc(npcs.sioux,current_location);
				}
			},["steal canoe","take canoe","steal boat","take boat"],function(){ return npcs.sioux.location; }),
			Msg("Considering the journey it has taken across the atlantic, it is surprisingly unsubstantial",
				["examine canoe","examine boat"],function(){ return npcs.sioux.location; }),
		],
	},
	boat_shed: {
		name:"The Boat Shed",
		description:"The Professor's boat is not here. The shed slopes into the water on the south side, with two runners and a heavy cable winch. All objects are securely fastened down but there are numerous tools around. ",
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
		description:"The narrow path round the light house is slippery, but it's nothing compared to the stone steps leading down to the water. More than once you break your fall and get a slimy white substance on your hands. Is this flying fish guano? They continue straight into the water. The water is colder here. In the distance you can hear muffled, ghostly, bells tolling.",
		illustrated:{
			x:2919,y:1271,x2:3193,y2:1400,
		},
		commands:[
			Go("north","light_house"),
			Cmd(function(){
				var desc = "";
				if(in_array(inventory,"diving_suit"))
					desc = "Donning your heavy improvised diving suit, you start your descent.";
				else
					desc = "You carefully climb down towards the still sea.";
				if(!npcs.octopus.location) {
					desc += "<br/>Peering through the shallow water, you see a dark monstorous shape stir.";
					desc += "<br/>Rethinking your folly, you scramble back up to safety";
					if(!ui.nongraphical)
						desc += "<br/><img src=\"octopus.jpg\"/>";
				} else if(!in_array(inventory,"diving_suit")) {
					desc += "<br/>The steps seem to continue onwards deeper and deeper below the water into the cove;<br/>not being a strong swimmer, you head back to dry shore";
				}
				function done() {
					if(in_array(inventory,"diving_suit") && npcs.octopus.location)
						you_win();
				}
				if(ui.nongraphical) {
					add_message(current_location,desc);
					done();
				} else {
					var div = document.createElement("div");
					div.innerHTML = desc;
					show_modal(div);
					var dismiss = modaliser.dismiss;
					modaliser.dismiss = function() {
						dismiss();
						done();
					};
				}
			},["go south","south","go down","down"]),
		],
	},
	light_house: {
		name:"Lighthouse",
		description:"A tall cylindrical stone tower sits above the treacherous rocky headland. There is a small door at its base.",
		illustrated:{
			x:2745,y:830,x2:3368,y2:1258,
		},
		door_bolted:true,
		commands:[
			Go("west","mysterious_path"),
			Go("south","steps"),
			Msg("The door is securely bolted",["open door"],function(){ return locations.light_house.door_bolted; }),
			Cmd(function(){
				go_to("lantern");
			},["climb lighthouse","go up","up","enter lighthouse"],function(){ return !locations.light_house.door_bolted;}),
			Cmd(function(){
				locations.light_house.door_bolted = false;
				add_message(current_location,"You slide back the bolts on the door");
			},["unbolt door"],function(){ return locations.light_house.door_bolted; }),
			Cmd(function(){
				locations.light_house.door_bolted = true;
				add_message(current_location,"You slide the bolts on the door closed");
			},["bolt door"],function(){ return !locations.light_house.door_bolted; }),
		],
	},
	lantern:{
		name:"Lantern",
		description:"At the top of the spiral staircase in the lighthouse is the lantern room containing the lamp",
		illustrated:{
			layer:"lantern",
			x:0,y:0,w:3368-2745,h:1258-830,
		},
		commands:[
			Msg("On inspection the lamp is an Argand hollow wick model mounted in a parabolic reflector.",["examine lamp"]),
			Msg("You don't have any matches!",["light lamp"],function(){ return !(in_array(inventory,"matches")||in_array(locations.lantern.objects,"matches")); }),
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
		objects:[
			"mosaic",
		],
		commands:[
			Go("south","north_lawn"),
			Go("north","workshop"),
			Go("east","north_path"),
		],
	},
	workshop: {
		name: "Work shop",
		description: "The Professor's workshop contains a large anvil and a work bench. The small room has a low roof and is poorly lit. ",
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
		visits:0,
		on_enter:[
			function(){
				if(locations.coppice.visits++) return;
				var desc = "Once you pause in the clearing, your view lazily surveys the twinkling still sea.<br/>"+
					"And then, from afar, closing, it's sails billowing in the wind, is a large galleon!<br/>"+
					"It drops anchor just off shore and some of the crew set off to land in a dingy.<br/>"+
					"They beach in the cover beneath your viewpoint; and to your amazement, they seem to be dressed<br/>"+
					"unmistakingly as pirates!  Do you imagine they are those that waylaid the professor?";
				function done() {
					move_npc(npcs.pirates,locations.beach);
					locations.beach.illustrated.images = [{
						x:300, y:20,
						image:"pirate_dingy.png",
					}];
					locations.beach.pirates_landed = true;
				}
				if(ui.nongraphical) {
					add_message(current_location,desc,60);
					done();
				} else {
					var div = document.createElement("p");
					div.innerHTML = desc + "<br/><img src=\"pirates_arrive.jpg\"/>";
					show_modal(div);
					var dismiss = modaliser.dismiss;
					modaliser.dismiss = function() {
						done();
						dismiss();
					};
				}
			},
		],
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
		pirates_landed:false,
		description:"This is really not much better. You begin to feel you should have brought a coat with you. The wind's very refreshing, very bracing, and very much not the sort of weather you want to be standing in without a coat.",
		illustrated:{
			x:1802,y:1601,x2:2388,y2:2199,
		},
		commands:[
			Go("west","lawn"),
			Cmd(function(){
				if(npcs.pirates.location == current_location)
					npc_says(npcs.pirates,current_location,["Children like you should be made to walk the plank!"]);
				else if(npcs.pirates.location)
					npc_says(npcs.pirates_aboard,current_location,["It is wrong to steal!","Hey! That's our boat!","We should maroon you on an island instead!"]);
				else if(is_object_here("diving_suit")) {
					var div = document.createElement("div");
					div.innerHTML = "You maneuver the dingy out into the middle of the cove; donning the diving suit, you dive...";
					show_modal(div);
					var dismiss = modaliser.dismiss;
					modaliser.dismiss = function(){
						dismiss();
						you_win();
					};
				} else
					add_message(current_location,"You paddle out and around the cove; it is a pleasant way to spend time in the sunshine, but you dare not voyage too far out");
			},["steal dingy","take dingy","steal boat","take boat"],function(){ return locations.beach.pirates_landed; }),
			Msg("It is a small dingy that the pirates came ashore in",
				["examine dingy","examine boat"],function(){ return locations.beach.pirates_landed; }),
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
		name:"Folly",
		description:"On the promontory there stand the ruins of a single-story watch tower, with crenelations and arrow loops.<br/>The stonework appears quite recent.",
		illustrated:{
			x:2422,y:3258,x2:3259,y2:3917,
		},
		visits:0,
		on_enter:[
			function(){
				if(locations.promontory.visits++) return;
				add_message(current_location,"You suffer a flying fish attack. Their cruel claws tickle your skin and one tries to swallow your earlobe whole. "+
					"Where is that flying fish net when you need it?");
			},
		],
		objects:[
			"brick",
		],
		commands:[
			Go("north","west_point"),
			Go("west","rope_bridge"),
			Cmd(function(){
				var desc = "On the promontory there stand the ruins of a single-story watch tower, with crenelations and arrow loops. "+
					"The stonework appears quite recent.";
				if(ui.nongraphical) {
					add_message(current_location,desc);
				} else {
					var p = document.createElement("p");
					p.innerHTML = desc + "<br/><img src=\"folly.jpg\"/>";
					show_modal(p);
				}
			},["examine folly"]),
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
		description:"This is a sandy area, and the sand gets into your shoes. You thank god you're not carrying any sandwiches. You retract that last thought as you realise that the professor won't be treating you to a meal this evening. A small wading bird has been making patterns in the sand, and you console yourself with the fact that almost it's entire diet must be that sand.",
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
		name: "Balloon Shed",
		description: "A peculiar building, square in plan with a large quadsectioned onion dome copper roof.",
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
		name:"Balloon Shed",
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
		name:"Rope Bridge",
		description: "Someone has erected a rope bridge between the mainland and a small island to the south.",
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
		first_time:true,
		plot: function(){
			var desc = "You are standing on the jetty of your good friend the Professor, awaiting his arrival.<br/>"+
				"His little steam launch is due precisely now and you hope to listen to tales of his<br/>"+
				"adventures around the fire this evening. As you stand watching the flying fish struggling<br/>"+
				"on the large piece of parchment floating in the sea to your south, you notice a small, green<br/>"+
				"bottle floating towards you in murky water.";
			if(ui.nongraphical) {
				add_message(current_location,desc,60);
			} else {
				var p = document.createElement("p");
				p.innerHTML = desc; 
				show_modal(p);
			}
		},
		on_enter:[
			function(){
				if(!locations.jetty.first_time) return;
				locations.jetty.first_time = false;
				locations.jetty.plot();
			}
		],
		description:"The wooden jetty is where you had expected Dr Strange's home-made steam launch to moor.", 
		illustrated:{
			x:516-100,y:3379-100,x2:768+200,y2:3556+300,
		},
		objects:[
			"bottle_closed_message",
		],
		commands:[
			Go("north","wood_pile"),
			Go("east","t_path"),
			Cmd(function(){locations.jetty.plot();},["explain plot","plot"]),
		],
	},
	t_path: {
		name:" ",
		description:"You are at a junction in the path; which direction do you want to go in?",
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
		description:"This court looks like it hasn't been used in years. The wonky net and long grass suggest that the Professor may not actually be that keen on tennis. As you wander, you trip over an old tennis racquet and try to pick it up, but the grass has claimed it as it's own and doesn't seem likely to relinquish it.",
		illustrated:{
			x:1072,y:2792,x2:1388,y2:3278,
		},
		objects:[
			"tennis_racket",
		],
		commands:[
			Go("south","t_path"),
			Go("north","south_yard"),
		],
	},
	wood_pile: {
		name:"Wood Pile",
		description:"A pile of wood. It's mostly garden hardwoods such as willow and apple, but there are a few leylandii in there.",
		illustrated:{
			x:617,y:2885,x2:874,y2:3030,
		},
		visits:0,
		on_enter:[
			function(){
				if(locations.wood_pile.visits++) return;
				add_message(current_location,"You give the pile a kick and a long-tailed hedgehog extracates itself, waggling said tail and flapping its ears in a bid to move faster.");
				move_npc(npcs.hedgehog,current_location);
			},
		],
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
		name:"Walled Vegetable Garden",
		description:"The carrots are coming up lovely this year, with only a little help from the moles pushing from below. Purple sprouting broccoli and artichokes take pride of place in this garden, with the more tasty foods sidelined in little beds around the edges.",
		illustrated:{
			x:411,y:2432,x2:975,y2:2868,
		},
		objects:[
			"wellingtons",
		],
		commands:[
			Go("east","south_yard"),
		],
	},
	conservatory: {
		name:"Conservatory",
		description: "South facing with large metal-framed glass windows, this conservatory is ideal for growing exotic plants. Wooden trestle benches are arranged in a 'U' shape. There are no plants on the benches. It is incredibly hot and stuffy in here.",
		illustrated:{
			layer:"house_ground_floor",
			x:285,y:781,x2:277,y2:330,
		},
		objects:[
			"hose",
		],
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
		name: "Garage",
		description: "The Professors garage contains several curious contraptions.",
		illustrated:{
			layer:"garage",
			x:0,y:0,w:719-405,h:1214-943,
		},
		visits:0,
		on_enter:[
			function(){
				if(locations.garage.visits++) return;
				var desc = "A woman and man have just chained their tandem bicycle across the garage door<br/>"+
					"The gentleman is sweating profusely; they seem to have pedelled up to the house in a great hurry";
				function done() {
					move_npc(npcs.woman,current_location);
				}
				if(ui.nongraphical) {
					add_message(current_location,desc,60);
					done();
				} else {
					var div = document.createElement("div");
					div.innerHTML = desc + "<br/><img src=\"tandem_arrive.jpg\"/>";
					show_modal(div);
					var dismiss = modaliser.dismiss;
					modaliser.dismiss = function(){
						done();
						dismiss();
					};
				}
			},
		],
		objects:[
			"bellows",
			"steam_engine",
		],
		commands:[
			Go("east","yard"),
		],
	},
	maze: {
		name:"The Labyrinth",
		illustrated:{
			x:397,y:317,x2:1073,y2:919,
		},
		on_enter:[
			function(){
				var choices = [
					"After an epic struggle and a few wrong turns, you reach the middle of the maze",
					"A preplexing struggle of wits with the gardener and you reach the middle of the maze",
					"What kind of man could build such a thing?  The maze is a real struggle to navigate",
				], choice = choices[Math.floor(Math.random()*choices.length)];
				add_message(current_location,choice);
			}
		],
		objects:[
			"summer_house",
		],
		commands:[
			Go("south","yard"),
		],
	},
	long_grass:{
		name:"Long Grass",
		description:"The grass is very long, and you keep tripping over things. This is obviously a place to put gardening tools and machinery when it reaches the end of its useful life. You stand on the head of a rake and its handle smacks you in the face. As the clouds cover the sun for a few moments, you feel a sense-of-humour failure coming on.",
		illustrated:{
			x:1730,y:3018,w:348,h:383,
		},
		objects:[
			"rake",
			"glass",
		],
		commands:[
			Go("south","rope_bridge"),
		],
	},
	rock:{
		name:"Island",
		description:"A rock is a rock is a rock. Or is it? Rumor has it that this rock was recently sold to an American industrialist on the mistaken understanding that it was the Isle of White.",
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
		name: "North Path",
		description:"A narrow path leads down to the water's edge",
		illustrated:{
			x:2161,y:571,w:522,h:215,
		},
		visits:0,
		on_enter:[
			function() {
				if(++locations.north_path.visits != 2) return;
				var desc = "As you reach the stony shore you look out and notice a small smokey dot on the east horizon.<br/>"+
					"As it grows nearer and nearer, and bigger and bigger, you see that it is a ginormous,<br/>"+
					"steam-belching Zeppelin!<br/>"+
					"It heads straight for the island and stops just a short distance from the shore.<br/>"+
					"Hovering just feet above the waves, it lowers a small steam launch which is started by two naval ratings.<br/>"+
					"a man steers deliberately towards you.";
				function done() {
					locations.north_path.illustrated.images = [
						{
							x:locations.north_path.illustrated.w-150,y:-25,
							image:"zeppelin_boat.png",
						},
					];
					locations.north_path.illustrated.w += 300;
					move_npc(npcs.baron,current_location);
				}
				if(ui.nongraphical) {
					add_message(current_location,desc,60);
					done();
				} else {				
					var zep = document.createElement("p");
					zep.setAttribute("class","modal_description");
					zep.innerHTML = "<img src=\"zeppelin.png\"/><br/>"+ desc;
					show_modal(zep);
					var dismiss = modaliser.dismiss;
					modaliser.dismiss = function(){
						done();
						dismiss();
					};
				}
			},
		],
		commands:[
			Go("west","secret_garden"),
			Cmd(function(){
				if(npcs.baron.location == current_location)
					add_message(current_location,"With the ratings awaiting on the Baron's great steam Zeppelin, you cannot expect to get far.");
				else {
					add_message(current_location,"A warning flare flashes above the great steam Zeppelin; you've been spotted and the Baron is doubtless hurrying on his way!");
					npc_says(npcs.baron,current_location,["My menz will hunt zu down like the dog you is!"]);
					move_npc(npcs.baron,current_location);
				}
			},["steal launch","take launch","steal boat","take boat"],function(){ return npcs.baron.location; }),
			Msg("It is a small, sturdy and surprisingly heavy launch with a small steam engine powering the oars",
				["examine launch"],function(){ return npcs.baron.location; }),
		],
	},
	hg_hall:{
		name: "Afternoon Room",
		description: "The sun shines brightly, illuminating great swathes of polished parquet floor. To the east are large french windows. To the west is an archway leading towards the front of the house.",
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
		name: "Fireplace",
		description:"A large Regency fireplace dominates the western wall of the room. ",
		illustrated:{
			layer:"house_ground_floor",
			x:300,y:350,w:288,h:183,
		},
		objects:[
			"matches",
		],
		commands:[
			Go("south","hg_dining"),
			Go("north","hg_hall"),
			Go("west","hg_kitchen"),
			Cmd(function(){
				add_message(current_location,"The majestic stone columns and cornice are a wonder to behold.");
				if(objects.matches.hidden) {
					add_message(current_location,"On the mantlepiece sits a box of matches."),
					objects.matches.hidden = false;
				}
			},["examine fireplace"]),
		],
	},
	hg_dining:{
		name: "Dining room",
		description: "The table is not laid. How unthoughtful.",
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
		name: "Entrance Hall",
		description: "From the unwelcoming sparsity of the front hall you deduce that the Professor does not wish for unwanted visitors. ",
		illustrated:{
			layer:"house_ground_floor",
			x:18,y:193,w:269,h:148,
		},
		objects:[
			"armor",
		],
		commands:[
			Go("east","hg_hall"),
			Go("upstairs","ht_landing"),
			Go("north","hg_toilet"),
		],
	},
	hg_toilet:{
		name:"Latrine",
		description:"The Professor is particularly proud of his newfangled water closet located inside the house. No more outdoors trips on blustery winter nights or chamber pots!",
		illustrated:{
			layer:"house_ground_floor",
			x:174,y:19,w:117,h:164,
		},
		commands:[
			Go("south","hg_front_hall"),
		],
	},
	hg_library:{
		name:"Library",
		description:"Large heavy wooden bookshelves dominate each side of the room. At the far end is a reading table with what appears to be a gramophone on it.",
		illustrated:{
			layer:"house_ground_floor",
			x:22,y:591,w:264,h:178,
		},
		objects:[
			"book_ends",
		],
		commands:[
			Go("east","hg_dining"),
		],
	},
	hg_kitchen:{
		name:"Kitchen",
		description: "The kitchen is on the west side of the house, with a large brick oven in the north eastern corner and heavy table on the north side. There is a dumb waiter in the north west corner and a sink in front of the window.",
		illustrated:{
			layer:"house_ground_floor",
			x:20,y:350,w:263,h:226,
		},
		objects:[
			"dumb_waiter",
			"cooking_pot",
		],
		commands:[
			Go("east","hg_fireplace"),
			Cmd(function() { go_to("hg_dumb_waiter"); },["climb into dumb waiter"],
				function() { return objects.dumb_waiter.examined; }),
		],
	},
	hg_dumb_waiter:{
		name:"Dumb Waiter Ground Floor",
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
		name:"Dumb Waiter Top Floor",
		description:"you are on the top floor",
		illustrated:{
			layer:"house_top_floor",
			x:-200,y:290,w:308,h:168,
		},
		commands:[
			Go("down","hg_dumb_waiter"),
			Cmd(function(){
				go_to("ht_observatory");
			},["climb out","get out"]),
		],
	},
	hb_dumb_waiter:{
		name:"Dumb Waiter Celler",
		description:"you are in the celler under the house; this is possibly the only way here",
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
		description:"Deep below the house, with thick stone walls and reinforced ceiling. ",
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
			"lab_hole",
		],
		commands:[
			Cmd(function(){
				go_to("hb_dumb_waiter");
			},["climb into dumb waiter"]),
			Go("east","cave"),
		],
	},
	hg_piano:{
		name:"Grand Johanna",
		description:"Someone has placed a large piano in front of the north door. The piano lid and fall are closed. ",
		illustrated:{
			layer:"house_ground_floor",
			x:301,y:19,w:285,h:165,
		},
		objects:[
			"music_sheet",
		],
		commands:[
			Go("north","yard"),
			Go("south","hg_hall"),
		],
	},
	ht_landing:{
		name:"landing",
		description:"The top of the stairs opens onto a hall that transverses the house. There are doors either side",
		illustrated:{
			layer:"house_top_floor",
			x:19,y:192,w:574,h:143,
		},
		commands:[
			Go("downstairs","hg_front_hall"),
			Go("north","ht_bedroom"),
			Go("south","ht_antiroom"),
		],
	},
	ht_bedroom:{
		name:"Bedroom",
		description:"The sparse bedroom has a queen (Victoria) sized bed. The bed is neatly made. Doesn't look like anyone sleeps here.",
		illustrated:{
			layer:"house_top_floor",
			x:173,y:14,w:416,h:171,
		},
		commands:[
			Go("south","ht_landing"),
		],
	},
	ht_antiroom:{
		name:"Anti-room",
		description:"This room appears empty. There are doors to the south and west.",
		illustrated:{
			layer:"house_top_floor",
			x:301,y:341,w:287,h:292,
		},
		commands:[
			Go("north","ht_landing"),
			Go("west","ht_observatory"),
			Go("south","ht_small_room"),
		],
	},
	ht_observatory:{
		name:"Observatory",
		description:"A large room dominated by a brass turntable, on which a large brass telescope is mounted.",
		illustrated:{
			layer:"house_top_floor",
			x:18,y:345,w:270,h:430,
		},
		objects:[
			"dumb_waiter",
			"cipher",
		],
		commands:[
			Go("east","ht_antiroom"),
			Cmd(function() { go_to("ht_dumb_waiter"); },["climb into dumb waiter"],
				function() { return objects.dumb_waiter.examined; }),
		],
	},
	ht_small_room:{
		name:"Small Room",
		description:"This is empty.",
		illustrated:{
			layer:"house_top_floor",
			x:300,y:642,w:289,h:127,
		},
		commands:[
			Go("north","ht_antiroom"),
		],
	},
	cave:{
		name:"Cave",
		description:"Once used by smugglers, the cave now appears empty. To the east you can see a small entrance open to the sea; a cool breeze hits your face, sea spray drips off your nose. On the north side there is a ladder.",
		illustrated:{
			layer:"cave",
			x:100,y:100,w:633,h:304,
		},
		visits:0,
		on_enter:[
			function(){
				if(++locations.cave.visits != 1) return;
				var desc = "After following a winding dark dank passage towards the salty doft and roar of the sea,<br/>"+
					"you arrive in a cave... As though awaiting your arrival, a gigantic octopus crawls ashore on cue";
				function done() {
					move_npc(npcs.octopus,current_location);
					add_message(current_location,"The octopus seems friendly; perhaps it too is a good friend of the professor?");
				}
				if(ui.nongraphical) {
					add_message(current_location,desc,60);
					done();
				} else {
					var p = document.createElement("p");
					p.innerHTML = desc += "<br/><img src=\"octopus_cave.jpg\"/>";
					show_modal(p);
					var dismiss = modaliser.dismiss;
					modaliser.dismiss = function(){
						done();
						dismiss();
					};
				}
			},
		],
		commands:[
			Go("west","lab"),
			Cmd(function(){ go_to("above_cave"); },["climb ladder","go up","up"]),
			Cmd(function() {
				if(in_array(inventory,"diving_suit"))
					add_message(current_location,"Donning your improvised diving suit, you step bravely into the sea<br/>"+
						"Underwater, you grope around for a while but do not find any treasure.  You return dejected and tired");
				else
					add_message(current_location,"The sea is cold and uninviting; you are not really equipped to survive it.");
			},["go east","exit east","east"]),
		],
	},
	above_cave:{
		name:"Cliff Top",
		illustrated:{
			x:2303,y:2900,w:633,h:304,
		},
		on_enter:[
			function(){
				add_message(current_location,"As you climb out of the trap door from the cave, the trap door falls softly shut behind you.<br/>"+
					"It fits so well it is difficult to believe there is a trap door there.");
			},
		],
		commands:[
			Go("north","west_point"),
			Go("south","promontory"),
		],
	},
}, current_location = null;

var illustrated_layers = {
	base:{
		x:0,y:0,
	},
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
	garage:{
		x:405,y:943,
		image:"garage_interior.jpg",
	},
	cave:{
		x:2303,y:2900,
		image:"cave_interior.jpg",
	},
	lantern:{
		x:2920,y:960,
		image:"lanten.jpg", //####sic
	},
};

var objects = {
	bottle_closed_message:{
		name:"bottle",
		take:Take("bottle_closed_message","bottle"),
		drop:Drop("bottle_closed_message","bottle"),
		commands:[
			Msg("It is blown from green glass and smells strongly of rum.  The bottle is corked; it contains a letter",["examine bottle"]),
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
			Msg("It is blown from green glass and smells strongly of rum.  The bottle is open",["examine bottle"]),
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
			Msg("It is blown from green glass and smells strongly of rum.  The bottle is closed",["examine bottle"]),
			Cmd(function() {
				exchange_object("bottle_closed",["bottle_open"],
					"you uncork the bottle, the whiff of strong alcohol nearly knocks you backward");
			},["open bottle","uncork bottle"]),
		],
	},
	music_sheet:{
		name:"Sheet of Music",
		take:Take("music_sheet","music"),
		drop:Drop("music_sheet","music"),
		commands:[
			Cmd(function() {
				var img = document.createElement("img");
				img.src = "music_sheet.jpg";
				show_modal(img);
			},["read music","examine music","examine sheet music","read sheet music"]),
		],		
	},
	mosaic:{
		name:"bird bath with decorative bottom",
		commands:[
			Cmd(function() {
				var img = document.createElement("img");
				img.src = "mosaic.png";
				show_modal(img);
			},["examine bird bath","examine bath"]),
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
	helmet:{
		name:"a diving helmet",
		take:Take("diving helmet","helmet"),
		drop:Drop("diving helmet","helmet"),
		commands:[
			Msg("Considering its provenance, its really very well suited to diving",["examine diving helmet","examine helmet"]),
			Msg("It is exceedingly uncomfortable and cumbersome on dry land; you quickly take it off again",["put on helmet","wear helmet"]),
		],
	},
	rake:{
		name:"a rake",
		take:Take("rake","rake"),
		drop:Drop("rake","rake"),
		commands:[
			Msg("An old and well-worn gardening rake",["examine rake"]),
		],
	},
	glass:{
		name:"a round sheet of glass",
		take:Take("glass","glass"),
		drop:Drop("glass","glass"),
		commands:[
			Msg("It is a round sheet of glass",["examine glass"]),
		],
	},
	cooking_pot:{
		name:"cooking pot",
		take:Take("cooking_pot","pot"),
		drop:Drop("cooking_pot","pot"),
		commands:[
			Msg("a large almost spherical pressure cooking pot",["examine pot","examine cooking pot"]),
			Cmd(function(){
				combine_objects(["glass","cooking_pot"],"helmet","The glass fits the cooking pot perfectly!");
			},["put glass in cooking pot"],function(){ return is_object_here("glass"); }),
		],
	},
	book_ends:{
		name:"a pair of book ends",
		take:Take("book_ends","book ends"),
		drop:Drop("book_ends","book ends"),
		commands:[
			Msg("Two heavy lead book ends",["examine book ends"]),
			
		],
	},
	hose:{
		name:"a length of garden hose",
		take:Take("hose","hose"),
		drop:Drop("hose","hose"),
		commands:[
			Msg("a good strong garden hose about 60 feet long",["examine hose","examine Garden hose"]),
			
		],
	},
	wellingtons:{
		name:"a pair of Wellington Boots",
		take:Take("wellingtons","boots"),
		drop:Drop("wellingtons","boots"),
		commands:[
			Msg("A good pair of rubber wellies. They fit your size.",["examine boots","examine wellington boots"]),
			
		],
	},
	armor:{
		name:"a suit of armor",
		take:Take("armor","armor"),
		drop:Drop("armor","armor"),
		commands:[
			Msg("A suit of armor, about your size.",["examine suit of armor","examine armor"]),
			Cmd(function(){
				combine_objects(["air_supply","helmet","book_ends","wellingtons","armor"],"diving_suit",
					"You attach the book ends and wellingtons to the armor.  With the air supply and helmet you've improvised, its an impressive diving suit!");
			},["create diving suit"],function(){ 
				return are_objects_here(["air_supply","helmet","book_ends","wellingtons","armor"]); 
			}),
		],
	},
	bellows:{
		name:"bellows",
		take:Take("bellows","bellows"),
		drop:Drop("bellows","bellows"),
		commands:[
			Msg("A large set of bellows used for blowing air.",["examine bellows"]),
			Cmd(function(){
				combine_objects(["hose","bellows"],"air_supply","The hose fits tightly to the end of the bellows");
			},["attach bellows to hose"],function(){ return is_object_here("hose"); }),
		],
	},
	air_supply:{
		name:"a divers air supply",
		take:Take("air_supply","air supply"),
		drop:Drop("air_supply","air supply"),
		commands:[
			Msg("You have improvised a perfect apparatus for supplying a diver with oxygen!",["examine air supply"]),
		],
	},
	brick:{
		name:"a brick",
		take:Take("brick","brick"),
		drop:Drop("brick","brick"),
		commands:[
			Msg("A heavy building brick.",["examine brick"]),
			
		],
	},
	steam_engine:{
		name:"a small steam engine",
		take:Take("steam_engine","steam engine"),
		drop:Drop("steam_engine","steam engine"),
		commands:[
			Msg("The steam car has a perfectly good steam engine but it has recently been repaired and is not attached to the car.",["examine steam engine","examine engine"]),
			
		],
	},
	plank:{
		name:"a plank",
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
			Cmd(function(){
				combine_objects(["glass","stove"],"helmet","The glass fits the stove's fire-box perfectly!");
			},["put glass in the stove"],function(){ return is_object_here("glass"); }),
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
				if(npcs.robot.location)
					add_message(current_location,"There is the sharp outline in the dust where the robot had laid dormant");
				else
					add_message(current_location,"There are what appears to a half-disassembled robot on the bench.  It doesn't look like its in workable condition.");
				if(!objects.lab_bench.examined) {
					add_message(current_location,"There are some tools littering the table.");
					objects.lab_bench.examined = true;
					objects.hammar.hidden = objects.spanner.hidden = false;
				}
			},["examine lab bench","examine bench","examine table"]),
			Cmd(function() {
				add_message(current_location,"You make short work of repairing the robot");
				move_npc(npcs.robot,current_location);
			},["repair robot"],function(){return !objects.hammar.hidden && !npcs.robot.location;}),
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
	lab_hole:{
		name:"a hole in the east wall",
		commands:[
			Msg("a rough hole hewn in the east wall leads deep underground away from the house",["examine hole"]),
		],
	},
	tennis_racket:{
		name:"a tennis racket",
		commands:[
			Msg("The tennis racket is truly entwined in the grass",["examine racket"]),
			Msg("The tennis racket won't move",["take racket"]),
		],
	},
	summer_house:{
		name:"The summer house in the middle of the Labyrinth",
		examined:false,
		commands:[
			Cmd(function(){
				add_message(current_location,"The summer house is little more than a bench with a roof, but its very nicely done and the overall effect is most charming");
				if(!objects.summer_house.examined) {
					objects.summer_house.examined = true;
					locations.maze.objects.push("moby_dick");
					add_message(current_location,"There is a copy of the novel Moby Dick on the bench");
				}
			},["examine summer house","look at summer house"]),
		],
	},
	moby_dick:{
		name:"the novel Moby Dick",
		take:Take("moby_dick","moby dick"),
		drop:Drop("moby_dick","moby dick"),
		commands:[
			Cmd(function(){
				var div = document.createElement("div");
				div.innerHTML = "Which page?<br/>"+
					"<input type=\"text\" id=\"moby_dick\" onkeypress=\"moby_dick_keypress(event);\"></input>";
				show_modal(div);
				setTimeout(function(){
						document.getElementById("moby_dick").focus();
				},0);
			},["read moby dick"]),
		],
	},
	cipher:{
		name:"a curious note written in what appear to be hieroglyphs",
		take:Take("cipher","note"),
		drop:Drop("cipher","note"),
		commands:[
			Cmd(function(){
				var img = document.createElement("img");
				img.src = "code.jpg";
				show_modal(img);
			},["examine note","look at note"]),
		],
	},
	matches:{
		name:"a box of matches",
		hidden:true,
		take:Take("matches","matches",function(){return !objects.matches.hidden;}),
		drop:Drop("matches","matches"),
		commands:[
			Msg("It is a perfectly normal box of matches",["examine matches"]),
			Msg("You really shouldn't play with matches!",["light a match","light match"],function(){return current_location != locations.lantern;}),
			Cmd(function(){
				if(npcs.pirates.location) {
					var desc = "With a roar the wick bursts into life, shining its beam across the sea at the pirate boat<br/>"+
						"With great calamity the pirate crew aboard run around panicking";
					function done() {
						npc_says(npcs.pirates_aboard,current_location,[
							"Ashore Ahoy!  There is a light house!  Have you not seen any rocks?  It is not safe to moor here!",
							"Ashore Ahoy!  We are captured in the beam of a death ray!  Run away, run away!",
						]);
						npc_says(npcs.pirates,current_location,[
							"Quick we flee!",
							"I cannot run any faster, my wooden leg keeps getting stuck in the sand",
						]);
						add_message(current_location,"With brisk strokes, the pirates swim splashingly panickingly out to their galleon and depart");
						move_npc(npcs.pirates); // remove them
					}
					if(ui.nongraphical) {
						add_message(current_location,desc);
						done();
					} else {
						var div = document.createElement("div");
						div.innerHTML = desc + "<br/><img src=\"lighthouse_lit.jpg\"/>";
						show_modal(div);
						var dismiss = modaliser.dismiss;
						modaliser.dismiss = function() {
							done();
							dismiss();
						}
					}
				} else
					add_message(current_location,"With a small puff the wick flickers and goes lamely out.");
			},["light lamp","light a match","light match"],function(){return current_location == locations.lantern;}),
		],
	},
	diving_suit:{
		name:"a diving suit",
		commands:[
			Msg("It is an extremely improvised diving suit you have made",["examine diving suit"]),
			Msg("Its not really meant to be worn on land!",["put on diving suit","Don diving suit","wear diving suit"]),
		],
	},
};

function moby_dick_keypress(event) {
	if(event.keyCode == 13) {
		if(event.target.value.trim() == "102") {
			var img = document.createElement("img");
			img.src = "moby_dick.jpg";
			show_modal(img);
		} else {
			alert("Trust me, that isn't the page you're looking for!");
			dismiss();
		}
	}
}

function you_win() {
	var div = document.createElement("div");
	div.innerHTML = "<h3>You win!</h3>"+
		"<img src=\"treasure.jpg\"/><br/>"+
		"Descending slowly into the cove, your feet stir up sediment that quickly clouds the clear turquoise waters. "+
		"In the distance you hear bells tolling, their sound increasing steadily as you press on. Slowly you perceive "+
		"a dense shape looming ahead. It is a stone pyramid through which an small ancient tree is growing. The World "+
		"Tree connects the physical world with the spiritual world, supporting the heavens, middleworld and underworld.<br/>"+
		"The tree is slowly corroding in the salty water. As you get closer you see that corrosion has exposed thousands, "+
		"millions of small diamonds each one representing a star of the Milky Way running through its core as if blood in "+
		"veins, pumping life to the world.<br/>"+
		"You grab a shell from the seabed and start hacking away frantically at the diamonds, gathering them in your pockets "+
		"and folds of your clothing.  You judge it to be worth a small fortune!";
	show_modal(div);
	modaliser.dismiss = function(){}; // stuck here forever
}

var npcs = {
	octopus:{
		name:"A large octopus",
		illustrated:{
			avatar:"char_octopus.png",
		},
		lines:{
			greet:[
				"The octopus' third tentacle strokes your shoulder affectionately, like a fat boy sizing up his next sausage",
			],
			filler:[
				"...is daydreaming of mermaids and mint humbugs. It is a very sticky situation. ",
				"...chuckles knowingly to himself ",
				"...scratches his bulbous head. ",
				"...looks thoughtful. Or sleepy. Possibly both. ",
				"...is pointing with his tentacles as if to hint. Maybe the treasure is in eight directions from here? ",
			],
		},
	},
	robot:{
		name:"Robot",
		illustrated:{
			avatar:"char_robot.png",
		},
		lines:{
			greet:[
				"Th-an-k_u.",
			],
			filler:[
				"...Looks skywards, rolls his eyes with mechanical efficiency. Bbe...p. ",
				"...looks contemplative and then sighs and shakes his head. Beep. ",
			],
		},
	},
	sioux:{
		name:"The Sioux Indians",
		illustrated:{
			avatar:"char_sioux.png",
		},
		lines:{
			greet:[
				"Great chief sends me to claim many treasures. He says fire water is like truth serum. ",
			],
			woman:{
				filler:["What a lovely scalp you have"],
			},
		},
	},
	woman:{
		name:"The Bossy Woman and her husband",
		illustrated:{
			avatar:"char_woman.png",
		},
		lines:{
			greet:[
				"I say, I heard about the poor Professor's prediciment and I thought it best to <i>hurry</i> over here and check everything is alright... what with all this talk of Mayan treasure and all?",
			],
			filler:[
				"Great scott, what a warm day for a treasure hunt this is!",
				"This is most vexing, oh do hurry up!",
				"Did you hear that darling? Oh do take notes!",
				"Really! This is all rather much!",
				"Will there be sandwiches? ",
				"Anyone for Battenberg? No, I thought as not.",
			],
			sioux:{
				greet:[
					"Now hang on a second, we can't have you Indians here waving your tomahawks around; it'll end in tears, you mark my words",
				],
				filler:[
					"Must have been strenous work to get across the atlantic like you Indians did",
					"There's no gulf stream for canoists to follow home you know",
				],
			},
			baron:{
				greet:[
					"Baron! Fancy seeing you here. I do hope you are not here for purposes other than plunder and pillage",
				],
				filler:[
					"Anyone for Battenberg? No, I thought as not.",
				],
			},
		},
	},
	baron:{
		name:"The Baron",
		illustrated:{
			avatar:"char_baron.png",
		},
		greet:[
			"Good day there! I am the Baron Von Battenberg, and I have been sent by is excellency the Kaiser to claim the treas.. I mean, to lay claim to any, things, that may be laying around.",
		],
		filler:[
			"I claim this grass in the name of the German Empire!",
			"I claim that tree in the name of the German Empire!",
			"I claim that bird in the name of the German Empire. !!!Bang.!!! ",
			"We have ways of making you talk.",
			"Even octopuses will talk if you ask them in the correct manner.",
			"I claim that cloud in the name of the German Empire!",
			"I claim this moment in the name of the German Empire!",
			"I claim that cloud in the name of the German Empire!",
			"You see, I am only here to innocently claim inanimate objects that you do not need. I mean no harm.",
			"I come in peace. By Zeppelin I admit. But very peacefully.",
			"Gunboat diplomacy is for people who don't have Zeppelins.",
			"Genau.",
		],
		sioux:{
			greet:[
				"Savage! What are you doing here? I thought I sunk your tiny little boat earlier??",
			],
			filler:[
				"I claim the feathers in your hair in the name of the German Empire!",
			],
		},
	},
	hedgehog:{
		name:"Hedgehog",
		illustrated:{
			avatar:"char_hedgehog.png",
		},
	},
	pirates:{
		name:"Pirates",
		illustrated:{
			avatar:"char_pirates.png",
		},
		greet:[
			"Ahoy! thar. I hear thar be treaaye in this here place.",
		],
		filler:[
			"Would ye like t'try again?",
			"a bottle o' rum be required",
			"Rum. Rum. Rum!",
			"did I tell you t' tail o' t' frigate and t' giant squid?",
			"treaaye",
		],
	},
	pirates_aboard:{
		name:"Pirates about ship",
	},
	
};

