

//called on clicking start literacy test
function startLiteracyTest() {
    //set global for CurrentTest to return correct chart result
    myVariable.CurrentTest = "literacy";
    //start a new timer using date() function
    myVariable.Start = new Date();
    myVariable.TotalScore = 0;
    myVariable.QuestionNumber = 0;
    //retrieve the csv file of sentences and createa an array of possible questions
    getQuestions();
}


//remove blank spaces from array
function cleanArray(wordsArray) {
    var cleanedArray = $.grep(wordsArray, function(n) {
        return (n);
    });
    return cleanedArray;
}

//retrieve sentences from local csv file
function getQuestions() {
    $.ajax({
        type: "GET",
        url: "assets/data/literacyquestions.csv",
        dataType: "text",
        success: function(data) {
            //create master array of sentences from csv
            createQuestionsArray(data);
        }
    });
}

//breakdown master questions array into sentences 
function createQuestionsArray(questions) {
    var allTextLines = questions.split(/\r\n|\n/);
    var parentQuestionsArray=[];
    var headers = allTextLines[0].split(',');
    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            var questionLine = [];
            for (j = 0; j < headers.length; j++) {
                questionLine.push(data[j]);
            }
            parentQuestionsArray.push(questionLine);
        }
    }
    //select random lines from the questions array
    selectRandomQuestions(parentQuestionsArray);
}

function selectRandomQuestions(parentQuestionsArray) {
    //select 10 random questions from each 5 lines of the parent array
    for (i = 0; i <= 9; i++) {
        var randomQuestionIndex = i * 5 + Math.ceil(Math.random() * Math.floor(4));
        myVariable.QuestionArray[i + 1] = parentQuestionsArray[randomQuestionIndex];
    }
    //put text of question on screen
    nextQuestion("literacy");
}

//fired when a word is clicked on
function wordSelect(wordClicked) {
    //return button id to determine if word is part of question or part of answer
    var buttonType = $(wordClicked).attr("id").split("-");
    var wordValue = $(wordClicked).text();
    var button = buttonType[0];
    //call revealWord function with 'button' - type of word (Answer or Question)
    //'wordClicked' - position in array
    //and WordValue - actual text of word on screen
    revealWord(button, wordClicked, wordValue);
}


function revealWord(hideWordType, hideWord, wordValue) {
    var count = 0;
    var whileBreak = false;
    var showWordType;
    //if a question word was clicked on the word to be shown must be in the answer array
    //amd vice versa
    if (hideWordType == "question") {
        showWordType = "answer";
    }
    else {
        showWordType = "question";
    }
    //set up class variable to apply to word to be shown
    var shownClass = "test-tab--literacy-word-" + hideWordType + "-shown";
    if (hideWord.hasClass(shownClass)) {
        //if the word to be hidden currently has the shown class toggle the class off and change the text to blank
        hideWord.text("");
        hideWord.toggleClass("test-tab--literacy-word-" + hideWordType + "-hidden test-tab--literacy-word-" + hideWordType + "-shown");
        //cycle through the question or answer array to show the appropriate word.
        //cycle through until reaching a button with null attribute (end of word list)
        //find first button with hidden class and toggle to shown class and change text to the wordValue
        while (whileBreak == false) {
            var showWord = $("#" + showWordType + "-word-" + count);
            var hiddenClass = "test-tab--literacy-word-" + showWordType + "-hidden";
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

//fured after clicking submit.
function checkLiteracyAnswer(submittedAnswer) {
    //check array created fromwords submitted against the parent answer array.
    //mark each word correct or incorrect
    var wrong = false;

    for (i = 0; i < submittedAnswer.length; i++) {
        var imagename = "#literacy-answer-mark-" + i;
        var image = $(imagename);
        if (submittedAnswer[i] != myVariable.LiteracyAnswerArray[i]) {
            image.attr('src', 'assets/images/cross.png');
            wrong = true;
        }
        else {
            image.attr('src', 'assets/images/tick.png');
        }
    }
    wrong = false;
    if (wrong == false) {
        //if no words incorrect increase the score by 1
        myVariable.TotalScore++;
    }
    if (myVariable.QuestionNumber < 10) {
        //if less than 10 questions answered move to next question
        setTimeout(function() { nextQuestion("literacy"); }, 2500);
    }
    else {
        //otherwise display the result
        myVariable.DisplayResult = setTimeout(function() { reportScore("literacy"); }, 1500);
    }
}


/* for testing - print out crossfilter data
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
*/
