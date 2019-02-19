var AnswerArray = [];
var QuestionArray = [];

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function defineQuestion(AnswerArray) {
    var questionDivContents = "";
    var answerDivContents = "";
    QuestionArray = shuffle(AnswerArray);
    for (i = 0; i < QuestionArray.length; i++) {
        questionDivContents = questionDivContents + "<div class='col-xs-3 test-tab--literacy-words'><button id='question-word-" + i + "' onclick='wordSelect($(this))' class='test-tab--literacy-word-button'>" + QuestionArray[i] + "</button> </div>";
        answerDivContents = answerDivContents + "<div class='col-xs-3 test-tab--literacy-words-answer'><button  id='answer-word-" + i + "' onclick='wordSelect($(this))' class='test-tab--literacy-word-button-answer'>?</button></div>";
    }
    $("#test-tab--literacy-test-question").html(questionDivContents)
    $("#test-tab--literacy-test-answer").html(answerDivContents)
}

function startLiteracyTest() {
    AnswerArray = ["the", "cat", "sat", "on", "the", "mat"];
    defineQuestion(AnswerArray);
}

function wordSelect(wordClicked) {

    var buttonType = $(wordClicked).attr("id").split("-");
    var wordValue = $(wordClicked).text();
    if (buttonType[0] == "question") {
        /*
        if (wordClicked.text() != "-") {
            var answerCount = 0;
            var answerButton;
            var whileBreak = false;
            while (whileBreak == false) {
                answerButton = $("#answer-word-" + answerCount);
                var checkWord = answerButton.text();
                if (checkWord == "?" || answerButton.attr("id") == null) {
                    whileBreak = true;
                    answerButton.text(wordValue);
                }
                answerCount++;
            }
            var answerNumber = buttonType[2];
            for (i = parseInt(answerNumber); i < AnswerArray.length - 1; i++) {
                var j = i + 1;
                nextWord = $("#question-word-" + j).text();
                console.log(nextWord)
                $("#question-word-" + i).text(nextWord);

            }
            $("#question-word-" + (AnswerArray.length - 1)).text("-");
        }*/
        var answerCount = 0;
        var answerButton;
        var whileBreak = false;
        while (whileBreak == false) {
            answerButton = $("#answer-word-" + answerCount);

            if (answerButton.css("display") == "none") {
                console.log(answerButton)
                whileBreak = true;
                answerButton.css('display', 'block');
                answerButton.text(wordValue);
            }
            if (answerButton.attr("id") == null) {
                whileBreak = true;
            }
            answerCount++;
        }
        wordClicked.css('display', 'none');

    }
    else if (buttonType[0] == "answer") {

        var questionButton;
        var questionCount = 0;
        var whileBreak = false;
        wordClicked.css('display', 'none');
        while (whileBreak == false) {
            questionButton = $("#question-word-" + questionCount);
            var wordValue=wordClicked.text();
            console.log(questionButton.attr("id")+" is ");
            if(questionButton.is(":visible")) { console.log(" visible"); }
            if(questionButton.is(":hidden")) { console.log(" hidden"); }
            if (questionButton.is(":hidden")) {
                whileBreak = true;
                questionButton.css('display', 'block');
                questionButton.text(wordValue);
            }
            if (questionButton.attr("id") == null) {
                whileBreak = true;
            }
            questionCount++;
        }
    }
}

//submit answer
