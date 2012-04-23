
function _classic_create_location(location) {
	var block = document.createElement("code");
	var html =
		"<a name=\"location_"+location.key+"\"/>"+
		"<b>"+location.name+"</b><br/>"+
		"<div id=\"npcs_"+location.key+"\"></div>";
	for(var message in location.messages)
		html += "<div class=\"message\">"+location.messages[message]+"</div>"
	html += "<input class=\"commandline\" id=\"commandline_"+location.key+"\"/><br/>"+
		"<div id=\"auto_complete_"+location.key+"\" style=\"display:none;\"></div>"+
		"<div id=\"error_"+location.key+"\" style=\"display:none;\" class=\"error\"></div>";
	block.innerHTML = html;
	setTimeout(function(){ classic_ui.update_npcs(location); },0);
	return block;
}

var code_ui = {
	name: "programmer at work (pretending to work) mode",
	init: function() {
		document.getElementById("main_css").href = "code.css";
		if(!code_ui._elements.length) {
			var body = document.getElementsByTagName("body")[0];
			// left
			var div = document.createElement("div");
			code_ui._elements.push(div);
			div.style.position="fixed";
			div.style.top="79px";
			div.style.width="263px";
			div.style.bottom="0px";
			div.style.background = "transparent url('code_gui_left_middle.jpg')";
			div.innerHTML = "<img src=\"code_gui_left_top.jpg\" style=\"position:absolute; left:1px;\"/>"+
					"<img src=\"code_gui_left_bottom.jpg\" style=\"position:absolute; bottom:0px; left:2px;\"/>";
			body.insertBefore(div,body.firstChild);
			// top
			var div = document.createElement("div");
			code_ui._elements.push(div);
			div.style.position="fixed";
			div.style.width="100%";
			div.style.height="104px";
			div.style.background = "transparent url('code_gui_top_middle.jpg')";
			div.innerHTML = "<img src=\"code_gui_top_right.jpg\" style=\"float:right;\"/>"+
					"<img src=\"code_gui_top_left.jpg\" style=\"position:fixed; float:left;\"/>";
			body.insertBefore(div,body.firstChild);
		} else for(var element in code_ui._elements)
			code_ui._elements[element].style.display = "block";
		var container = document.getElementById("container");
		container.style.top = "104px";
		container.style.bottom = "0px";
	},
	hide: function() {
		for(var element in code_ui._elements)
			code_ui._elements[element].style.display = "none";		
	},
	_elements:[],
	create_location: _classic_create_location,
	perform_layout: function(){
		var main = document.getElementById("main");
		main.style.width = "";
		main.style.height = "";
	},
	get_commandline: function(location) {
		return document.getElementById("commandline_"+location.key);
	},
	scroll_into_view: function(location) {
		window.location.hash = "location_"+location.key;
		classic_ui.get_commandline(current_location).focus();
	},
	set_error: function(location,message) {
		var error = document.getElementById("error_"+location.key);
		error.innerHTML = message;
		error.style.display = "block";
	},
	clear_error: function(location) {
		var error = document.getElementById("error_"+location.key);
		error.style.display = "none";
	},
	get_commands: get_commands,
	on_commandline: function(location,event,line) {
		classic_ui.clear_error(location);
		var auto_complete = (event.keyCode == 32) && event.shiftKey;
		if(auto_complete)
			classic_ui.show_commands(location,classic_ui.get_commands(location));
		else
			document.getElementById("auto_complete_"+location.key).style.display = "none";
	},
	show_commands: function(location,commands) {
		var auto_complete_helper = document.getElementById("auto_complete_"+location.key), command, command_names = [];
		for(command in commands)
			command_names.push(command);
		auto_complete_helper.innerHTML = ""+command_names;
		auto_complete_helper.style.display = "block";
	},
	enter_room: function() {},
	update_npcs: function(location,div) {
		if(classic_ui !== ui) return;
		if(!div) div = document.getElementById("npcs_"+location.key);
		if(!div) return;
		var html = "";
		if(location.npcs.length) {
			for(var npc in location.npcs) {
				if(html.length) html += ", ";
				npc = location.npcs[npc];
				html += npc.name;
			}
		}
		if(html.length > 0) {
			div.innerHTML = html;
			div.style.display = "block";
		} else
			div.style.display = "none";
	},
};

uis.push(code_ui);
