//Generic functions relevant to all test tabs (numeracy literacy and memory)

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
    if (myVariable.QuestionNumber < 10) {
        nextQuestion(testId);
        // $('#' + testId + '-answer').focus();
    }
    //otherwise after pause - display the result
    else {
        myVariable.DisplayResult = setTimeout(function() { reportScore(testId); }, 1500);
    }
}

//show the first literacy or numeracy question at the start of the test
//or the next question on skipping or submitting answer to previous question
function nextQuestion(testId) {
    //increase the question number
    myVariable.QuestionNumber++;
    if (testId == "numeracy") {
        //change the question number at the top of the tab
        $("#numeracy-question-header").text("Question " + (myVariable.QuestionNumber).toString());
        //empty the answer box
        $("#numeracy-answer").val('');
        //show the question
        $("#numeracy-question").text(myVariable.QuestionArray[myVariable.QuestionNumber]);
        //deleted the answer mark (tick or cross) from last question
        $("#numeracy-answer-mark").fadeOut('slow');
        //place cursor in answer box
        $("#numeracy-answer").focus();
        //re-enable the answer submit button (disabled after submitting answer to prevent
        //numerous submissions for one question on repeated clicking)
        $("#button-numeracy-submit").removeAttr("disabled");
    }
    else if (testId == "literacy") {
        //set up array to receive list of words from master questions array
        var thisQuestion = [];
        //get the next array of words
        var wordsArray = myVariable.QuestionArray[myVariable.QuestionNumber];
        //change the question number at the top of the page
        $("#literacy-question-header").text("Question " + (myVariable.QuestionNumber).toString());
        var questionDivContents = "";
        var answerDivContents = "";
        //remove empty spaces from the wordsArray
        thisQuestion = cleanArray(wordsArray);
        //record the answer array
        myVariable.LiteracyAnswerArray = thisQuestion.slice(0);
        //then shuffle up the words to create the question
        thisQuestion = shuffleArray(thisQuestion);

        //for each word in the array create a button in the question section on the page with that word
        //and create a space in the answer section
        for (i = 0; i < thisQuestion.length; i++) {
            if (thisQuestion[i] != "") {
                questionDivContents = questionDivContents + "<button id='question-word-" + i + "' onclick='wordSelect($(this))' class='test-tab--literacy-word test-tab--literacy-word-question-shown'>" + thisQuestion[i] + "</button>";
                answerDivContents = answerDivContents + "<button  id='answer-word-" + i + "' onclick='wordSelect($(this))' class='test-tab--literacy-word test-tab--literacy-word-answer-hidden'></button><img class='test-tab--literacy-answer-mark' id='literacy-answer-mark-" + i + "' src=''>";
            }
        }

        //show the question
        $("#test-tab--literacy-test-question").html(questionDivContents);
        //show the blank answer array
        $("#test-tab--literacy-test-answer").html(answerDivContents);
        //re-enable the answer submit button (disabled after submitting answer to prevent
        //numerous submissions for one question on repeated clicking)
        $("#button-literacy-submit").removeAttr("disabled");
    }
}


//called on end of memory test or answering/skipping last numeracy/literacy question

function reportScore() {
    //get the start and end times for the tests and calculate time spent
    var end = new Date();
    var startTime = myVariable.Start.getTime();
    var endTime = end.getTime();
    var TotalTime = Math.ceil((endTime - startTime) / 1000);
    //generate result based on score on test and time taken
    var testResult = Math.ceil(myVariable.TotalScore / TotalTime * 100);
    $('#test-tab--' + myVariable.CurrentTest + '-test').fadeOut(250);
    setTimeout(function() { $('#test-tab--' + myVariable.CurrentTest + '-result').fadeIn(250); }, 250);
    $('#' + myVariable.CurrentTest + '-result').text(testResult.toString());

    //retrieve the local csv files of test results to render in chart
    queue()
        .defer(d3.csv, 'assets/data/' + myVariable.CurrentTest + 'scores.csv')
        .await(loadData);

    function loadData(error, scoreData) {
        ndx = crossfilter(scoreData);
        scoreData.forEach(function(d) {
            d.score = parseInt(d.score);
            d.students = parseFloat(d.students);
        });
        renderResults(ndx, testResult);

    }

}

//render a graph displaying the score achieved relative to population scores
function renderResults(resultData, testResult) {
    //create a dimension from cross filter for x axis based on score achieved
    var score_dim = resultData.dimension(dc.pluck('score'));
    //create a dimension from crossfilter for y axis based on percentage of student with the score
    var students_dim = score_dim.group().reduceSum(dc.pluck('students'));

    //set bottom and top ends of x axis
    var minScore = score_dim.bottom(1)[0].score;
    var maxScore = score_dim.top(1)[0].score;

    //if test result is more than max or less than minimum score on graph set it to the max or min
    if (testResult > maxScore) { testResult = maxScore; }
    if (testResult < minScore) { testResult = minScore; }
    var resultChart = dc.lineChart('#' + myVariable.CurrentTest + '-result-chart');

    var chartHeight = $(".test-tab--result-chart").height() - 25;
    var chartWidth = $(".test-tab--result-chart").width() - 25;

    resultChart
        .width(chartWidth)
        .height(chartHeight)
        .brushOn(false)
        .margins({ top: 15, right: 50, bottom: 30, left: 50 })
        .on('renderlet', function(resultChart) {
            //cycle through points on line graph and highlight in red the point on the graph matching
            //the user's score
            resultChart.selectAll('.dot')
                .attr('style', function(d) {
                    var scoreValue = d.data.key;
                    if (scoreValue == testResult) {
                        resultChart.xyTipsOn(false);
                        return "fill-opacity:1; fill: red";
                    }
                    else {
                        return "fill-opacity:0";
                    }
                })
               //ensure the dot is not removed on mouseover
                .on('mouseout.redhighlight', function(d) {
                    var scoreValue = d.data.key;
                    if (scoreValue == testResult) { $(this).attr('style', 'fill: red; fill-opacity:1'); }
                });
            resultChart.select('g')
                .append("line")
                .attr("style", "stroke:red")
                .attr("x1", function(d) {
                    console.log(d)
                    return chartWidth/3
                })
                .attr("x2", chartWidth/3) 
                .attr("y1", -chartHeight)
                .attr("y2", 0);
        })
        .dimension(score_dim)
        .group(students_dim)
        .transitionDuration(10)
        .x(d3.scale.linear().domain([minScore, maxScore]))
        .xAxisLabel("Score")
        .yAxis().ticks(4);

    dc.renderAll();
    var line = d3.svg.line().interpolate('linear');

    function draw_verticals(chart, points) {
        // merge
        var selection = chart.g()
            .select('g.chart-body')
            .selectAll('path.horizontal')
            .data(points)
        // append
        selection.enter()
            .append('path')
            .attr('class', 'horizontal reddot')
            .attr('d', function(d) {
                var x = chart.x()(d);
                return line([
                    [x, chart.y().range()[0]],
                    [x, chart.y().range()[1]]
                ]);
            });
        // remove
        selection.exit().remove();
    }

    draw_verticals(resultChart, [10, 30]);
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
