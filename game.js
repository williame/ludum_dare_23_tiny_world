
function Cmd(functor,cmds,condition) {
	functor.commands = cmds;
	functor.condition = condition;
	return functor;
}

function Go(dir,key,condition) {
	var go = Cmd(function() { go_to(key); },["go "+dir,"exit "+dir,dir],condition);
	go.go = key; // so npcs know its navigable
	return go;
}

function Take(obj,name,condition) {
	return Cmd(function(){
		remove_from_array(current_location.objects,obj);
		inventory.push(obj);
		add_message(current_location,"you took the "+name);
	},["take "+name,"pick up "+name],condition);
}

function Drop(obj,name,condition) {
	return Cmd(function(){
		remove_from_array(inventory,obj);
		current_location.objects.push(obj);
		add_message(current_location,"you dropped the "+name);
	},["drop "+name,"discard "+name],condition);
}

function Msg(msg,cmds,condition) {
	return Cmd(function() { add_message(current_location,msg); },cmds,condition);
}

function remove_from_array(array,obj) {
	for(var i in array)
		if(array[i] === obj) {
			array.splice(i,1);
			return true;
		}
	return false;
}

function in_array(array,obj) {
	for(var i in array)
		if(array[i] === obj)
			return true;
	return false;
}

function getattr(obj,attr) {
	var result = (obj.getAttribute && obj.getAttribute(attr)) || null;
	if(!result && obj.attributes)
		for(var i = 0; i < obj.attributes.length; i++)
			if(obj.attributes[i].nodeName === attr)
				return obj.attributes[i].nodeValue;
	return result;
}

function hasattr(obj,name) {
	return getattr(obj,name) != null;
}

function union(assoc_array_1,assoc_array_2) {
	var ret = {}, key;
	for(key in assoc_array_1)
		ret[key] = assoc_array_1[key];
	for(key in assoc_array_2)
		ret[key] = assoc_array_1[key];
	return ret;
}

function on_commandline(event) {
	if(is_modal()) {		
		dismiss_modal();
		return false;
	}
	if(event.keyCode == 66 && event.ctrlKey) {
		console.log("changing ui!");
		if(++ui_index >= uis.length) ui_index = 0; // cycle through available UIs
		set_ui(uis[ui_index]);
		return false;
	}
	var line = event.target.value.trim().toLowerCase().replace(/\s+/g," "),
		location = current_location;
	ui.on_commandline(location,event,line);
	if(event.keyCode == 13) {
		if(line == "!show map") {
			var restore = location.key;
			for(location in locations)
				go_to(location);
			go_to(restore);
		} else if(line.startsWith("!goto ")) {
			location = line.substring(6).trim();
			if(location in locations)
				go_to(location);
			else
				console.log("could not go to "+location);
		} else if(line == "!refresh") {
			refresh_location(current_location.key);
		} else if(line.length) {
			var commands = ui.get_commands(location), command;
			ui.get_commandline(location).select();
			for(command in commands)
				if(command == line) {
					commands[command]();
					ui.get_commandline(location).select();
					return true;
				}
			ui.set_error(location,"could not "+line);
			ui.get_commandline(location).select();
		}
	}
	return true;
}

function get_commands(location,standard_commands) {
	var commands = {
		"inventory":function() {
			var description = "";
			if(inventory.length) {
				for(var i in inventory) {
					if(!description.length)
						description = "you are carrying ";
					else
						description += ", ";
					description += objects[inventory[i]].name;
				}
			} else
				description = "you aren't carrying anything";
			add_message(location,description);
		},
		"look":function() {
			if(current_location.description)
				add_message(current_location,current_location.description);
			else
				add_message(current_location,"There is no description, sorry");
			if(current_location.objects.length) {
				var description = "";
				for(var i in current_location.objects) {
					var object = objects[current_location.objects[i]];
					if(object.hidden) continue;
					if(!description.length)
						description = "There is ";
					else
						description += ", ";
					description += object.name;
				}
				if(description.length)
					add_message(location,description);
			}
		},
		"help":function() {
			if(location.hint)
				add_message(loction,location.hint);
			ui.show_commands(location,commands);
		},
	};
	var command, object;
	if(standard_commands)
		commands = union(commands,standard_commands);
	function add_commands(command) {
		if(command.condition && !command.condition())
			return;
		for(var alias in command.commands)
			commands[command.commands[alias]] = command;
	}
	function add_object(key) {
		var object = objects[key];
		if(in_array(inventory,key)) {
			if(object.drop)
				add_commands(object.drop);
		} else if(object.take)
			add_commands(object.take);
		for(command in object.commands)
			add_commands(object.commands[command]);
	}
	for(object in inventory)
		add_object(inventory[object]);
	if(location.objects)
		for(object in location.objects)
			add_object(location.objects[object]);
	for(command in location.commands)
		add_commands(location.commands[command]);
	for(var npc in location.npcs) {
		npc = location.npcs[npc];
		for(command in npc.commands)
			add_object(npc.commands[command]);
	}
	return commands;
}

function go_to(key) {
	var now = new Date().getTime();
	console.log("go_to("+key+")",now);
	var old_location = current_location;
	current_location = locations[key];
	current_location.entered = now;
	if(old_location) {
		ui.get_commandline(old_location).style.display="none";
		// if you move slowly between rooms, npcs follow
		if((now - old_location.entered) > 2000) { // 2 seconds
			var move_npcs = old_location.npcs.slice();
			for(var npc in move_npcs) {
				npc = move_npcs[npc];
				move_npc(npc,locations[key]);
			}
		} else if(old_location.npcs.length && !npc_ticker)
			npc_ticker = setTimeout(npc_tick,1000*20); // move them randomly starting in 20 seconds
	}
	var block = current_location.ui;
	if(!block) {
		block = current_location.ui = ui.create_location(current_location);
		block.location = current_location;
		document.getElementById("main").appendChild(block);
		if(current_location.description)
			add_message(current_location,current_location.description);
		ui.get_commandline(current_location).onkeydown = on_commandline;
		ui.perform_layout();
	}
	var commandline = ui.get_commandline(current_location);
	commandline.style.display="block";
	commandline.select();
	if(current_location.on_enter)
		for(var trigger in current_location.on_enter)
			current_location.on_enter[trigger]();
	ui.enter_room(current_location);
	ui.scroll_into_view(current_location);
}

function refresh_location(location) {
	location = locations[location];
	var commandline = ui.get_commandline(location);
	var block = ui.create_location(location);
	if(!block) return; // wrong layer in illustrations for example
	location.ui.parentNode.replaceChild(block,location.ui);
	location.ui = block;
	block.location = location;
	var new_commandline = ui.get_commandline(location);
	new_commandline.parentNode.replaceChild(commandline,new_commandline);
	commandline.style.display=(location==current_location?"block":"none");
	commandline.onkeydown = on_commandline;
	ui.perform_layout(location);
	if(location === current_location)
		commandline.focus();
}

var npc_ticker = null;

function npc_tick() {
	var roaming = 0;
	for(var npc in npcs) {
		npc = npcs[npc];
		if(npc.location && (npc.location != current_location)) {
			var commands = get_commands(npc.location), command, go = [];
			for(command in commands) {
				command = commands[command];
				if(command.go)
					go.push(command.go);
			}
			if(go.length)
				move_npc(npc,locations[go[Math.floor(Math.random()*go.length)]]);
			roaming++;
		}
	}
	if(roaming>0)
		npc_ticker = setTimeout(npc_tick,1000*60); // every minute
	else
		npc_ticker = null;
}

function npc_says(npc,location,list) {
	if(!list) return;
	if(!location.ui) return;
	var msg = list[Math.floor(Math.random()*list.length)];
	add_message(location,"<span class=\"talker\">"+npc.handle+"</span> <span class=\"speech\">"+msg+"</span>");
}

function move_npc(npc,location) {
	// going from
	if(npc.location) {
		remove_from_array(npc.location.npcs,npc);
		if(npc.location.ui)
			ui.update_npcs(npc.location);
	}
	// to
	npc.location = location;
	if(location) {
		location.npcs.push(npc);
		if(location.ui)
			ui.update_npcs(location);
	}
	// work out if they say anything
	if(location == current_location) {
		var msg = [];
		if(!npc.greeted && npc.lines.greet.length) {
			npc.greeted = true;
			msg = npc.lines.greet;
		}
		if(!msg.length && (location.npcs.length > 1))
			for(var other in location.npcs) {
				other = location.npcs[other];
				if(other === npc) continue;
				if(!hasattr(npc.lines,other.key)) continue;
				var lines = npc.lines[other.key];
				if(!lines) continue;
				if(!lines.greeted && lines.greet.length) {
					lines.greeted = true;
					msg = msg.concat(lines.greet);
				} else if(lines.filler.length)
					msg = msg.concat(lines.filler);
			}
		if(!msg.length && npc.lines.filler.length)
			msg = npc.lines.filler;
		if(msg.length)
			npc_says(npc,location,msg);
	}
}

var inventory;

function new_game() {
	inventory = [];
	// reset all objects etc; not going to happen
	go_to("jetty");
}

function add_message(location,message) {
	remove_from_array(location.messages,message);
	location.messages.push(message);
	setTimeout(function() {
		if(remove_from_array(location.messages,message))
			refresh_location(location.key);
	},1000*20);
	refresh_location(location.key);
}

function exchange_object(from,to,msg) {
	if(remove_from_array(inventory,from))
		inventory = inventory.concat(to);
	else if(remove_from_array(current_location.objects,from))
		current_location.objects = current_location.objects.concat(to);
	if(msg)
		add_message(current_location,msg);
}

var uis = [], ui = null, ui_index = -1;
function set_ui(new_ui) {
	if(ui === new_ui) return;
	if(ui && ui.hide)
		ui.hide();
	for(ui_index in uis)
		if(uis[ui_index] == new_ui)
			break;
	ui = uis[ui_index];
	console.log("UI is "+ui.name);
	var main = document.getElementById("main"), i, location;
	ui.init();
	for(i in main.childNodes) {
		location = main.childNodes[i].location;
		if(location)
			refresh_location(location.key);
	}
	ui.perform_layout();
	if(current_location)
		go_to(current_location.key);
}

var modaliser = null;

function is_modal() {
	return modaliser != null;
}

function dismiss_modal() {
	if(modaliser) {
		modaliser.dismiss();
		if(!modaliser && current_location)
			refresh_location(current_location.key);
	}
}

function show_modal(modal) {
	dismiss_modal();
	var container = document.getElementById("modal");
	container.innerHTML = "";
	modal.style.maxWidth = modal.style.maxHeight = "100%";
	container.appendChild(modal);
	container.style.display = "block";
	modaliser = {
		dismiss:function() {
			document.getElementById("modal").style.display = "none";
			modaliser = null;
		},
	}
}

function init_game_data() {
	var location, count = 0;
	// init them; todo: validate them?
	for(location in locations) {
		locations[location].key = location;
		location = locations[location];
		if(!location.name) {
			console.log("unamed location",location.key);
			location.name = "!"+location.key;
		}
		if(!location.objects)
			location.objects = [];
		location.messages = [];
		count++;
		if(!location.illustrated.layer)
			location.illustrated.layer = "base";
		location.npcs = [];
	}
	console.log("there are "+count+" locations!");
	var object;
	count = 0;
	for(object in objects) {
		objects[object].key = object;
		object = objects[object];
		if(!object.name) {
			console.log("unamed object",object.key);
			object.name = "!"+object.key;
		}
		count++;
	}
	console.log("there are "+count+" objects!");
	var npc;
	count = 0;
	for(npc in npcs) {
		npcs[npc].key = npc;
		npc = npcs[npc];
		if(!npc.name) {
			console.log("unamed npc",npc.key);
			npc.name = "!"+npc.key;
		}
		if(!npc.handle)
			npc.handle = npc.name;
		if(!npc.lines)
			npc.lines = {}
		if(!npc.lines.greet)
			npc.lines.greet = [];
		if(!npc.lines.filler)
			npc.lines.filler = [];
		if(!npc.commands)
			npc.commands = [];
		count++;
	}
	console.log("there are "+count+" npcs!");
}
