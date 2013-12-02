var div = document.createElement('div');
div.id = 'mychromeclock';
div.style.position = "fixed";
div.style.right = "0px";
div.style.top = "0px";
div.style.textAlign = "right";
div.style.zIndex = "99999999";
div.onmouseover = function() {document.getElementById('mychromeclock').style.display='none'};
div.onmouseout = function() {document.getElementById('mychromeclock').style.display='block'};
document.body.appendChild(div);

mychromeclockDisp();

function is_fullscreen() {
    // var ret = screenfull.isFullscreen;
    var ret = (screen.width == window.outerWidth) && (screen.height == window.outerHeight);
    // console.log("fs: "+ret);
    return ret;
}

var mil_time; // set by options

function time_string() {
    var now = new Date();
    var hh = now.getHours();
    var ampm = "";
    if (mil_time) {
	if( hh < 10 ){ hh = "0" + hh; }
	} else {
	if (hh == 0) {ampm = "a"; hh = "12"; }
	else if (hh < 10) {ampm = "a"; hh = "0" + hh; }
	else if (hh < 13) {ampm = "a"; }
	else if (hh < 22) {ampm = "p"; hh = "0" + (hh - 12); }
	else {ampm = "p"; hh = "" + (hh - 12); }
	}
    var mm = now.getMinutes();
    if( mm < 10 ){ mm = "0" + mm; }
    var ss = now.getSeconds();
    return hh+":"+mm+ampm;
}

function init_options(on_options_ready) {
	chrome.storage.sync.get({"fullscreen_only": false,
		"mil_time": true,
		"fg_color": "#0000FF",
		"bg_color": "#FAF0E6",
		"bg_opacity": "0.4"
	}, on_options_ready);
}

function mychromeclockDisp(){
    init_options(options_ready);
}

function options_ready(values) {
    var fullscreen_only = values["fullscreen_only"];
    mil_time = values["mil_time"];
    var fg_color = values['fg_color'];
    var bg_color = values['bg_color'];
    var opacity = values['bg_opacity'];

    var div = document.getElementById("mychromeclock");
    if (!fullscreen_only || is_fullscreen()) {
	div.innerText = time_string();
	div.style.color = fg_color;
	div.style.backgroundColor = bg_color;
	div.style.opacity = opacity;
	div.style.display = 'block';
    } else {
	div.style.display = 'none';
    }
    setTimeout(mychromeclockDisp, 10000);
}
