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
	var z_index = document.getElementById( "z_index" ).value;
	var domains_array = domains_list_to_array();


	chrome.storage.sync.set( {
		"mil_time": mil_time,
		"full_screen_only": full_screen_only,
		"fg_color": fg_color,
		"bg_color": bg_color,
		"bg_opacity": bg_opacity,
		"font_size": font_size,
		"font_family": font_family,
		"style_right": style_right,
		"style_top": style_top,
		"z_index": z_index,
		"domains_array": domains_array
	} );

	// Update status to let user know options were saved.
	var status = document.createElement( "div" );
	status.innerHTML = "<br>Options saved";
	document.body.appendChild( status );
	setTimeout( function() { document.body.removeChild( status ) }, 2000 );

	var is_options_were_changed = false;
	// For applying changes to active tab.
	message_options_were_changed();
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
		document.getElementById( "z_index" ).value = values[ "z_index" ];
		domains_array = values[ "domains_array" ];
		recreate_domains_list_in_html( domains_array );
	});
}

document.addEventListener( 'DOMContentLoaded', restore_options );
document.querySelector( '#save' ).addEventListener( 'click', save_options );

// To let function get not Window as 'this', but exactly those element, which called function.
document.getElementById( "add_domain" ).addEventListener( 'click', function() {
	add_this_domain( this );
});

document.getElementById( "switch_to_page_general_settings" ).addEventListener( 'click', function() {
	// to hide, to show
	switch_options_page( "page_domains_list", "page_general_settings" );
	switch_options_page( "page_domains_list_button", "page_general_settings_button" );
	} );
document.getElementById( "switch_to_page_domains_list" ).addEventListener( 'click', function() {
	switch_options_page( "page_general_settings", "page_domains_list" );
	switch_options_page( "page_general_settings_button", "page_domains_list_button" );
	} );

// helper function
function get_active_tab() {
	return chrome.tabs.query({
		// without this will try to do it for all tabs (even without clock (aka not loaded), i guess):
		active: true,
		currentWindow: true
	});
}

let clock_visibility = document.getElementById("hide_clock_checkbox");
set_state_of_hide_clock_checkbox();
function set_state_of_hide_clock_checkbox() {
	get_active_tab()
	.then( function( tab ) {
		const sended_message = chrome.tabs.sendMessage(
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
	get_active_tab()
	.then( send_message_to_tabs )
	.catch( function (error) {
		console.error( `overlay_clock change_visibility tab_query error: ${error}` );
	});
}

function send_message_to_tabs( tabs ) {
	if( clock_visibility.checked == false ) {
		// for( let tab of tabs ) {
			chrome.tabs.sendMessage(
				// tab.id,
				tabs[0].id,
				{ visibility: "show" }
			)
			.catch()
		// }
	}
	if( clock_visibility.checked == true ) {
		// for( let tab of tabs ) {
			chrome.tabs.sendMessage(
				// tab.id,
				tabs[0].id,
				{ visibility: "hide" }
			)
			.catch()
		// }
	}
	if( is_options_were_changed == true ) {
		is_options_were_changed = false;
		chrome.tabs.sendMessage(
			tabs[0].id,
			{ recreate: "true" }
		).catch();
	}
}

// Auto update clock's css after saving changes.
function message_options_were_changed() {
	is_options_were_changed = true;
	get_active_tab()
	.then( send_message_to_tabs )
	.catch( function (error) {
		console.error( `overlay_clock message_option_were_changed tab_query error: ${error}` );
		});
}

function switch_options_page( to_hide, to_show ) {
	// console.log( "switch_options_page " + to_hide + " " + to_show + " worked" );
	document.getElementById( to_hide ).style.display = "none";
	document.getElementById( to_show ).style.display = "block";
}


// For each saved domain create an div with it and add to page_domains_list.
function recreate_domains_list_in_html( domains ) {
	domains.forEach( function( value ) {
		domains_container.appendChild( create_domain_element_div( value ) );
	})
}

// helper function
// Returns new element.
function create_domain_element_div( value ) {
	let domains_container = document.getElementById( "domains_container" );
	let new_element = document.createElement( "div" );
	// Or classList.add( "domain_element" ); if there some else classes
	new_element.className = "domain_element";

	let domain_input = document.createElement( "input" );
	domain_input.value = value;
	domain_input.type = "text";
	domain_input.placeholder = "www.domain.name";
	domain_input.className = "domains";
	// both work
	// domain_input.setAttribute( "readonly", true);
	domain_input.readOnly = true;

	let domain_button = document.createElement( "input" );
	domain_button.type = "button";
	domain_button.title = "Delete this domain";
	domain_button.value = "❌";
	domain_button.className = "delete_domain";
	// instead of this, could be body.eventListener for all class members
	domain_button.addEventListener( 'click' , function() {
		delete_exactly_this_domain( this );
		});

	new_element.appendChild( domain_input );
	new_element.appendChild( domain_button );
	return new_element;
}

// Also sort result
function domains_list_to_array(
		/* takes nothing, as saves current state of html elements */
		) {
	let domains_container = document.getElementById( "domains_container" );
	const domains_elements = domains_container.getElementsByClassName( "domains" );
	let temp_array = [];

	Array.prototype.filter.call(
		domains_elements, ( domains_element ) => {
			if( domains_element.value != "" ) {
				temp_array.push( domains_element.value );
				}
			});
	return temp_array.sort();
}

function delete_exactly_this_domain( input_button ) {
	// if( input_button == "undefined" ) {
	// 	console.log( "delete_exactly_this_domain: input_button is undefined" );
	// 	return;
	// }
	let parent = input_button.parentNode;
	let first_child = parent.firstElementChild;
	let value_to_delete = first_child.value;
	// console.log( "delete_exactly_this_domain: value_to_delete = " + value_to_delete );
	// Creates new array without one element.
	domains_array = domains_array.filter( element => element != value_to_delete );
	parent.remove();
	// no auto-save of changes
}

// Almost the same as upper one.
// Can't be used in file:///options.html debug out of add-on debugging.
function add_this_domain( input_button ) {
	// if( input_button == undefined ) {
	// 	console.log( "add_this_domain: input_button is absent" );
	// 	return;
	// }
	// .domain_element
	let parent = input_button.parentNode;
	// if( parent == undefined ) {
	// 	console.log( "cannot add_this_domain, input object is missing = "
	// 		+ input_button );
	// 	return;
	// }
	let first_child = parent.firstElementChild;
	let value_to_add = first_child.value;
	// maybe should be check for at least one '.' in domain name
	if ( value_to_add != ""  ) {
		// console.log( "add_this_domain: value_to_add " + value_to_add );
		if( is_element_unique_for_array( value_to_add, domains_array ) ) {
			domains_array.push( value_to_add );
			domains_array.sort();
			// console.log( "add_this_domain: sorted array = " + domains_array );
			let new_element = create_domain_element_div( value_to_add )
			// #domains_container
			let parent_of_parent = parent.parentNode;
			// insert right after "#add_domain".parent; aka insertAfter
			parent_of_parent.insertBefore( new_element, parent.nextSibling );
			// have to click save settings for saving that list as for now
		}
	}
	first_child.value = ""; // clear the field
}

// helper function
// what, into what
function is_element_unique_for_array( element, array ) {
	let answer = true;
	for( let index = 0; index < array.length; index++ ) {
		if( array[ index ] == element ) {
			answer = false;
			break;
		}
	}
	return answer;
}
