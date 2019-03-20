$(document).ready(function() {
    $('#numeracy-answer').keypress(function(e) {
        if (e.keyCode == 13 && ($('#button-numeracy-submit').attr("disabled") != "disabled"))
            $('#button-numeracy-submit').click();
    });
});

var Answer = [];
var Question = [];
var QuestionNumber = 0;
var TotalScore = 0;
var Start = new Date();
var DisplayResult;

function clearTest() {
    Answer = [];
    Question = [];
    QuestionNumber = 0;
    TotalScore = 0;
    $("#numeracy-answer").val('');
    $("#numeracy-answer").focus();
    $("#answer-mark").css('display', 'none');
}

function startNumeracyTest() {
    Start = new Date();
    QuestionNumber=0;
    TotalScore = 0;
    for (i = 0; i <= 9; i++) {
        newQuestion();
        Answer[i] = query.answer;
        Question[i] = query.firstNumber + " " + query.firstOperator + " " + query.secondNumber + " " + query.secondOperator + " " + query.thirdNumber + " = ";
    }
    $("#numeracy-question-header").text("Question " + (QuestionNumber + 1).toString());
    $("#numeracy-question").text(Question[0]);
    $("#button-numeracy-submit").removeAttr("disabled");
}

function nextQuestion(testId) {
    //    console.log("1st " + QuestionNumber)
    console.log("testId"+testId)
    QuestionNumber++;
    //    console.log("2nd " + QuestionNumber)
    if (testId == "numeracy") {
        $("#numeracy-answer").val('');
        $("#numeracy-question-header").text("Question " + (QuestionNumber + 1).toString());
        $("#numeracy-question").text(Question[QuestionNumber]);
        $("#answer-mark").fadeOut('slow');
        $("#numeracy-answer").focus();
        $("#button-numeracy-submit").removeAttr("disabled");
    }
    else if (testId == "literacy") {
        console.log("next literacy qestion")
        wordsArray=Question[QuestionNumber];
        $("#button-literacy-submit").removeAttr("disabled");
        var questionDivContents = "";
        var answerDivContents = "";
        console.log("Question Array:" + QuestionArray)
        QuestionArray = cleanArray(wordsArray);
        console.log("Cleaned Question Array:" + QuestionArray)
        AnswerArray = QuestionArray.slice(0);
        QuestionArray = shuffleArray();
        console.log("ShuffledQuestion Array:" + QuestionArray)
        console.log("Answer Array:" + AnswerArray)
        for (i = 0; i < QuestionArray.length; i++) {
            if (QuestionArray[i] != "") {
                console.log(i + " " + QuestionArray[i])
                questionDivContents = questionDivContents + "<button id='question-word-" + i + "' onclick='wordSelect($(this))' class='test-tab--literacy-word test-tab--literacy-word-question-shown'>" + QuestionArray[i] + "</button>";
                answerDivContents = answerDivContents + "<button  id='answer-word-" + i + "' onclick='wordSelect($(this))' class='test-tab--literacy-word test-tab--literacy-word-answer-hidden'></button><img style='width:7.5%' id='literacy-answer-mark-" + i + "' src=''>";
            }
        }

        $("#test-tab--literacy-test-question").html(questionDivContents)
        $("#test-tab--literacy-test-answer").html(answerDivContents)
       // QuestionNumber++;
        $("#literacy-question-header").text("Question " + (QuestionNumber).toString());
    }
}

function reportScore() {
 //   QuestionNumber = 0;
    var end = new Date();
    var startTime = Start.getTime();
    var endTime = end.getTime();
    var TotalTime = Math.ceil((endTime - startTime) / 1000);
    var result = Math.ceil(TotalScore / TotalTime * 100);
    $("#test-tab--numeracy-test").fadeOut(250);
    setTimeout(function() { $("#test-tab--numeracy-result").fadeIn(250); }, 250);
    $("#numeracy-result").text(result.toString());
}

function skipQuestion(testId) {
    console.log("skipping question")
    if (QuestionNumber < 9) {
        nextQuestion(testId);
        $('#' + testId + '-answer').focus();
    }
    else {
        DisplayResult = setTimeout(function() { reportScore() }, 1500);
    }
}

function checkAnswer(answer) {
    //   console.log("Answer value=" + answer);
    //   console.log($(answer).length);
    if (isNaN(answer) || answer == "") {
        $("#button-numeracy-submit").removeAttr("disabled");
        alert("Enter a number as your answer!");
        $("#numeracy-answer").focus();
    }
    else if (answer == Answer[QuestionNumber]) {
        $("#answer-mark").css('display', 'block');
        $("#answer-mark").attr('src', 'assets/images/tick.png');
        TotalScore++;
        if (QuestionNumber < 9) {
            setTimeout(function() { nextQuestion("numeracy") }, 1500);
        }
        else {
            reportScore();
        }
    }
    else {
        $("#answer-mark").css('display', 'block');
        $("#answer-mark").attr('src', 'assets/images/cross.png');
        if (QuestionNumber < 9) {
            setTimeout(function() { nextQuestion("numeracy") }, 2500);
        }
        else {
            setTimeout(function() { reportScore() }, 2500);
        }
    }
}

var query;

function newQuestion() {
    query = new question;
    Object.defineProperty(query, 'answer', {
        value: calculateAnswer(),
        writeable: true
    });
}

function question(firstNumber, secondNumber, thirdNumber, firstOperator, secondOperator, answer) {
    this.firstNumber = generateNumber(),
        this.secondNumber = generateNumber(),
        this.thirdNumber = generateNumber(),
        this.firstOperator = generateOperator(),
        this.secondOperator = generateOperator(),
        this.answer = 0
}

function generateOperator() {
    switch (Math.ceil(Math.random() * Math.floor(3))) {
        case 1:
            return "+";
            break;
        case 2:
            return "-";
            break;
        case 3:
            return "x";
            break;
    }
}

function generateNumber() {
    return Math.ceil(Math.random() * Math.floor(10));
}


$("#button-numeracy-submit").on("click", function() {
    // console.log("clicked submit. disabled="+$(this).attr("disabled"));
    answer = $("#numeracy-answer").val();
    $(this).attr("disabled", true);
    checkAnswer(answer);

})

$("#button-numeracy-skip").on("click", function() {
    skipQuestion("numeracy");
})
