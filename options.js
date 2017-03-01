// Saves options to localStorage.
function save_options() {
	var mil_time = document.getElementById("mil-time").checked;
	var fg_color = document.getElementById("fg-color").value;
	var bg_color = document.getElementById("bg-color").value;
	var bg_opacity = document.getElementById("bg-opacity").value;
	var font_size = document.getElementById("font_size").value;
	var font_family = document.getElementById("font_family").value;
	var style_right = document.getElementById("style_right").value;
	var style_top = document.getElementById("style_top").value;

	chrome.storage.sync.set({
		"mil_time": mil_time,
		"fg_color": fg_color,
		"bg_color": bg_color,
		"bg_opacity": bg_opacity,
		"font_size": font_size,
		"font_family": font_family,
		"style_right": style_right,
		"style_top": style_top
	});

	// Update status to let user know options were saved.
	var status = document.createElement("div");
	status.innerHTML = "<br>Options saved";
	document.body.appendChild(status);
	setTimeout(function() { document.body.removeChild(status) }, 2000);
}

// Restores options dialog state to saved value from localStorage.
function restore_options() {
	chrome.storage.sync.get(document.clock_defaults, function(values) {
		document.getElementById("mil-time").checked = values["mil_time"];
		document.getElementById("fg-color").value = values["fg_color"];
		document.getElementById("bg-color").value = values["bg_color"];
		document.getElementById("bg-opacity").value = values["bg_opacity"];
		document.getElementById("font_size").value = values["font_size"];
		document.getElementById("font_family").value = values["font_family"];
		document.getElementById("style_right").value = values["style_right"];
		document.getElementById("style_top").value = values["style_top"];
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
