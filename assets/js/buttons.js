$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

/*----- Menu Button and Nav Bar -----*/

//clicking the nav button will show the contact form and hide any open tabs and
//hides/shows the navbar
$("#menu-button").on("click", function() {
	$(".top-section").css('background-image', 'none');
	hideOpenTab();
	setTimeout(function() { showContactForm() }, 250);
	changeMenuButton("DISCOVER", true);
})


$(".top-section--nav-list-button").on("click", function() {
	//get the ID of the li item (button) that has been clicked
	var clickedButton = $(this);

	//if the tab is open, close it, show the contact form and change the nav
	//button
	if ($(clickedButton).data('state') == 'open') {
		hideOpenTab();
		changeMenuButton("DISCOVER", false);
		changeMenuButtonColor(false);

		//hide the top section background when reverting to home screen
		$(".top-section").css('background', 'none');
		setTimeout(function() { showContactForm() }, 250);

	}
	//otherwise close the contact form/hide the current tab and open the new tab.
	//ensure the nav button changes to 'contact' to enable user to bring back 
	//contact form from any page.
	else {
		hideContactForm();
		hideOpenTab();
		changeMenuButton("CONTACT", false);
		changeMenuButtonColor(true);
		changeBackground(clickedButton);
		setTimeout(function() { showTab(clickedButton) }, 250);
	}
})

/*----- Data tab buttons -----*/

$(".data-tab--chart-button").on("click", function() {
    var buttonId = $(this).attr("id").split("-");
    var action = buttonId[2];
    var chartId = buttonId[3];
    switch (action) {
        case 'select':
            $("#data-tab--landing").fadeOut(250);
            setTimeout(function() { $("#data-tab--chart-tab").fadeIn(250); }, 250);
            break;
        case 'back':
            $(this).closest('section').fadeOut(250);
            setTimeout(function() { $("#data-tab--landing").fadeIn(250); }, 250);
            break;
    }
})

$("#chart-submit").click(function() {
    $('#button-chart-plot-previous').attr('min', 1);
    var maxValue = $("#max-results").val();
    $('#button-chart-plot-next').attr('max', maxValue);
    $('#button-chart-plot-next').attr('change', maxValue);
    defineChartData();
});

$('#chart-address').keypress(function(e) {
    if (e.keyCode == 13) {
        $('#chart-submit').focus();
        defineChartData();
    }
});

$("#select-school-capacity").click(function() {
    if (typeof new_schools_dim != 'undefined') {
        renderChart(new_schools_dim)
    }
})

$("#select-total-pupils").click(function() {
    if (typeof new_schools_dim != 'undefined') {
        renderChart(new_schools_dim)
    }
})

/*----- Test tab buttons -----*/

$(".test-tab--test-button").on("click", function() {
    var buttonId = $(this).attr("id").split("-");
    var action = buttonId[2];
    var testId = buttonId[1];
    switch (action) {
        case 'select':
            buttonSelect(testId);
            break;
        case 'start':
            buttonStart(testId);
            break;
        case 'back':
            $(this).closest('section').fadeOut(250);
            //$('#test-tab--'+testId+'-result').css('display','none');
            clearTimeout(DisplayResult);
            clearTest();
            setTimeout(function() { $("#test-tab--landing").fadeIn(250); }, 250);
            break;
        case 'skip':
            skipQuestion(testId);
            break;
        case 'submit':
            if (testId == 'numeracy') {
                if ($(this).attr('disabled') != true) {
                    answer = $("#numeracy-answer").val();
                    $(this).attr('disabled', true);
                    checkAnswer(answer);
                }
            }
            else if (testId == 'literacy') {
                var count = 0;
                var answerWord;
                var submittedAnswer = [];
                var whileBreak = false;
                var incompleteSentence = false;
                while (whileBreak == false) {
                    answerWord = $("#answer-word-" + count);
                    //reached end of sentence
                    if (answerWord.attr("id") == null) {
                        whileBreak = true;
                    }
                    //incomplete sentence (word or words not submitted) break out and display error
                    else if (answerWord.hasClass("test-tab--literacy-word-answer-hidden")) {
                        whileBreak = true;
                        incompleteSentence = true;
                        $('#error-message').text('You need to complete the sentence first.');
                        $("#errorModal").modal({
                            show: 'true',
                            backdrop: 'static',
                            keyboard: 'false'
                        })

                        setTimeout(function() {
                            $("#errorModal").modal('hide');
                        }, 2000);
                    }
                    else {
                        submittedAnswer[count] = answerWord.text();
                    }
                    count++;
                }
                if (incompleteSentence == false && $(this).attr("disabled") != true) {
                    $(this).attr('disabled', true);
                    checkLiteracyAnswer(submittedAnswer);
                }
            }
            break;
    }
})


/*-----Map buttons-----*/

$("#map-submit").click(function() {
  searchForSchool();
});

$('#map-address-1').keypress(function(e) {
  if (e.keyCode == 13)
    $('#map-address-2').focus();
});
$('#map-address').keypress(function(e) {
  if (e.keyCode == 13) {
    $('#map-submit').focus();
    searchForSchool();
  }
});

/*-----calendar-----*/

$("#calendar").on("click", function() {
    $("#contact-form").html('<iframe src="https://calendar.google.com/calendar/embed?src=llafnderyff%40googlemail.com&ctz=Europe%2FLondon" style="border: 0" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>')
})
