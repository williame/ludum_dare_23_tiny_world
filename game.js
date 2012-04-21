
function Go(dir,key) {
	var functor = function() {
		go_to(key);
	};
	functor.command = ["go "+dir,"exit "+dir];
	return functor;
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
	var line = event.target.value.trim().replace(/\s+/g," ");
	ui.on_commandline(current_location,event,line);
	if(event.keyCode == 13) {
		line = line.toLowerCase();
		var commands = ui.get_commands(current_location), command;
		for(command in commands)
			if(command == line) {
				commands[command]();
				return;
			}
		console.log("could not "+line);
	}
}

function get_commands(location,standard_commands) {
	var commands = {}, command, alias;
	if(standard_commands)
		commands = union(commands,standard_commands);
	for(command in location.commands)
		for(alias in location.commands[command].command)
			commands[location.commands[command].command[alias]] = location.commands[command];
	return commands;
}

function go_to(key) {
	console.log("go_to("+key+")");
	if(current_location) {
		console.log("was at",current_location.name);
	}
	current_location = locations[key];
	console.log("going to",current_location.name);
	var block = current_location.ui;
	if(!block) {
		console.log("creating "+current_location.name);
		block = current_location.ui = ui.create_location(current_location);
		block.setAttribute("id","loc_"+key);	
		document.getElementById("main").appendChild(block);
		ui.get_commandline(current_location).onkeydown = on_commandline;
	}
	ui.scroll_into_view(current_location);
	ui.get_commandline(current_location).focus();
}

function new_game() {
	go_to("quay");
}

var ui = null;
function set_ui(new_ui) {
	if(ui) {
		if(ui === new_ui) return;
		alert("have to remove old ui");
		return;
	}
	ui = new_ui;
	ui.init();
}
