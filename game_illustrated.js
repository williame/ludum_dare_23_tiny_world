
function _illustrated_create_location(location) {
	var block = document.createElement("pre");
	var html =
		"<a name=\"location_"+location.key+"\"/>"+
		"<b>"+location.name+"</b><br/>";
	if(location.description)
		html += location.description+"<br/>";
	html += "<input class=\"commandline\" id=\"commandline_"+location.key+"\"/><br/>"+
		"<div id=\"auto_complete_"+location.key+"\" style=\"display:none;\"></div>";
	block.innerHTML = html;
	return block;
}

var illustrated_ui = {
	init: function() {
		document.getElementById("main_css").href = "illustrated.css";
	},
	create_location: _illustrated_create_location,
	get_commandline: function(location) {
		return document.getElementById("commandline_"+location.key);
	},
	scroll_into_view: function(location) {
		window.location.hash = "location_"+name;
	},
	get_commands: get_commands,
	on_commandline: function(location,event,line) {
		var auto_complete = (event.keyCode == 32) && event.shiftKey,
			auto_complete_helper = document.getElementById("auto_complete_"+location.key);
		if(auto_complete) {
			var commands = illustrated_ui.get_commands(location), command_names = [], command;
			for(command in commands)
				command_names.push(command);
			auto_complete_helper.innerHTML = ""+command_names;
			auto_complete_helper.style.display = "block";
		} else
			auto_complete_helper.style.display = "none";
	},
};
