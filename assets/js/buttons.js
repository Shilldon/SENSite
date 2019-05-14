$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

/*----- Menu Button and Nav Bar -----*/

//clicking the nav button will show the contact form and hide any open tabs and
//hides/shows the navbar
$("#menu-button").on("click", function() {
    removeBackgroundImage();
	hideOpenTab();
	setTimeout(function() { showContactForm(); }, 250);
	changeMenuButton("DISCOVER", true);
});


$(".top-section--nav-list-button").on("click", function() {
	//get the ID of the li item (button) that has been clicked
	var clickedButton = $(this);

	//if the tab is open, close it, show the contact form and change the nav
	//button
	if ($(clickedButton).data('state') == 'open') {
		hideOpenTab();
		changeMenuButton("DISCOVER", false);
		changeMenuButtonColor(false);

		//hide the top section background when reverting to home screen and change opacity to none
		removeBackgroundImage();
		setTimeout(function() { showContactForm(); }, 250);

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
		setTimeout(function() { showTab(clickedButton); }, 250);
	}
});

/*----- Data tab buttons -----*/

//Show/hide the chart-tab
$(".data-tab--chart-button").on("click", function() {
    var buttonId = $(this).attr("id").split("-");
    var action = buttonId[2];
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
});

//plot the charts
$("#chart-submit").click(function() {
    initialiseForNextButtons();
    defineChartData();
});

//postcode input for plotting charts
$('#chart-address').keypress(function(e) {
    if (e.keyCode == 13) {
        $('#chart-submit').focus();
        defineChartData();
    }
});

//radio button to show charts based on total school capacity
$("#select-school-capacity").click(function() {
    if (typeof new_schools_dim != 'undefined') {
        renderChart(new_schools_dim);
    }
});

//radio button to show charts based on pupil numbers by gender
$("#select-total-pupils").click(function() {
    if (typeof new_schools_dim != 'undefined') {
        renderChart(new_schools_dim);
    }
});

/*----- Test tab buttons -----*/

//events for buttons in test tab
$(".test-tab--test-button").on("click", function() {
    var buttonId = $(this).attr("id").split("-");
    var action = buttonId[2];
    var testId = buttonId[1];
    switch (action) {
        //show the relevant test
        case 'select':
            buttonSelect(testId);
            break;
        //start the reelvant test
        case 'start':
            buttonStart(testId);
            break;
        //go back to test menu    
        case 'back':
            $(this).closest('section').fadeOut(250);
            clearTimeout(myVariable.DisplayResult);
            clearTest();
            setTimeout(function() { $("#test-tab--landing").fadeIn(250); }, 250);
            break;
        case 'skip':
            skipQuestion(testId);
            break;
        //submit test answer - only for literacy and numeracy tests    
        case 'submit':
            if (testId == 'numeracy') {
                if ($(this).attr('disabled') != true) {
                    var answer = $("#numeracy-answer").val();
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
                //cycle through the words in the submitted sentence and form submitted answer array
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
                        });
                        setTimeout( function() { hideModal(); }, 2000);
                    }
                    else {
                        submittedAnswer[count] = answerWord.text();
                    }
                    count++;
                }
                //if the sentence is complete and the submit button is not disabled check the answer
                if (incompleteSentence == false && $(this).attr("disabled") != true) {
                    $(this).attr('disabled', true);
                    checkLiteracyAnswer(submittedAnswer);
                }
            }
            break;
    }
});

function hideModal() {
	$("#errorModal").modal('hide');
}
/*-----Map buttons-----*/

$("#map-submit").click(function() {
  searchForSchool();
});

$('#map-address').keypress(function(e) {
  if (e.keyCode == 13) {
    $('#map-submit').focus();
    searchForSchool();
  }
});

$('.data-tab--dropdown-select').click(function() {
    var buttonId=$(this).attr('id').split("-");
    var chart=buttonId[5];
    //set local variable for chart type to be displayed
    $("#data-tab--chart").attr("chart_type",chart);
    console.log(chart)
    initialiseForNextButtons();
    defineChartData();
})

