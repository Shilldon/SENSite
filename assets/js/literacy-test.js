var AnswerArray = [];
var QuestionArray = [];
var ParentQuestionsArray = [];
var TotalScore = 0;
var QuestionNumber=0;
var Start = new Date();

function cleanArray(wordsArray) {
    var cleanedArray = $.grep(wordsArray, function(n) {
        return (n);
    });
    console.log(cleanedArray)
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

function nextQuestion(wordsArray) {
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
    QuestionNumber++;
    $("#literacy-question-header").text("Question " + (QuestionNumber).toString());    

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
    Start = new Date();
    //retrieve the csv file of sentences and createa an array of possible questions
    getQuestions();
}

function selectRandomQuestions() {
    for (i = 0; i <= 9; i++) {
        var randomQuestionIndex = i * 5 + Math.ceil(Math.random() * Math.floor(4));
        console.log("random:" + randomQuestionIndex)
        Question[i] = ParentQuestionsArray[randomQuestionIndex];
        console.log(Question[i])
    }
    //put text of question on screen
    nextQuestion(Question[QuestionNumber]);
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
    if (wrong == false) {
        TotalScore++;
    }
    if(QuestionNumber<10) {
    setTimeout( function() { nextQuestion(Question[QuestionNumber]) }, 2500);
    }
    else {
        reportScore();
    }
}

$("#button-literacy-submit").on("click", function() {
    
    var count = 0;
    var answerWord;
    var submittedAnswer = [];
    var whileBreak = false;
    var incompleteSentence=false;
    while (whileBreak == false) {
        answerWord = $("#answer-word-" + count);
        //reached end of sentence
        if (answerWord.attr("id") == null) {
            whileBreak = true;
        }
        //incomplete sentence (word not submitted) break out and display error
        else if (answerWord.hasClass("test-tab--literacy-word-answer-hidden")) {
            whileBreak = true;
            incompleteSentence=true;
            alert("You need to complete the sentence");
        }
        else {
            submittedAnswer[count] = answerWord.text();
        }
        count++;
    }
    if (incompleteSentence == false && $(this).attr("disabled")!="disabled"  ) {
        $(this).attr("disabled", true);  
        checkLiteracyAnswer(submittedAnswer);
    }
})

function reportScore() {
    QuestionNumber = 0;
    var end = new Date();
    var startTime = Start.getTime();
    var endTime = end.getTime();
    var TotalTime = Math.ceil((endTime - startTime) / 1000);
    var result = Math.ceil(TotalScore / TotalTime * 100);
    $("#test-tab--literacy-test").fadeOut(250);
    setTimeout(function() { $("#test-tab--literacy-result").fadeIn(250); }, 250);
    $("#literacy-result").text(result.toString());
}

$("#button-literacy-skip").on("click", function() {
    skipQuestion();
})
