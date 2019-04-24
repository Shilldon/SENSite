//Generic functions relevant to all test tabs (numeracy literacy and memory)

//All tests globals
var Start = new Date();
var DisplayResult;
var CurrentTest;
var TotalScore = 0;
var QuestionNumber = 0;
var TestResult = 0;

//Literacy test globals
var AnswerArray = [];
var QuestionArray = [];
var ParentQuestionsArray = [];

//Numeracy test globals
var Answer = [];
var Question = [];

//Memory test globals
//create an array of pairs of icons
var MemoryArray = new Array(1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8);
var CardShowing = false
var FirstCardShown = 0;
var BoardLocked=false;


//function fired when a 'start test' button is clicked
function buttonStart(test) {
    //fade out the relevant test landing page
    //then call the appropriate test start function after delay to allow the tab to fade
    $("#test-tab--" + test).fadeOut(250);
    setTimeout(function() {
        $("#test-tab--" + test + "-test").fadeIn(250, function() {
            if (test == "numeracy") {
                //after numeracy tab is faded in focus on answer box
                $("#numeracy-answer").focus();
            }
        });
    }, 250);
    //start relevant test
    if (test == "numeracy") {
        startNumeracyTest();
    }
    else if (test == "literacy") {
        startLiteracyTest();
    }
    else if (test == "memory") {
        startMemoryTest();
    }
}

//function fired from test landing page to show the instructions for the relevant test selected
//after a delay to allow the landing page to fade
function buttonSelect(test) {
    $("#test-tab--landing").fadeOut(250);
    setTimeout(function() { $("#test-tab--" + test).fadeIn(250); }, 250);
}

//called on clicking skip
function skipQuestion(testId) {
    //if total questions answered are less than 10 move to next question
    if (QuestionNumber < 10) {
        nextQuestion(testId);
       // $('#' + testId + '-answer').focus();
    }
    //otherwise after pause - display the result
    else {
        DisplayResult = setTimeout(function() { reportScore(testId) }, 1500);
    }
}

//show the first literacy or numeracy question at the start of the test
//or the next question on skipping or submitting answer to previous question
function nextQuestion(testId) {
    //increase the question number
    QuestionNumber++;
    if (testId == "numeracy") {
        //change the question number at the top of the tab
        $("#numeracy-question-header").text("Question " + (QuestionNumber).toString());
        //empty the answer box
        $("#numeracy-answer").val('');
        //show the question
        $("#numeracy-question").text(Question[QuestionNumber]);
        //deleted the answer mark (tick or cross) from last question
        $("#numeracy-answer-mark").fadeOut('slow');
        //place cursor in answer box
        $("#numeracy-answer").focus();
        //re-enable the answer submit button (disabled after submitting answer to prevent
        //numerous submissions for one question on repeated clicking)
        $("#button-numeracy-submit").removeAttr("disabled");

    }
    else if (testId == "literacy") {
        //get the next array of words
        wordsArray = Question[QuestionNumber];
        //change the question number at the top of the page
        $("#literacy-question-header").text("Question " + (QuestionNumber).toString());
        var questionDivContents = "";
        var answerDivContents = "";
        //remove empty spaces from the wordsArray
        QuestionArray = cleanArray(wordsArray);
        //record the answer array
        AnswerArray = QuestionArray.slice(0);
        //then shuffle up the words to create the question
        QuestionArray = shuffleArray(QuestionArray);

        //for each word in the array create a button in the question section on the page with that word
        //and create a space in the answer section
        for (i = 0; i < QuestionArray.length; i++) {
            if (QuestionArray[i] != "") {
                questionDivContents = questionDivContents + "<button id='question-word-" + i + "' onclick='wordSelect($(this))' class='test-tab--literacy-word test-tab--literacy-word-question-shown'>" + QuestionArray[i] + "</button>";
                answerDivContents = answerDivContents + "<button  id='answer-word-" + i + "' onclick='wordSelect($(this))' class='test-tab--literacy-word test-tab--literacy-word-answer-hidden'></button><img class='test-tab--literacy-answer-mark' id='literacy-answer-mark-" + i + "' src=''>";
            }
        }

        //show the question
        $("#test-tab--literacy-test-question").html(questionDivContents)
        //show the blank answer array
        $("#test-tab--literacy-test-answer").html(answerDivContents)
        //re-enable the answer submit button (disabled after submitting answer to prevent
        //numerous submissions for one question on repeated clicking)
        $("#button-literacy-submit").removeAttr("disabled");
    }
}


//called on end of memory test or answering/skipping last numeracy/literacy question

function reportScore() {
    //get the start and end times for the tests and calculate time spent
    var end = new Date();
    var startTime = Start.getTime();
    var endTime = end.getTime();
    var TotalTime = Math.ceil((endTime - startTime) / 1000);
    //generate result based on score on test and time taken
    TestResult = Math.ceil(TotalScore / TotalTime * 100);
    $('#test-tab--' + CurrentTest + '-test').fadeOut(250);
    setTimeout(function() { $('#test-tab--' + CurrentTest + '-result').fadeIn(250); }, 250);
    $('#' + CurrentTest + '-result').text(TestResult.toString());

    //retrieve the local csv files of test results to render in chart
    queue()
        .defer(d3.csv, 'assets/data/' + CurrentTest + 'scores.csv')
        .await(loadData);

    function loadData(error, scoreData) {
        ndx = crossfilter(scoreData);
        scoreData.forEach(function(d) {
            d.score = parseInt(d.score);
            d.students = parseFloat(d.students);
        });
        renderResults(ndx, CurrentTest);

    }

}

//render a graph displaying the score achieved relative to population scores
function renderResults(resultData, test) {
    //create a dimension from cross filter for x axis based on score achieved
    var score_dim = resultData.dimension(dc.pluck('score'));
    //create a dimension from crossfilter for y axis based on percentage of student with the score
    var students_dim = score_dim.group().reduceSum(dc.pluck('students'));

    //set bottom and top ends of x axis
    var minScore = score_dim.bottom(1)[0].score;
    var maxScore = score_dim.top(1)[0].score;

    //if test result is more than max or less than minimum score on graph set it to the max or min
    if (TestResult > maxScore) { TestResult = maxScore; }
    if (TestResult < minScore) { TestResult = minScore; }
    var resultChart = dc.lineChart('#' + test + '-result-chart')

    var chartHeight = $(".test-tab--result-chart").height() - 25;
    var chartWidth = $(".test-tab--result-chart").width() - 25;

    resultChart
        .width(chartWidth)
        .height(chartHeight)
        .brushOn(false)
        .on('renderlet', function(resultChart) {
            //cycle through points on line graph and highlight in red the point on the graph matching
            //the user's score
            resultChart.selectAll('.dot')
                .attr('style', function(d) {
                    scoreValue = d.data.key;
                    if (scoreValue == TestResult) {
                        resultChart.xyTipsOn(false);
                        return "fill-opacity:1; fill: red"
                    }
                    else {
                        return "fill-opacity:0;"
                    }
                })
                //ensure the dot is not removed on mouseover
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

//shuffle array for memory and literacy questions 
function shuffleArray(arr) {
    var currentIndex = arr.length,
        temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
    }
    return arr;
}