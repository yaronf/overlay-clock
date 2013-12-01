// Saves options to localStorage.
function save_options() {
	var fullscreen_only = document.getElementById("fullscreen-only").checked;
	var mil_time = document.getElementById("mil-time").checked;
	var fg_color = document.getElementById("fg-color").value;
	var bg_color = document.getElementById("bg-color").value;
	var bg_opacity = document.getElementById("bg-opacity").value;
	chrome.storage.sync.set({
		"fullscreen_only": fullscreen_only,
		"mil_time": mil_time,
		"fg_color": fg_color,
		"bg_color": bg_color,
		"bg_opacity": bg_opacity
	});

	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
	setTimeout(function() {
	    status.innerHTML = "";
	}, 750);
}

// Restores options dialog state to saved value from localStorage.
function restore_options() {
	chrome.storage.sync.get({"fullscreen_only": false, "mil_time": true}, function(values) {
		document.getElementById("fullscreen-only").checked = values["fullscreen_only"];
		document.getElementById("mil-time").checked = values["mil_time"];
		document.getElementById("fg-color").value = values["fg_color"];
		document.getElementById("bg-color").value = values["bg_color"];
		document.getElementById("bg-opacity").value = values["bg_opacity"];
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
