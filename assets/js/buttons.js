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
            setTimeout(function() { $("#data-tab--chart-" + chartId+"-tab").fadeIn(250); }, 250);
            break;
        case 'back':
            $(this).closest('section').fadeOut(250);
            setTimeout(function() { $("#data-tab--landing").fadeIn(250); }, 250);
            break;
    }
})

$("#chart-submit").click(function() {
    $('#button-chart-plot-previous').attr('min',0);
    $('#button-chart-plot-next').attr('max',25);    
    defineChartData();
});

$('#chart-address-1').keypress(function(e) {
    if (e.keyCode == 13)
        $('#chart-address-2').focus();
});
$('#chart-address-2').keypress(function(e) {
    if (e.keyCode == 13)
        $('#chart-submit').focus();
    defineChartData();
});

/*----- Test tab buttons -----*/

$(".test-tab--test-button").on("click", function() {
    var buttonId = $(this).attr("id").split("-");
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
