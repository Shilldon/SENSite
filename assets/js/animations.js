	$("li").on("click", function() {
		//get the ID of the li item (button) that has been clicked
		var clickedButtonId = $(this).attr("id").split("-");
		//get the ID of the tab to be shown/hidden associated with that button
		var clickedTabName = "#" + clickedButtonId[0] + "-tab";
		
		//set up variables to cycle through and hide other tabs, as appropriate
		var button = $("li").first();
		var buttonId;
		var tabName;
		var delay=0;

		//cycle through buttons - if previous tab is showing hide it and toggle chevron on button
		for (i = 0; i <= 3; i++) {
			buttonId = button.attr("id").split("-");
			tabName = "#" + buttonId[0] + "-tab";
			if (buttonId[0] != clickedButtonId[0]) {
				if ($("i", button).hasClass("fa-chevron-down")) {
					$("i", button).removeClass("fa-chevron-down");
					$("i", button).addClass("fa-chevron-right");
					$(tabName).slideUp(250);
					delay = 250;
				}
			}
			button = button.next();
		}
		
		//if the clicked tab is hidden - show it, else hide it.
		if ($("i", this).hasClass("fa-chevron-right")) {
			$("i", this).removeClass("fa-chevron-right");
			$("i", this).addClass("fa-chevron-down");
			setTimeout(function() {
				$(clickedTabName).slideDown(250);
			}, delay);
		}
		else {
			$("i", this).removeClass("fa-chevron-down");
			$("i", this).addClass("fa-chevron-right");
			$(clickedTabName).slideUp(250);
		}

	})
	