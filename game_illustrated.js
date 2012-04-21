
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
	block.setAttribute("style",
		"position:absolute;"+
		"width:"+location.illustrated.w+"px;"+
		"height:"+location.illustrated.h+"px;");
	return block;
}

function _illustrated_perform_layout() {
	// work out explored bounds
	var key, value,
		left = 10000000, top = 10000000,
		right = -left, bottom = -top;
	for(key in locations) {
		value = locations[key]; 
		if(value.ui) {
			value = value.illustrated;
			if(value.x < left) left = value.x;
			if(value.x+value.w > right) right = value.x+value.w;
			if(value.y < top) top = value.y;
			if(value.y+value.h > bottom) bottom = value.y+value.h;
		}
	}
	console.log("bounds = "+left+","+top+" -> "+right+","+bottom);
	// move all explored items to be in-bounds
	var main = document.getElementById("main");
	main._rect = {left:left,top:top,width:right-left,height:bottom-top};
	main.style.width = ""+main._rect.width+"px";
	main.style.height = ""+main._rect.height+"px";
	for(key in locations) {
		value = locations[key];
		if(value.ui) {
			value.pos = {x:(value.illustrated.x-left),y:(value.illustrated.y-top)};
			value.ui.style.left = ""+value.pos.x+"px";
			value.ui.style.top = ""+value.pos.y+"px";
			console.log(key+" = "+value.ui.style.left+","+value.ui.style.top);
		}
	}
}

var illustrated_ui = {
	init: function() {
		document.getElementById("main_css").href = "illustrated.css";
	},
	create_location: _illustrated_create_location,
	perform_layout: _illustrated_perform_layout,
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
