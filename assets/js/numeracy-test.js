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
var TestResult = 0;
var Start = new Date();
var DisplayResult;
var CurrentTest;

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
    QuestionNumber = 0;
    TotalScore = 0;
    CurrentTest="numeracy";
    for (i = 1; i <= 10; i++) {
        newQuestion();
        Answer[i] = query.answer;
        Question[i] = query.firstNumber + " " + query.firstOperator + " " + query.secondNumber + " " + query.secondOperator + " " + query.thirdNumber + " = ";
    }
    nextQuestion("numeracy");
    /*
    $("#numeracy-question-header").text("Question " + (QuestionNumber + 1).toString());
    $("#numeracy-question").text(Question[0]);
    $("#button-numeracy-submit").removeAttr("disabled");
    */
}

function nextQuestion(testId) {
    QuestionNumber++;
    if (testId == "numeracy") {
        $("#numeracy-answer").val('');
        $("#numeracy-question-header").text("Question " + (QuestionNumber).toString());
        $("#numeracy-question").text(Question[QuestionNumber]);
        $("#answer-mark").fadeOut('slow');
        $("#numeracy-answer").focus();
        $("#button-numeracy-submit").removeAttr("disabled");
    }
    else if (testId == "literacy") {
        wordsArray = Question[QuestionNumber];
        $("#button-literacy-submit").removeAttr("disabled");
        var questionDivContents = "";
        var answerDivContents = "";
        QuestionArray = cleanArray(wordsArray);
        AnswerArray = QuestionArray.slice(0);
        QuestionArray = shuffleArray();
        for (i = 0; i < QuestionArray.length; i++) {
            if (QuestionArray[i] != "") {
                questionDivContents = questionDivContents + "<button id='question-word-" + i + "' onclick='wordSelect($(this))' class='test-tab--literacy-word test-tab--literacy-word-question-shown'>" + QuestionArray[i] + "</button>";
                answerDivContents = answerDivContents + "<button  id='answer-word-" + i + "' onclick='wordSelect($(this))' class='test-tab--literacy-word test-tab--literacy-word-answer-hidden'></button><img class='test-tab--literacy-answer-mark' id='literacy-answer-mark-" + i + "' src=''>";
            }
        }

        $("#test-tab--literacy-test-question").html(questionDivContents)
        $("#test-tab--literacy-test-answer").html(answerDivContents)
        $("#literacy-question-header").text("Question " + (QuestionNumber).toString());
    }
}

function reportScore() {
    var end = new Date();
    var startTime = Start.getTime();
    var endTime = end.getTime();
    var TotalTime = Math.ceil((endTime - startTime) / 1000);
    TestResult = Math.ceil(TotalScore / TotalTime * 100);
    $('#test-tab--' + CurrentTest + '-test').fadeOut(250);
    setTimeout(function() { $('#test-tab--' + CurrentTest + '-result').fadeIn(250); }, 250);
    $('#' + CurrentTest + '-result').text(TestResult.toString());
//    if (test == "literacy") {
        queue()
            .defer(d3.csv, 'assets/data/'+CurrentTest+'scores.csv')
            .await(loadData);
//    }
/*    else if (test == "numeracy") {
        queue()
            .defer(d3.csv, 'assets/data/numeracyscores.csv')
            .await(loadNumeracyData);
//    }
//    else if (test == "memory") {
        queue()
            .defer(d3.csv, 'assets/data/memoryscores.csv')
            .await(loadMemoryData);
//    }    */
}


function reportMemoryScore() {
 //   QuestionNumber = 0;
    var end = new Date();
    var startTime = Start.getTime();
    var endTime = end.getTime();
    var TotalTime = Math.ceil((endTime - startTime) / 1000);
    var result = Math.ceil(TotalScore / TotalTime * 100);
    $("#test-tab--memory-test").fadeOut(250);
    setTimeout(function() { $("#test-tab--memory-result").fadeIn(250); }, 250);
    $("#memory-result").text(result.toString());
}



function skipQuestion(testId) {
    console.log("skipping question")
    if (QuestionNumber < 10) {
        nextQuestion(testId);
        $('#' + testId + '-answer').focus();
    }
    else {
        DisplayResult = setTimeout(function() { reportScore(testId) }, 1500);
    }
}

function checkAnswer(answer) {
       console.log("Answer value=" + answer);
       console.log($(answer).length);
    if (isNaN(answer) || answer == "") {
        $("#button-numeracy-submit").removeAttr("disabled");
        alert("Enter a number as your answer!");
        $("#numeracy-answer").focus();
    }
    //if the answer is right mark as correct and either proceed to the next question
    //or end the test if up to question 10
    else if (answer == Answer[QuestionNumber]) {
        $("#answer-mark").css('display', 'block');
        $("#answer-mark").attr('src', 'assets/images/tick.png');
        TotalScore++;
        if (QuestionNumber < 10) {
            setTimeout(function() { nextQuestion("numeracy") }, 1500);
        }
        else {
            reportScore("numeracy");
        }
    }
    else {
          $("#answer-mark").css('display', 'block');
        $("#answer-mark").attr('src', 'assets/images/tick.png');
        TotalScore++;
        if (QuestionNumber < 10) {
            setTimeout(function() { nextQuestion("numeracy") }, 1500);
        }
        else {
            reportScore("numeracy");
        }      
        
        $("#answer-mark").css('display', 'block');
        $("#answer-mark").attr('src', 'assets/images/cross.png');
        if (QuestionNumber < 10) {
            setTimeout(function() { nextQuestion("numeracy") }, 2500);
        }
        else {
            setTimeout(function() { reportScore("numeracy") }, 2500);
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

function loadNumeracyData(error, numeracyData) {
    console.log(numeracyData)
    ndx = crossfilter(numeracyData);
    numeracyData.forEach(function(d) {
        d.score = parseInt(d.score);
        d.students = parseFloat(d.students);
    });
    renderResults(ndx, "numeracy");

}

function loadData(error, scoreData) {
    console.log(scoreData)
    console.log("prior to redndering results test is: "+CurrentTest)
    ndx = crossfilter(scoreData);
    scoreData.forEach(function(d) {
        d.score = parseInt(d.score);
        d.students = parseFloat(d.students);
    });
    renderResults(ndx, CurrentTest);

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
