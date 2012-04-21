
function Go(dir,key) {
	var functor = function() {
		go_to(key);
	};
	functor.command = ["go "+dir,"exit "+dir,dir];
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
	if(event.keyCode == 66 && event.ctrlKey) {
		if(++ui_index >= uis.length) ui_index = 0; // cycle through available UIs
		set_ui(uis[ui_index]);
		return false;
	}
	var line = event.target.value.trim().toLowerCase().replace(/\s+/g," ");
	ui.on_commandline(current_location,event,line);
	if(event.keyCode == 13) {
		if(line == "!show map") {
			var restore = current_location.key, location;
			for(location in locations)
				go_to(location);
			go_to(restore);
		} else if(line.startsWith("!goto ")) {
			var location = line.substring(6).trim();
			if(location in locations)
				go_to(location);
			else
				console.log("could not go to "+location);
		} else if(line.length) {
			var commands = ui.get_commands(current_location), command;
			for(command in commands)
				if(command == line) {
					commands[command]();
					return true;
				}
			console.log("could not "+line);
		}
	}
	return true;
}

function get_commands(location,standard_commands) {
	var commands = {}, command, alias;
	if(standard_commands)
		commands = union(commands,standard_commands);
	for(command in location.commands)
		for(alias in location.commands[command].command)
			commands[location.commands[command].command[alias].toLowerCase()] = location.commands[command];
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
		ui.get_commandline(current_location).onkeydown = on_commandline;
		ui.perform_layout();
	}
	var commandline = ui.get_commandline(current_location);
	commandline.style.display="block";
	commandline.select();
	ui.scroll_into_view(current_location);
}

function new_game() {
	go_to("quay");
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
		if(location) {
			var commandline = ui.get_commandline(location), old_commandline_text = commandline.value;
			var block = ui.create_location(location);
			main.replaceChild(block,location.ui);
			location.ui = block;
			block.location = location;
			commandline = ui.get_commandline(location);
			commandline.value = old_commandline_text;
			commandline.style.display=(location==current_location?"block":"none");
			commandline.onkeydown = on_commandline;
		}
	}
	ui.perform_layout();
	if(current_location)
		go_to(current_location.key);
}
