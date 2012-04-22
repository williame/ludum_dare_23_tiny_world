
function Cmd(functor,cmds,condition) {
	functor.commands = cmds;
	functor.condition = condition;
	return functor;
}

function Go(dir,key,condition) {
	return Cmd(function() { go_to(key); },["go "+dir,"exit "+dir,dir],condition);
}

function Take(obj,name,condition) {
	return Cmd(function(){
		remove_from_array(current_location.objects,obj);
		inventory.push(obj);
		add_message(current_location,"you took the "+name);
	},["take "+name],condition);
}

function Drop(obj,name,condition) {
	return Cmd(function(){
		remove_from_array(inventory,obj);
		current_location.objects.push(obj);
		add_message(current_location,"you dropped the "+name);
	},["drop "+name],condition);
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
	return commands;
}

function go_to(key) {
	console.log("go_to("+key+")");
	if(current_location) {
		ui.get_commandline(current_location).style.display="none";
	}
	current_location = locations[key];
	console.log("going to",current_location.name);
	var block = current_location.ui;
	if(!block) {
		console.log("creating "+current_location.name);
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
	ui.enter_room(current_location);
	ui.scroll_into_view(current_location);
}

function refresh_location(location) {
	location = locations[location];
	var commandline = ui.get_commandline(location);
	var block = ui.create_location(location);
	location.ui.parentNode.replaceChild(block,location.ui);
	location.ui = block;
	block.location = location;
	var new_commandline = ui.get_commandline(location);
	new_commandline.parentNode.replaceChild(commandline,new_commandline);
	commandline.style.display=(location==current_location?"block":"none");
	commandline.onkeydown = on_commandline;
	ui.perform_layout();
	if(location === current_location)
		commandline.focus();
}

var inventory;

function new_game() {
	inventory = [];
	go_to("jetty");
}

function add_message(location,message) {
	remove_from_array(location.messages,message);
	location.messages.push(message);
	setTimeout(function(){
		if(remove_from_array(location.messages,message))
			refresh_location(location.key);
	},1000*3);
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

function is_modal() {
	return document.getElementById("modal").style.display != "none";
}

function dismiss_modal() {
	document.getElementById("modal").style.display = "none";
	refresh_location(current_location.key);
}

function show_modal(modal) {
	var container = document.getElementById("modal");
	container.innerHTML = "";
	container.appendChild(modal);
	container.style.display = "block";
}

function init_locations() {
	var location, count = 0;
	// init them; todo: validate them?
	for(location in locations) {
		locations[location].key = location;
		location = locations[location];
		if(!location.name)
			location.name = "!"+location.key;
		if(!location.objects)
			location.objects = [];
		location.messages = [];
		count++;
	}
	console.log("there are "+count+" locations!");
}
