$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
});

$(".test-tab--test-button").on("click", function() {
    var buttonId = $(this).attr("id").split("-");
    var action = buttonId[2];
    var testId = buttonId[1];
    switch (action) {
        case 'select':
            $("#test-tab--landing").fadeOut(250);
            setTimeout(function() { $("#test-tab--" + testId).fadeIn(250); }, 250);
            break;
        case 'start':
            $("#test-tab--" + testId).fadeOut(250);
            setTimeout(function() {
                $("#test-tab--" + testId + "-test").fadeIn(250, function() {
                    $("#numeracy-answer").focus();
                });
            }, 250);
            $("#question-header").text("Question 1");
            if (testId == "numeracy") {
                startNumeracyTest();
            }
            else if(testId=="literacy") {
                startLiteracyTest();
            }
            break;
        case 'back':
            $(this).closest('section').fadeOut(250);
            clearTest();
            setTimeout(function() { $("#test-tab--landing").fadeIn(250); }, 250);
            break;
    }
})
