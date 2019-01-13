$(".test-tab--test-button").on("click", function () {
    console.log($(this))
    var buttonId = $(this).attr("id").split("-");
    var testId=buttonId[1];
    console.log("clicked "+testId)
    $("#test-tab--landing").fadeOut(250);  
    setTimeout(function () { $("#test-tab--"+testId).fadeIn(250); },250);
})