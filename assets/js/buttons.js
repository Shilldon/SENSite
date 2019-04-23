$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

/*----- Chart tab buttons -----*/

$(".data-tab--chart-button").on("click", function() {
    var buttonId = $(this).attr("id").split("-");
    var action = buttonId[2];
    var chartId = buttonId[3];
    console.log(chartId)
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
    console.log("onclickmax=" + maxValue);
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
    console.log("button clicked=" + buttonId)
    var action = buttonId[2];
    var testId = buttonId[1];
    console.log(action);
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

function buttonStart(test) {
    $("#test-tab--" + test).fadeOut(250);
    setTimeout(function() {
        $("#test-tab--" + test + "-test").fadeIn(250, function() {
            $("#numeracy-answer").focus();
        });
    }, 250);
    if (test == "numeracy") {
        //     $('#question-' + test + 'header').text("Question 1");
        startNumeracyTest();
    }
    else if (test == "literacy") {
        //      $('#question-' + test + 'header').text("Question 1");
        startLiteracyTest();
    }
    else if (test == "memory") {
        startMemoryTest();
    }
}

function buttonSelect(test) {
    $("#test-tab--landing").fadeOut(250);
    setTimeout(function() { $("#test-tab--" + test).fadeIn(250); }, 250);
}

$("#calendar").on("click", function() {
	$("#contact-form").html('<iframe src="https://calendar.google.com/calendar/embed?src=llafnderyff%40googlemail.com&ctz=Europe%2FLondon" style="border: 0" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>')
})
