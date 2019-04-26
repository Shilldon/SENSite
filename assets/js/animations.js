/*----- START UP ANIMATIONS -----*/
//for tablets and above - animate the landing page

function animateLanding() {
	if ($(window).width() > 767) {
		animateLogo();
		animateTitle();
		animateMenuBar();
		animateContactInformation();
	}
}
//sweep in logo from above
function animateLogo() {
	$("#logo").addClass('logo-animation');
}

//sweep in title from left
function animateTitle() {
	setTimeout(function() {
		$("#top-section--title").css("visibility", "visible");
		$("#top-section--title").addClass('title-animation')
	}, 2500);
}

//sweep in nav bar from bottom
function animateMenuBar() {
	setTimeout(function() { $("#navbar").addClass('menubar-animation') }, 3500);
}

//fade in contact form
function animateContactInformation() {
	setTimeout(function() { $("#contact-form").addClass('contact-animation') }, 4500);
}

/*----- NAV BUTTON COLOUR CHANGE -----*/

//change the color of the nav button (mobile screens only).
//light purple when pressed and nav bar is showing
//dark purple when de-pressed and nav bar is hidden or contact button is showing
function changeMenuButtonColor(bool) {
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

//sweep down and show the tab that is clicked on
function showTab(clickedButton) {
	//get the name of the tab that was clicked on
	var clickedButtonId = $(clickedButton).attr("id").split("-")
	var clickedButtonName = clickedButtonId[0]
	var clickedTabName = "#" + clickedButtonName + "-tab";;

	//set the tab state to open
	$(clickedButton).data('state', 'open');

	//change the chevron to 'down'
	$("i", clickedButton).removeClass("fa-chevron-right");
	$("i", clickedButton).addClass("fa-chevron-down");

	//if the tab is the schools map, focus on the search box after sweep in
	if (clickedButtonName == "schools") {
		$(clickedTabName).slideDown(250, function() {
			$('#map-address-1').focus();
		});
	}
	else {
		$(clickedTabName).slideDown(250);
	}
}

//hide open tabs after another tab is selected
function hideOpenTab() {
	var button;
	var buttonId;
	var buttonName
	var tabName;

	//cycle through the tabs and hide the open one (if any showing) 
	$("li").each(function() {
		button = $(this);
		//check if the tab is open, if so set state to closed and revert the 
		//chevron to right and slide up the tab
		if (button.data('state') == 'open') {
			buttonId = button.attr("id").split("-");
			buttonName = buttonId[0];
			tabName = "#" + buttonName + "-tab";
			$(button).data('state', 'closed')
			$("i", button).removeClass("fa-chevron-down");
			$("i", button).addClass("fa-chevron-right");
			$(tabName).slideUp(250);
			//delay = 250;
			//if the test tab is open need to close the test and revert to
			//test landing tab for next time it is opened.
			setTimeout(function() {
				if (buttonName == 'test') {
					//hide the individual test tabs and prepare the main test menu
					$("#test-tab--landing").css("display", "block");
					$(".test-tab").each(function() {
						$(".test-tab").css("display", "none");
					});
				}
				else if (buttonName == 'data') {
					//hide the currently displayed chart and revert to data landing tab for the next
					//time it is opened
					$("#data-tab--landing").css("display", "block");
					$("#data-tab--chart-tab").css("display", "none");

				}
			}, 250);
		}
	});


}


//change the background at the top of the page depending on the tab selected
//to aid user identifying the section they are in 
function changeBackground(clickedButton) {
	var clickedButtonId = $(clickedButton).attr("id").split("-")
	var clickedButtonName = clickedButtonId[0];
	$(".top-section").css('background', 'url(assets/images/background-' + clickedButtonName + '.jpg) no-repeat');
	$(".top-section").css('background-size', 'cover');
	$(".top-section").css('background-position', 'center');
	$('.top-section--opaque-container').css('opacity','0.4');
}

//when the nav button is clicked hide / show the sub-title (mobile screens only)
function changeMenuButton(content, menuClick) {
	var topSectionHiddenTitle = $("#top-section--hidden-title");
	if (menuClick == true) {
		if ($(window).width() < 768) {
			topSectionHiddenTitle.fadeToggle(500);
			if (topSectionHiddenTitle.data('state') === 'hidden') {
				topSectionHiddenTitle.data('state', 'visible');
				changeMenuButtonColor(true);			
			}
			else {
				topSectionHiddenTitle.data('state', 'hidden');
				changeMenuButtonColor(false);
			}

		}
	}
	//change the wording on the nav button to either DISCOVER or CONTACT
	//depending on where the user is on the site.
	setTimeout(function() { $("#menu-button").html(content) }, 250);
}

//on return to home page by clicking the nav button / hiding all tabs
//show the contact form
function showContactForm() {
	if($('#contact-form').data('calendar-showing')===true) {
		var contactFormHTML=$('#contact-form').data('contact-form');
		$("#contact-form").html(contactFormHTML);
    	$("#contact-form").data('calendar-showing',false);
	}
	if ($("#contact-form").data('state') == 'closed') {
		$("#contact-form").fadeIn(250);
		$("#contact-form").data('state', 'open');
	}
}

//on opening a tab - show the contact form
function hideContactForm() {
	var delay = 0;
	if ($("#contact-form").data('state') == 'open') {
		$("#contact-form").fadeOut(250);
		$("#contact-form").data('state', 'closed');
		delay = 150;
	}
	return delay;
}

//on returning to home page remove background image and set the opacity to 0
function removeBackgroundImage() {
	$(".top-section").css('background-image', 'none');
	$('.top-section--opaque-container').css('opacity','0');
}