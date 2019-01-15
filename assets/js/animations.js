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
	var clickedButtonId = $(clickedButton).attr("id").split("-")
	var clickedButtonName = clickedButtonId[0]
	var clickedTabName = "#" + clickedButtonName + "-tab";;
	$(clickedButton).data('state', 'open');
	$("i", clickedButton).removeClass("fa-chevron-right");
	$("i", clickedButton).addClass("fa-chevron-down");
	$(clickedTabName).slideDown(250);
}

function changeBackground(clickedButton) {
	var clickedButtonId = $(clickedButton).attr("id").split("-")
	var clickedButtonName = clickedButtonId[0]
	$(".top-section").css('background', 'url(../assets/images/background-' + clickedButtonName + '.jpg) no-repeat');
	$(".top-section").css('background-size', 'cover');
}

function hideOpenTab() {
	//var button = $("li").first();
	var button;
	var buttonId;
	var buttonName
	var tabName;
	//cycle through the tabs and hide them (if any showing) 

	/*
	for (i = 0; i <= 3; i++) {
		//get the name of the associated tab from the button ID 
		buttonId = button.attr("id").split("-");
		buttonName = buttonId[0];
		tabName = "#" + buttonName + "-tab";
		//check if the tab is open, if so, close it
		if ($(button).data('state') == 'open') {
			$(button).data('state', 'closed')
			$("i", button).removeClass("fa-chevron-down");
			$("i", button).addClass("fa-chevron-right");
			$(tabName).slideUp(250);
			delay = 250;
		}
		button = button.next();
	}*/
	$("li").each(function() {
		button = $(this);
		if (button.data('state') == 'open') {
			console.log("closing")
			buttonId = button.attr("id").split("-");
			buttonName = buttonId[0];
			tabName = "#" + buttonName + "-tab";
			$(button).data('state', 'closed')
			$("i", button).removeClass("fa-chevron-down");
			$("i", button).addClass("fa-chevron-right");
			$(tabName).slideUp(250);
			delay = 250;
		}
	});

	//hide the individual test tabs and prepare the main test menu
	$("#test-tab--landing").css("display", "block");
	$(".test-tab").each(function() {
		$(".test-tab").css("display", "none");
	});


}

function changeNavButton(content, menuClick) {
	var topSectionHiddenTitle = $("#top-section--hidden-title");
	if (menuClick == true) {
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

		}
	}
	setTimeout(function() { $("#menu-button").html(content) }, 250);
}

function showContactForm() {
	if ($("#contact-form").data('state') == 'closed') {
		$("#contact-form").fadeIn(250);
		$("#contact-form").data('state', 'open');
	}
}

function hideContactForm() {
	var delay = 0;
	if ($("#contact-form").data('state') == 'open') {
		$("#contact-form").fadeOut(250);
		$("#contact-form").data('state', 'closed');
		delay = 150;
	}
	return delay;
}

$("#menu-button").on("click", function() {
	$(".top-section").css('background-image', 'none');
	hideOpenTab();
	setTimeout(function() { showContactForm() }, 250);
	changeNavButton("DISCOVER", true);
})


$(".top-section--nav-list-button").on("click", function() {
	//get the ID of the li item (button) that has been clicked
	var clickedButton = $(this);
	if ($(clickedButton).data('state') == 'open') {
		hideOpenTab();
		changeNavButton("DISCOVER", false);
		colorChange(false);
		$(".top-section").css('background', 'none');
		setTimeout(function() { showContactForm() }, 250);

	}
	else {
		hideContactForm();
		hideOpenTab();
		changeNavButton("CONTACT", false);
		colorChange(true);
		changeBackground(clickedButton);
		setTimeout(function() { showTab(clickedButton) }, 250);
	}
})

$("#calendar").on("click", function() {
	console.log("clicked")
	$("#contact-form").html('<iframe src="https://calendar.google.com/calendar/embed?src=llafnderyff%40googlemail.com&ctz=Europe%2FLondon" style="border: 0" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>')
})
