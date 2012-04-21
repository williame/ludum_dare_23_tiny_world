
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

function _illustrated_perform_layout() {
	// work out explored bounds
	var key, value, ui,
		left = 10000000, top = 10000000,
		right = -left, bottom = -top;
	for(key in locations) {
		value = locations[key]; 
		if(value.ui) {
			ui = value.ui;
			value = value.illustrated;
			ui.setAttribute("style",
				"position:absolute;"+
				"width:"+value.w+"px;"+
				"height:"+value.h+"px;");
			if(value.x < left) left = value.x;
			if(value.x+value.w > right) right = value.x+value.w;
			if(value.y < top) top = value.y;
			if(value.y+value.h > bottom) bottom = value.y+value.h;
		}
	}
	console.log("bounds = "+left+","+top+" -> "+right+","+bottom);
	// move all explored items to be in-bounds
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
		_illustrated_scroll_into_view();
	}
	main._rect = {left:left,top:top,width:right-left,height:bottom-top};
	main.style.width = ""+main._rect.width+"px";
	main.style.height = ""+main._rect.height+"px";
	main.style.backgroundPosition = "-"+left+"px -"+top+"px";
	for(key in locations) {
		value = locations[key];
		if(value.ui) {
			value.pos = {x:(value.illustrated.x-left),y:(value.illustrated.y-top),
				w:value.illustrated.w,h:value.illustrated.h};
			value.ui.style.left = ""+value.pos.x+"px";
			value.ui.style.top = ""+value.pos.y+"px";
			console.log(key+" = "+value.ui.style.left+","+value.ui.style.top);
		}
	}
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
		scroll.end_time = scroll.start_time + 3000; // later, make it based on distance
		if(scroll.timer)
			clearTimeout(scroll.timer);
		_illustrated_scroll_into_view();
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

uis.push(illustrated_ui);
