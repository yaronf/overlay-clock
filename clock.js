var overlay_clock = document.createElement( 'div' );

overlay_clock.id = 'overlay_clock_extension';
overlay_clock.style.borderRadius = '6px';
overlay_clock.style.display = 'block';
overlay_clock.style.padding = '6px';
overlay_clock.style.position = 'fixed';
overlay_clock.style.zIndex = '10000099';

document.body.appendChild( overlay_clock );

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
		if( hh < 13 ) {
			apm = ' am'
		}
		else {
			hh -= 12;
			hh = ( '0' + hh ).slice( -2 );
			apm = ' pm';
		}
	}
	return hh + ':' + mm + apm;
}

function is_full_screen() {
	return ( ( screen.width == window.outerWidth )
		&& ( screen.height == window.outerHeight ) );
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


	overlay_clock.textContent = new_time();
	overlay_clock.style.color = my_overlay_clock_fg_color;
	overlay_clock.style.backgroundColor = my_overlay_clock_bg_color;
	overlay_clock.style.opacity = my_overlay_clock_opacity;
	overlay_clock.style.fontFamily = my_overlay_clock_font_family;
	overlay_clock.style.fontSize = my_overlay_clock_font_size;
	overlay_clock.style.right = my_overlay_clock_style_right;
	overlay_clock.style.top = my_overlay_clock_style_top;

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
	}
}

setInterval( update_time_on_clock, 20000 );

// load defaults values and transfer them to function create_clock()
chrome.storage.sync.get( document.clock_defaults, create_clock );
