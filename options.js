// Saves options to localStorage.
function save_options() {
	var mil_time = document.getElementById( "mil_time" ).checked;
	var full_screen_only = document.getElementById( "full_screen_only" ).checked;
	var fg_color = document.getElementById( "fg_color" ).value;
	var bg_color = document.getElementById( "bg_color" ).value;
	var bg_opacity = document.getElementById( "bg_opacity" ).value;
	var font_size = document.getElementById( "font_size" ).value;
	var font_family = document.getElementById( "font_family" ).value;
	var style_right = document.getElementById( "style_right" ).value;
	var style_top = document.getElementById( "style_top" ).value;

	chrome.storage.sync.set( {
		"mil_time": mil_time,
		"full_screen_only": full_screen_only,
		"fg_color": fg_color,
		"bg_color": bg_color,
		"bg_opacity": bg_opacity,
		"font_size": font_size,
		"font_family": font_family,
		"style_right": style_right,
		"style_top": style_top
	} );

	// Update status to let user know options were saved.
	var status = document.createElement( "div" );
	status.innerHTML = "<br>Options saved";
	document.body.appendChild( status );
	setTimeout( function() { document.body.removeChild( status ) }, 2000 );
}

// Restores options dialog state to saved value from localStorage.
function restore_options() {
	chrome.storage.sync.get( document.clock_defaults, function( values ) {
		document.getElementById( "mil_time" ).checked = values[ "mil_time" ];
		document.getElementById( "full_screen_only" ).checked = values[ "full_screen_only" ];
		document.getElementById( "fg_color" ).value = values[ "fg_color" ];
		document.getElementById( "bg_color" ).value = values[ "bg_color" ];
		document.getElementById( "bg_opacity" ).value = values[ "bg_opacity" ];
		document.getElementById( "font_size" ).value = values[ "font_size" ];
		document.getElementById( "font_family" ).value = values[ "font_family" ];
		document.getElementById( "style_right" ).value = values[ "style_right" ];
		document.getElementById( "style_top" ).value = values[ "style_top" ];
	});
}

document.addEventListener( 'DOMContentLoaded', restore_options );
document.querySelector( '#save' ).addEventListener( 'click', save_options );


let clock_visibility = document.getElementById("hide_clock_checkbox");
set_state_of_hide_clock_checkbox();
function set_state_of_hide_clock_checkbox() {
	browser.tabs.query({
		currentWindow: true,
		active: true
	})
	.then( function( tab ) {
		const sended_message = browser.tabs.sendMessage(
			tab[0].id,
			{ visibility: "what" }
		)
		sended_message.then( ( response ) => {
			if( response.response == "hidden" ) {
				clock_visibility.checked = true;
			}
			if( response.response == "shown" ) {
				clock_visibility.checked = false;
			}
		})
		.catch( function( error ) {
			console.error( `overlay_clock switch_checkbox send_message error: ${error}` );
		})
	})
	.catch( function ( error ) {
		console.error( `overlay_clock switch_checkbox tab_query error: ${error}` );
	});
}

clock_visibility.addEventListener( 'change', change_visibility );
function change_visibility() {
	// console.error( "clock_visibility.checked = ", clock_visibility.checked );
	browser.tabs.query({
		// without this will try to do it for all tabs (even without clock (e. g. tab is not loaded)):
		active: true,
		currentWindow: true
	})
	.then( send_message_to_tabs )
	.catch( function (error) {
		console.error( `overlay_clock change_visibility tab_query error: ${error}` );
	});
}

function send_message_to_tabs( tabs ) {
	if( clock_visibility.checked == false ) {
		// for( let tab of tabs ) {
			browser.tabs.sendMessage(
				// tab.id,
				tabs[0].id,
				{ visibility: "show" }
			)
			.catch()
		// }
	}
	if( clock_visibility.checked == true ) {
		// for( let tab of tabs ) {
			browser.tabs.sendMessage(
				// tab.id,
				tabs[0].id,
				{ visibility: "hide" }
			)
			.catch()
		// }
	}
}
