
function _illustrated_create_location(location) {
	var block = document.createElement("div");
	block.setAttribute("class","block");
	var html = "<table style=\"width:100%;height:100%;\"><tr><td valign=\"middle\"><div>"+
		"<a name=\"location_"+location.key+"\"/>";
	if(location.illustrated.images)
		for(var image in location.illustrated.images) {
			image = location.illustrated.images[image];
			html += "<img src=\""+image.image+"\" style=\"position:relative; left:"+image.x+"px; top:"+image.y+"px;\"/>";
		}
	html += "<div id=\"npcs_"+location.key+"\" style=\"display:none;\"></div>"+
		"<b>"+location.name+"</b><br/>";
	for(var message in location.messages)
		html += "<div class=\"message\">"+location.messages[message]+"</div>"
	html += "<input class=\"commandline\" id=\"commandline_"+location.key+"\"/><br/>"+
		"<div id=\"auto_complete_"+location.key+"\" style=\"display:none;\"></div>"+
		"<div id=\"error_"+location.key+"\" style=\"display:none;\" class=\"error\"></div>"+
		"</div></td></tr></table>";
	block.innerHTML = html;
	illustrated_ui.update_npcs(location);
	return block;
}

function _illustrated_ui_set_layer(layer) {
	var main = document.getElementById("main"), location;
	for(location in main.childNodes) {
		location = main.childNodes[location].location;
		if(location && location.illustrated.layer)
			location.ui.style.display = location.illustrated.layer != layer? "none": "block";
	}
	for(var i in illustrated_layers) {
		if(i == layer) {
			i = illustrated_layers[i];
			if(!i.img) {
				var img = i.img = document.createElement("img");
				img.src = i.image;
				img.setAttribute("style",
					"position:absolute;"+
					"left:"+(i.x-main._rect.left)+"px;"+
					"top:"+(i.y-main._rect.top)+"px;");
				main.insertBefore(img,main.firstChild);
			} else
				i.img.style.display = "block";
		} else {
			i = illustrated_layers[i];
			if(i.img) {
				i.img.style.display = "none";
			}
		}
	}
	
}

function _illustrated_perform_layout(location) {
	// work out explored bounds
	var key, value, ui,
		left = 10000000, top = 10000000,
		right = -left, bottom = -top;
	for(key in locations) {
		value = locations[key]; 
		if(value.ui) {
			ui = value.ui;
			value = value.illustrated;
			var x = value.x, y = value.y;
			if(!value.w) value.w = value.x2-x;
			if(!value.h) value.h = value.y2-y;
			if(value.layer) {
				x += illustrated_layers[value.layer].x;
				y += illustrated_layers[value.layer].y;
			}
			ui.setAttribute("style",
				"position:absolute;"+
				"width:"+value.w+"px;"+
				"height:"+value.h+"px;");
			if(x < left) left = value.x;
			if(x+value.w > right) right = x+value.w;
			if(y < top) top = value.y;
			if(y+value.h > bottom) bottom = y+value.h;
		}
	}
	// expose whole map anyway?
	if(locations.balloon_shed.flown) {
		left = top = 0;
		right = 4008;
		bottom = 5000;
	}	// move all explored items to be in-bounds
	var main = document.getElementById("main");
	if(main._rect) {
		var scroll = illustrated_ui._scroll;
		var x = left-main._rect.left, y = top-main._rect.top;
		scroll.from.x -= x;
		scroll.from.y -= y;		
		scroll.last.x -= x;
		scroll.last.y -= y;		
		scroll.to.x -= x;
		scroll.to.y -= y;
		main.parentNode.scrollLeft -= x;		
		main.parentNode.scrollTop -= y;
	}
	main._rect = {left:left,top:top,width:right-left,height:bottom-top};
	main.style.width = ""+main._rect.width+"px";
	main.style.height = ""+main._rect.height+"px";
	main.style.backgroundPosition = "-"+left+"px -"+top+"px";
	for(key in locations) {
		value = locations[key];
		if(value.ui) {
			var x = value.illustrated.x, y = value.illustrated.y;
			if(value.illustrated.layer) {
				x += illustrated_layers[value.illustrated.layer].x;
				y += illustrated_layers[value.illustrated.layer].y;
			}
			value.pos = {x:(x-left),y:(y-top),
				w:value.illustrated.w,h:value.illustrated.h};
			value.ui.style.left = ""+value.pos.x+"px";
			value.ui.style.top = ""+value.pos.y+"px";
		}
	}
	for(var layer in illustrated_layers) {
		layer = illustrated_layers[layer];
		if(layer.img) {
			layer.img.style.left = ""+(layer.x-main._rect.left)+"px";
			layer.img.style.top = ""+(layer.y-main._rect.top)+"px";
		}
	}
	_illustrated_scroll_into_view();
}

function _illustrated_scroll_into_view() {
	var scroll = illustrated_ui._scroll;
	if(ui != illustrated_ui) {
		clearTimeout(scroll.timer);
		scroll.timer = null;
		return;
	}
	var now = new Date().getTime();
	if(now >= scroll.end_time) {
		clearTimeout(scroll.timer);
		scroll.timer = null;
		scroll.last = scroll.to;
		if(current_location)
			ui.get_commandline(current_location).focus();
	} else {
		var lerp = (now-scroll.start_time) / (scroll.end_time-scroll.start_time);
		scroll.last = {x:scroll.from.x+(scroll.to.x-scroll.from.x)*lerp,
			y:scroll.from.y+(scroll.to.y-scroll.from.y)*lerp};
		//console.log("lerp="+lerp+", from="+scroll.from.x+","+scroll.from.y+", to="+scroll.to.x+","+scroll.to.y+" scroll="+scroll.last.x+","+scroll.last.y);
		scroll.timer = setTimeout(_illustrated_scroll_into_view,illustrated_ui.SCROLL_SPEED);
	}
	var container = document.getElementById("main").parentNode;
	container.scrollLeft = scroll.last.x - (container.offsetWidth/2);
	container.scrollTop = scroll.last.y - (container.offsetHeight/2);
}

var illustrated_ui = {
	name: "illustrated",
	init: function() {
		window.location.hash = "";
		document.getElementById("main_css").href = "illustrated.css";
		illustrated_ui._scroll = {
			from:{x:0,y:0},
			last:{x:0,y:0},
			to:{x:0,y:0},
			start_time:0,
			end_time:0,
			timer:null,
		};
		illustrated_ui.SCROLL_SPEED = 100;
	},
	create_location: _illustrated_create_location,
	perform_layout: _illustrated_perform_layout,
	get_commandline: function(location) {
		return document.getElementById("commandline_"+location.key);
	},
	scroll_into_view: function(location) {
		var scroll = illustrated_ui._scroll;
		scroll.to = {x:location.pos.x+location.pos.w/2,y:location.pos.y+location.pos.h/2};
		scroll.from = scroll.last;
		scroll.start_time = new Date().getTime();
		scroll.end_time = scroll.start_time + 1000; // later, make it based on distance
		if(scroll.timer)
			clearTimeout(scroll.timer);
		_illustrated_scroll_into_view();
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
		illustrated_ui.clear_error(location);
		var auto_complete = (event.keyCode == 32) && event.shiftKey;
		if(auto_complete)
			illustrated_ui.show_commands(location,illustrated_ui.get_commands(location));
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
	enter_room: function(location) {
		if((typeof location.illustrated.layer != typeof illustrated_ui.layer) ||
			(illustrated_ui.layer != location.illustrated.layer)) {
			illustrated_ui.layer = location.illustrated.layer;
			console.log("now on layer "+illustrated_ui.layer);
			_illustrated_ui_set_layer(illustrated_ui.layer);
		}
	},
	update_npcs: function(location) {
		var div = document.getElementById("npcs_"+location.key);
		if(!div) return;
		var html = "";		
		if(location.npcs.length) {
			for(var npc in location.npcs) {
				npc = location.npcs[npc];
				console.log(npc.illustrated);
				html += "<img src=\""+npc.illustrated.avatar+"\"/>";
			}
			html += "<br/>";
		}
		if(html.length) {
			div.innerHTML = html;
			div.style.display = "block";
		} else
			div.style.display = "none";
	},
};

uis.push(illustrated_ui);
