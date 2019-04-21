var AnswerArray = [];
var QuestionArray = [];
var ParentQuestionsArray = [];
var TotalScore = 0;
var QuestionNumber = 0;
var Start = new Date();

function cleanArray(wordsArray) {
    var cleanedArray = $.grep(wordsArray, function(n) {
        return (n);
    });
    return cleanedArray;
}

function shuffleArray() {
    var currentIndex = QuestionArray.length,
        temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = QuestionArray[currentIndex];
        QuestionArray[currentIndex] = QuestionArray[randomIndex];
        QuestionArray[randomIndex] = temporaryValue;
    }
    return QuestionArray;
}

function getQuestions() {
    $.ajax({
        type: "GET",
        url: "assets/data/literacyquestions.csv",
        dataType: "text",
        success: function(data) {
            var questionLines = createQuestionsArray(data);
        }
    });
}

function createQuestionsArray(questions) {
    var allTextLines = questions.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            var questionLine = []
            for (j = 0; j < headers.length; j++) {
                questionLine.push(data[j]);
            }
            ParentQuestionsArray.push(questionLine);
        }
    }

    selectRandomQuestions();
}

function startLiteracyTest() {
    CurrentTest = "literacy";
    Start = new Date();
    TotalScore = 0;
    QuestionNumber = 0;
    //retrieve the csv file of sentences and createa an array of possible questions
    getQuestions();
}

function selectRandomQuestions() {
    for (i = 0; i <= 9; i++) {
        var randomQuestionIndex = i * 5 + Math.ceil(Math.random() * Math.floor(4));
        Question[i + 1] = ParentQuestionsArray[randomQuestionIndex];
    }
    //put text of question on screen
    nextQuestion("literacy");
}

function revealWord(hideWordType, hideWord, wordValue) {
    var count = 0;
    var whileBreak = false;
    var showWordType;
    if (hideWordType == "question") {
        showWordType = "answer";
    }
    else {
        showWordType = "question";
    }
    shownClass = "test-tab--literacy-word-" + hideWordType + "-shown";
    if (hideWord.hasClass(shownClass)) {
        hideWord.text("");
        hideWord.toggleClass("test-tab--literacy-word-" + hideWordType + "-hidden test-tab--literacy-word-" + hideWordType + "-shown");
        while (whileBreak == false) {
            showWord = $("#" + showWordType + "-word-" + count);
            hiddenClass = "test-tab--literacy-word-" + showWordType + "-hidden";
            if (showWord.hasClass(hiddenClass)) {
                whileBreak = true;
                showWord.toggleClass("test-tab--literacy-word-" + showWordType + "-hidden test-tab--literacy-word-" + showWordType + "-shown");
                showWord.text(wordValue);
            }
            if (showWord.attr("id") == null) {
                whileBreak = true;
            }
            count++;
        }
    }
}

function wordSelect(wordClicked) {
    var buttonType = $(wordClicked).attr("id").split("-");
    var wordValue = $(wordClicked).text();
    var button = buttonType[0];
    revealWord(button, wordClicked, wordValue);
}

function checkLiteracyAnswer(submittedAnswer) {
    //    for (i = 0; i < AnswerArray.length; i++) { console.log(AnswerArray[i]); }
    //    for (i = 0; i < submittedAnswer.length; i++) { console.log(submittedAnswer[i]); }
    var wrong = false;
    for (i = 0; i < submittedAnswer.length; i++) {
        imagename = "#literacy-answer-mark-" + i;
        image = $(imagename);
        if (submittedAnswer[i] != AnswerArray[i]) {
            image.attr('src', 'assets/images/cross.png');
            wrong = true;
        }
        else {
            image.attr('src', 'assets/images/tick.png');
        }
    }
    wrong = false;
    if (wrong == false) {
        TotalScore++;
    }
    if (QuestionNumber < 10) {
        setTimeout(function() { nextQuestion("literacy") }, 2500);
    }
    else {
        DisplayResult = setTimeout(function() { reportScore("literacy") }, 1500);
    }
}
/*
$(".test-tab--test-button").on("click", function() {
    if($(this).attr('id')=='button-literacy-submit') {
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
        //incomplete sentence (word not submitted) break out and display error
        else if (answerWord.hasClass("test-tab--literacy-word-answer-hidden")) {
            whileBreak = true;
            incompleteSentence = true;
            alert("You need to complete the sentence");
        }
        else {
            submittedAnswer[count] = answerWord.text();
        }
        count++;
    }
    if (incompleteSentence == false && $(this).attr("disabled") != "disabled") {
        $(this).attr("disabled", true);
        checkLiteracyAnswer(submittedAnswer);
    }
    }
})*/

function loadLiteracyData(error, literacyData) {
    ndx = crossfilter(literacyData);
    literacyData.forEach(function(d) {
        d.score = parseInt(d.score);
        d.students = parseFloat(d.students);
    });
    renderResults(ndx, "literacy");

}

function print_filter(filter) {
    var f = eval(filter);
    if (typeof(f.length) != "undefined") {}
    else {}
    if (typeof(f.top) != "undefined") { f = f.top(Infinity); }
    else {}
    if (typeof(f.dimension) != "undefined") { f = f.dimension(function(d) { return ""; }).top(Infinity); }
    else {}
    // console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
}


function renderResults(resultData, test) {
    print_filter(resultData)
    var score_dim = resultData.dimension(dc.pluck('score'));
    var students_dim = score_dim.group().reduceSum(dc.pluck('students'));
    var minScore = score_dim.bottom(1)[0].score;
    var maxScore = score_dim.top(1)[0].score;
    console.log(minScore + ", " + maxScore)
    if (TestResult > maxScore) { TestResult = maxScore; }
    if (TestResult < minScore) { TestResult = minScore; }
    var resultChart = dc.lineChart('#' + test + '-result-chart')

    var chartHeight = $(".result-chart").height() - 25;
    var chartWidth = $(".result-chart").width() - 25;

    console.log("height=" + chartHeight + " width=" + chartWidth)
    resultChart
        .width(chartWidth)
        .height(chartHeight)
        .brushOn(false)
        .on('renderlet', function(resultChart) {
            resultChart.selectAll('.dot')
                .attr('style', function(d) {
                    scoreValue = d.data.key;
                    //  console.log("scoreValue="+scoreValue+" TotalScore="+TotalScore)
                    if (scoreValue == TestResult) {
                        resultChart.xyTipsOn(false);
                        return "fill-opacity:1; fill: red"
                    }
                    else {
                        return "fill-opacity:0;"
                    }
                })
                .on('mouseout.redhighlight', function(d) {
                    scoreValue = d.data.key;
                    if (scoreValue == TestResult) { $(this).attr('style', 'fill: red; fill-opacity:1') }
                })
        })
        .dimension(score_dim)
        .group(students_dim)
        .transitionDuration(10)
        .x(d3.scale.linear().domain([minScore, maxScore]))
        .xAxisLabel("Score")
        .yAxis().ticks(4);
    dc.renderAll();
}

/*
function reportScore() {
    var end = new Date();
    var startTime = Start.getTime();
    var endTime = end.getTime();
    var TotalTime = Math.ceil((endTime - startTime) / 1000);
    var result = Math.ceil(TotalScore / TotalTime * 100);
    $("#test-tab--literacy-test").fadeOut(250);
    setTimeout(function() { $("#test-tab--literacy-result").fadeIn(250); }, 250);
    $("#literacy-result").text(result.toString());
}
*/
$("#button-literacy-skip").on("click", function() {
    skipQuestion("literacy");
})
