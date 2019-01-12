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
		$("#title").css("visibility", "visible");
		$("#title").addClass('title-animation')
	}, 2500);
}

function animateMenuBar() {

	setTimeout(function() { $("#navbar").addClass('menubar-animation') }, 3500);
	//	setTimeout(function() { $(".actions-section").addClass('menubar-animation') }, 3500);
}

function animateContactInformation() {

	setTimeout(function() { $("#contact-form").addClass('contact-animation') }, 4500);
	//	setTimeout(function() { $(".actions-section").addClass('menubar-animation') }, 3500);
}


function colorChange(bool) {
	if(bool===true) {
		$("#menu-button").css('background-color', '#6d23ff');	
	}	
	else {
		$("#menu-button").css("background-color", "#9c6df9");	
	}
}

$(document).ready(function() {
	animateLanding()
})

$("#menu-button").on("click", function() {

	var button = $("li").first();
	var buttonId;
	var titleContainer=$("span.title-container");
	delay = 0;
	/*cycle through the tabs and hide them (if any showing) */
	for (i = 0; i <= 3; i++) {
		buttonId = button.attr("id").split("-");
		tabName = "#" + buttonId[0] + "-tab";
		if ($("i", button).hasClass("fa-chevron-down")) {
			$("i", button).removeClass("fa-chevron-down");
			$("i", button).addClass("fa-chevron-right");
			$(tabName).slideUp(250);
			delay = 250;
		}
		button = button.next();
	}
	if ($(window).width() < 768) {
		$("span.title-container").fadeToggle(500);
		if( titleContainer.data('state')==='hidden' ) {
			titleContainer.data('state','visible');
			colorChange(true);
		}
		else {
			titleContainer.data('state','hidden');
			colorChange(false);
		}
		setTimeout(function() { $("#menu-button").html("DISCOVER") }, 250);
		//$("#contact-button").css("visibility", "hidden");
	}
	setTimeout(function() { $("#contact-form").fadeIn(150) }, delay);
})


$("li").on("click", function() {
	//get the ID of the li item (button) that has been clicked
	var clickedButtonId = $(this).attr("id").split("-");
	//get the ID of the tab to be shown/hidden associated with that button
	var clickedTabName = "#" + clickedButtonId[0] + "-tab";

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
			console.log("button:" + $("i", button));
			//check if another tab is showing and, if so hide it and delay showing new tab
			if ($("i", button).hasClass("fa-chevron-down")) {

				console.log("has class")
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
	}



	//if the clicked tab is hidden - show it and hide the menu button (helps user experience
	//to avoid losing the menu accidentally), else hide the tab and show the menu button, if no other tab displayed.
	if ($("i", this).hasClass("fa-chevron-right")) {
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
		$("i", this).removeClass("fa-chevron-down");
		$("i", this).addClass("fa-chevron-right");
		$(clickedTabName).slideUp(250);
		if ($(window).width() < 768) {

			$("#menu-button").html("DISCOVER");
			//	$("#contact-button").css("visibility", "hidden");

		}
		setTimeout(function() { $("#contact-form").fadeIn(150) }, 250);
	}

})


$("#calendar").on("click", function() {
	console.log("clicked")
	$("#contact-form").html('<iframe src="https://calendar.google.com/calendar/embed?src=llafnderyff%40googlemail.com&ctz=Europe%2FLondon" style="border: 0" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>')
})
