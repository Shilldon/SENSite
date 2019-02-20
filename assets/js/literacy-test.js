var AnswerArray = [];
var QuestionArray = [];

function shuffle() {
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

function defineQuestion(AnswerArray) {
    var questionDivContents = "";
    var answerDivContents = "";
    QuestionArray = AnswerArray.slice(0);
    QuestionArray = shuffle();
    for (i = 0; i < QuestionArray.length; i++) {
        questionDivContents = questionDivContents + "<button id='question-word-" + i + "' onclick='wordSelect($(this))' class='test-tab--literacy-word test-tab--literacy-word-question-shown'>" + QuestionArray[i] + "</button>";
        answerDivContents = answerDivContents + "<button  id='answer-word-" + i + "' onclick='wordSelect($(this))' class='test-tab--literacy-word test-tab--literacy-word-answer-hidden'></button><img style='width:7.5%' id='literacy-answer-mark-" + i + "' src=''>";
    }
    $("#test-tab--literacy-test-question").html(questionDivContents)
    $("#test-tab--literacy-test-answer").html(answerDivContents)

}

function startLiteracyTest() {
    AnswerArray = ["the", "cat", "sat", "on", "the", "mat", "and", "the", "dog", "ate", "the", "big", "bone"];
    defineQuestion(AnswerArray);
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
        hideWord.toggleClass("test-tab--literacy-word-" + hideWordType + "-hidden test-tab--literacy-word-" + hideWordType + "-shown")

        while (whileBreak == false) {
            showWord = $("#" + showWordType + "-word-" + count);
            hiddenClass = "test-tab--literacy-word-" + showWordType + "-hidden";
            if (showWord.hasClass(hiddenClass)) {
                whileBreak = true;
                showWord.toggleClass("test-tab--literacy-word-" + showWordType + "-hidden test-tab--literacy-word-" + showWordType + "-shown")
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

$("#button-literacy-submit").on("click", function() {
    console.log("clicked")
    var count = 0;
    var answerWord;
    var submittedAnswer = [];
    var whileBreak = false;
    while (whileBreak == false) {
        answerWord = $("#answer-word-" + count);
        if (answerWord.attr("id") == null) {
            whileBreak = true;
        }
        else if (answerWord.hasClass("test-tab--literacy-word-answer-hidden")) {
            whileBreak = true;
            alert("You need to complete the sentence");
        }
        else {
            submittedAnswer[count] = answerWord.text();
        }
        count++;
    }
    checkLiteracyAnswer(submittedAnswer);
})

function checkLiteracyAnswer(submittedAnswer) {
    for (i = 0; i < AnswerArray.length; i++) { console.log(AnswerArray[i]); }
    for (i = 0; i < submittedAnswer.length; i++) { console.log(submittedAnswer[i]); }
    for (i = 0; i < submittedAnswer.length; i++) {
        imagename = "#literacy-answer-mark-" + i;
        image = $(imagename);
        if (submittedAnswer[i] != AnswerArray[i]) {
            image.attr('src', 'assets/images/cross.png');
        }
        else {
            image.attr('src', 'assets/images/tick.png');
        }
    }
}

$("#button-numeracy-skip").on("click", function() {
    skipQuestion();
})


//submit answer
