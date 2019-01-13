/*----- START UP ANIMATIONS -----*/
function animateLanding() {
	if ($(window).width() > 767) {
		animateLogo();
		animateTitle();
		animateMenuBar();
		animateContactInformation();
	}
}

function animateLogo() {
	$("#logo").addClass('logo-animation');
}

function animateTitle() {
	setTimeout(function() {
		$("#top-section--title").css("visibility", "visible");
		$("#top-section--title").addClass('title-animation')
	}, 2500);
}

function animateMenuBar() {

	setTimeout(function() { $("#navbar").addClass('menubar-animation') }, 3500);
}

function animateContactInformation() {

	setTimeout(function() { $("#contact-form").addClass('contact-animation') }, 4500);
}

/*----- NAV BUTTON COLOUR CHANGE -----*/

function colorChange(bool) {
	if (bool === true) {
		$("#menu-button").css('background-color', '#6d23ff');
	}
	else {
		$("#menu-button").css("background-color", "#9c6df9");
	}
}

$(document).ready(function() {
	animateLanding()
})

/*----- NAV BAR MENU BUTTONS FUNCTIONALITY -----*/
function showTab(clickedButton) {
	var clickedButtonId=$(clickedButton).attr("id").split("-")
	var clickedButtonName=clickedButtonId[0]
	var clickedTabName ="#" + clickedButtonName + "-tab"; ;
	console.log("you clicked - " + clickedTabName);
	$(clickedButton).data('state', 'open');
	$("i", clickedButton).removeClass("fa-chevron-right");
	$("i", clickedButton).addClass("fa-chevron-down");
	$(clickedTabName).slideDown(250);
}

function hideOpenTab() {
	console.log("closing tabs")
	var button = $("li").first();
	var buttonId;
	var buttonName
	var tabName;
	//cycle through the tabs and hide them (if any showing) 
	for (i = 0; i <= 3; i++) {
		//get the name of the associated tab from the button ID 
		buttonId = button.attr("id").split("-");
		buttonName = buttonId[0];
		tabName = "#" + buttonName + "-tab";
		//check if the tab is open, if so, close it
		if ($(button).data('state') == 'open') {
			console.log(tabName+" is open - closing")
			$(button).data('state', 'closed')
			$("i", button).removeClass("fa-chevron-down");
			$("i", button).addClass("fa-chevron-right");
			$(tabName).slideUp(250);
			delay = 250;
		}
		button = button.next();
	}
}

function changeNavButton() {
	var topSectionHiddenTitle = $("#top-section--hidden-title");
	if ($(window).width() < 768) {
		topSectionHiddenTitle.fadeToggle(500);
		if (topSectionHiddenTitle.data('state') === 'hidden') {
			topSectionHiddenTitle.data('state', 'visible');
			colorChange(true);
		}
		else {
			topSectionHiddenTitle.data('state', 'hidden');
			colorChange(false);
		}
		setTimeout(function() { $("#menu-button").html("DISCOVER") }, 250);
	}
}

function showContactForm() {
	if ($("#contact-form").data('state') == 'closed') {
		$("#contact-form").fadeIn(250);
		$("#contact-form").data('state', 'open');
	}
}

function hideContactForm() {
	var delay=0;
	if ($("#contact-form").data('state') == 'open') {
		$("#contact-form").fadeOut(250);
		$("#contact-form").data('state', 'closed');
		delay=150;
	}
	return delay;
}

$("#menu-button").on("click", function() {
	hideOpenTab();
	showContactForm(delay);
	changeNavButton();
})


$("li").on("click", function() {
	//get the ID of the li item (button) that has been clicked
	var clickedButton = $(this);
	if($(clickedButton).data('state')=='open') {
		hideOpenTab();
		console.log("hiding open tab - delaying "+delay)
		setTimeout( function () { showContactForm() }, 250);
	}
	else {		
		hideContactForm();
		hideOpenTab();
		setTimeout( function () { showTab(clickedButton) },250);
	}		
})
/*
	//set up variables to cycle through and hide other tabs, as appropriate
	var button = $("li").first();
	var buttonId;
	var tabName;
	var delay = 0;

	//cycle through buttons - if previous tab is showing hide it and toggle chevron on button
	console.log("start");

	for (i = 0; i <= 3; i++) {
		buttonId = button.attr("id").split("-");
		tabName = "#" + buttonId[0] + "-tab";
		console.log("buttonId:" + buttonId[0]);
		console.log("clicked button:" + clickedButtonId[0]);
		if (buttonId[0] != clickedButtonId[0]) {
			//check if another tab is showing and, if so hide it and delay showing new tab
			if ($("i", button).data('state')=='open') {
				$("i", button).data('state','closed');
				$("i", button).removeClass("fa-chevron-down");
				$("i", button).addClass("fa-chevron-right");
				$(tabName).slideUp(250);
				delay = 250;
			}
			else if ($("#contact-form").is(':visible') == true) {
				$("#contact-form").fadeOut(150);
				delay = 250;
			}
		}
		button = button.next();
	}*/



//if the clicked tab is hidden - show it and hide the menu button (helps user experience
//to avoid losing the menu accidentally), else hide the tab and show the menu button, if no other tab displayed.
/*	if ($("i", this).data('state', 'closed')) {
		$("i", this).data('state', 'open');
		$("i", this).removeClass("fa-chevron-right");
		$("i", this).addClass("fa-chevron-down");
		setTimeout(function() {
			$(clickedTabName).slideDown(250);
		}, delay);
		if ($(window).width() < 768) {

			$("#menu-button").html("CONTACT");
			//	$("#contact-button").css("visibility", "visible");

		}

	}
	else {
		$("i", this).data('state', 'closed');
		$("i", this).removeClass("fa-chevron-down");
		$("i", this).addClass("fa-chevron-right");
		$(clickedTabName).slideUp(250);*/
/*		if ($(window).width() < 768) {

			$("#menu-button").html("DISCOVER");

		}
		setTimeout(function() { $("#contact-form").fadeIn(150) }, 250);
	}

})*/


$("#calendar").on("click", function() {
	console.log("clicked")
	$("#contact-form").html('<iframe src="https://calendar.google.com/calendar/embed?src=llafnderyff%40googlemail.com&ctz=Europe%2FLondon" style="border: 0" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>')
})
