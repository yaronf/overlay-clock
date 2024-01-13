var overlay_clock = document.createElement( 'div' );

overlay_clock.id = 'overlay_clock_extension';
overlay_clock.style.borderRadius = '6px';
overlay_clock.style.display = 'block';
overlay_clock.style.padding = '6px';
overlay_clock.style.position = 'fixed';

// global variable for change_clock_appearance_on_resize()
var default_font_size_of_overlay_clock;

window.addEventListener('load', function() { document.body.appendChild(overlay_clock); }, false);
window.addEventListener('resize', change_clock_appearance_on_resize, false);

// hide clock on click
overlay_clock.onclick = function() {
	overlay_clock.style.display = 'none';
	setTimeout( function() {
			overlay_clock.style.display = 'block'
		}, 10000 );
};

function new_time() {
	var now = new Date();
	var hh = ( '0' + now.getHours() ).slice( -2 );
	var mm = ( '0' + now.getMinutes() ).slice( -2 );
	var apm = '';

	if( !my_overlay_clock_mil_time ) {
		if( hh < 12 ) {
			apm = ' am'
		}
		else {
			hh -= 12;
			apm = ' pm';
		}
	    hh = ( '0' + hh ).slice( -2 );
	    if (hh == '00') {
		hh = '12';
	    }
	}
	return hh + ':' + mm + apm;
}

function new_date() {
    var now = new Date();
    var d = now.toLocaleDateString();
    return d;
}

function is_full_screen() {
	return ( ( screen.width == window.outerWidth )
		&& ( screen.height == window.outerHeight ) );
}

// has hardcoded 'padding' and 'borderRadius' values
function change_clock_appearance_on_resize() {
	// or browser.tabs.getZoom()
	dpr = window.devicePixelRatio
	if     ( dpr <= 1.25 ) {
		overlay_clock.style.padding = '6px';
		overlay_clock.style.borderRadius = '6px';
		overlay_clock.style.fontSize = default_font_size_of_overlay_clock;
	}
	else if( dpr <= 1.50 ) {
		overlay_clock.style.padding = '5px';
		overlay_clock.style.borderRadius = '5px';
		overlay_clock.style.fontSize = subtract_from_font_size( 1 ) + 'px';
	}
	else if( dpr <= 1.75 ) {
		overlay_clock.style.padding = '3px';
		overlay_clock.style.borderRadius = '4px';
		overlay_clock.style.fontSize = subtract_from_font_size( 4 ) + 'px';
	}
	else if( dpr >  1.75 ) {
		overlay_clock.style.padding = '2px';
		overlay_clock.style.borderRadius = '2px';
		overlay_clock.style.fontSize = subtract_from_font_size( 4 ) + 'px';
	}
}

function subtract_from_font_size(how_much_subtract) {
	// delete 'px' from value
	font_size =	default_font_size_of_overlay_clock.slice(0, -2);
	if( font_size - how_much_subtract >= 6 ) {
		font_size -= how_much_subtract;
	}
	else {
		font_size = 6;
	}
	return font_size
}


function create_clock( values ) {
	// use global variable to use it in new_time()
	window.my_overlay_clock_mil_time = values[ 'mil_time' ];
	window.my_overlay_clock_full_screen_only = values[ 'full_screen_only' ];

	my_overlay_clock_fg_color = values[ 'fg_color' ];
	my_overlay_clock_bg_color = values[ 'bg_color' ];
	my_overlay_clock_opacity = values[ 'bg_opacity' ];
	my_overlay_clock_font_family = values[ 'font_family' ];
	my_overlay_clock_font_size = values[ 'font_size' ];
	my_overlay_clock_style_right = values[ 'style_right' ];
	my_overlay_clock_style_top = values[ 'style_top' ];
	// yeah, will be only one z-index for every page, sorry
	let my_overlay_clock_z_index = values[ 'z_index' ];



        overlay_clock.textContent = new_time();
        overlay_clock.title = new_date();
	overlay_clock.style.color = my_overlay_clock_fg_color;
	overlay_clock.style.backgroundColor = my_overlay_clock_bg_color;
	overlay_clock.style.opacity = my_overlay_clock_opacity;
	overlay_clock.style.fontFamily = my_overlay_clock_font_family;
	overlay_clock.style.fontSize = my_overlay_clock_font_size;
	overlay_clock.style.right = my_overlay_clock_style_right;
	overlay_clock.style.top = my_overlay_clock_style_top;
	overlay_clock.style.zIndex = my_overlay_clock_z_index;

	// global variable for change_clock_appearance_on_resize()
	default_font_size_of_overlay_clock = overlay_clock.style.fontSize;

	if( my_overlay_clock_full_screen_only && !is_full_screen() ) {
			overlay_clock.style.display = 'none';
	}

}

function update_time_on_clock() {
	if( my_overlay_clock_full_screen_only && !is_full_screen() ) {
		if( overlay_clock.style.display != 'none' ) {
			overlay_clock.style.display = 'none';
		}
	}
	else {
		if( overlay_clock.style.display != 'block' ) {
			overlay_clock.style.display = 'block';
		}
	    overlay_clock.textContent = new_time();
	    overlay_clock.title = new_date();
	}
}

setInterval( update_time_on_clock, 20000 );

// load defaults values and transfer them to function create_clock()
chrome.storage.sync.get( document.clock_defaults, create_clock );

browser.runtime.onMessage.addListener( (request, sender, sendResponse) => {
	if( request.visibility == "show" ) {
		overlay_clock.style.display = 'block';
	}
	if( request.visibility == "hide" ) {
		overlay_clock.style.display = 'none';
	}
	if( request.visibility == "what" ) {
		if( overlay_clock.style.display == 'none' ) {
			return Promise.resolve( { response: "hidden" } );
		}
		if( overlay_clock.style.display == 'block' ) {
			return Promise.resolve( { response: "shown" } );
		}
	}
} );
