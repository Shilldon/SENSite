$(document).ready(function() {
    $('#numeracy-answer').keypress(function(e) {
        if (e.keyCode == 13)
            $('#button-numeracy-submit').click();
    });
});

var Answer = [];
var Question = [];
var QuestionNumber = 0;
var TotalScore = 0;
var Start = new Date();

function clearTest() {
    Answer=[];
    Question=[];
    QuestionNumber=0;
    TotalScore=0;
}

function startNumeracyTest() {
    Start=new Date();
    for (i = 0; i <= 9; i++) {
        newQuestion();
        Answer[i]=query.answer;
        Question[i] = query.firstNumber + " " + query.firstOperator + " " + query.secondNumber + " " + query.secondOperator + " " + query.thirdNumber + " = ";
    }
    $("#numeracy-question").text(Question[0]);
}

function nextQuestion() {
    QuestionNumber++;
    $("#numeracy-answer").val('');
    $("#question-header").text("Question " + (QuestionNumber + 1).toString());
    $("#numeracy-question").text(Question[QuestionNumber]);
    $("#answer-mark").fadeOut('slow');
}

function reportScore() {
    QuestionNumber=0;
    var end = new Date();
    var startTime = Start.getTime();
    var endTime = end.getTime();
    var TotalTime = Math.ceil((endTime - startTime) / 1000);
    var result = Math.ceil(TotalScore / TotalTime * 100);
    $("#test-tab--numeracy-test").fadeOut(250);
    setTimeout(function() { $("#test-tab--numeracy-result").fadeIn(250); }, 250);
    $("#numeracy-result").text(result.toString());
}

function skipQuestion() {
    if (QuestionNumber < 9) {
        nextQuestion();
        $("#numeracy-answer").focus();
    }
    else {
        reportScore();
    }
}

function checkAnswer(answer) {
    console.log(answer);
    if (isNaN(answer) || answer=="") {
        alert("Enter a number as your answer!")
    }
    else if (answer == Answer[QuestionNumber]) {
        $("#answer-mark").css('display', 'block');
        $("#answer-mark").attr('src', 'assets/images/tick.png');
        TotalScore++;
        if (QuestionNumber < 9) {
            setTimeout(function() { nextQuestion() }, 1500);
        }
        else {
            reportScore();
        }
    }
    else {
        $("#answer-mark").css('display', 'block');
        $("#answer-mark").attr('src', 'assets/images/cross.png');
        if (QuestionNumber < 9) {
            setTimeout(function() { nextQuestion() }, 2500);
        }
        else {
            reportScore();
        }
    }
}

$("#button-numeracy-submit").on("click", function() {
    answer = +$("#numeracy-answer").val();
    checkAnswer(answer);

})

$("#button-numeracy-skip").on("click", function() {
    skipQuestion();
})
