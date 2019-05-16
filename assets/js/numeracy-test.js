
//fired from button click start test
function startNumeracyTest() {
    //start new timer using Date() function
    myVariable.Start = new Date();
    //initilise questionnumber and totalscore
    myVariable.QuestionNumber = 0;
    myVariable.TotalScore = 0;
    //set up global for correct result reporting
    myVariable.CurrentTest = "numeracy";
    //create array of questions and answers using query objects
    for (i = 1; i <= 10; i++) {
        newQuestion();
        myVariable.NumeracyAnswerArray[i] = query.answer;
        myVariable.QuestionArray[i] = query.firstNumber + " " + query.firstOperator + " " + query.secondNumber + " " + query.secondOperator + " " + query.thirdNumber + " = ";
    }
    nextQuestion("numeracy");
}

//clear the test
function clearTest() {
    //empty arrays and reinitialise score and question number, clear answers and questions from screen
    myVariable.NumeracyAnswerArray = [];
    myVariable.QuestionArray = [];
    myVariable.QuestionNumber = 0;
    myVariable.TotalScore = 0;
    $("#numeracy-answer").val('');
    $("#numeracy-answer").focus();
    $("#numeracy-answer-mark").css('display', 'none');
}

//check answer submitted
function checkAnswer(answer) {
    //error checking - if nothing or not a number, display error modal
    if (isNaN(answer) || answer == "") {
        if(answer=="") {
            $('#error-message').text('Please enter your answer.');           
        }
        else {
            $('#error-message').text('Please enter digits only.');           
        }
        $("#errorModal").modal({
            show: 'true',
            backdrop: 'static',
            keyboard: 'false'
        });
        //fade out error modal
        setTimeout(function() {
            $("#errorModal").modal('hide');
            $("#button-numeracy-submit").removeAttr("disabled");
            $("#numeracy-answer").focus();

        }, 2000);
    }
    //if the answer is right mark as correct and either proceed to the next question
    //or end the test if up to question 10
    else if (answer == myVariable.NumeracyAnswerArray[myVariable.QuestionNumber]) {
        $("#numeracy-answer-mark").css('display', 'block');
        $("#numeracy-answer-mark").attr('src', 'assets/images/tick.png');
        myVariable.TotalScore++;
        if (myVariable.QuestionNumber < 10) {
            setTimeout(function() { nextQuestion("numeracy"); }, 1500);
        }
        else {
           myVariable.DisplayResult = setTimeout(function() { reportScore("numeracy"); }, 1500);
        }
    }
    //if answer is wrong display cross and if up to question 10 end test and display result or go to next question
    else {
        $("#numeracy-answer-mark").css('display', 'block');
        $("#numeracy-answer-mark").attr('src', 'assets/images/cross.png');
        if (myVariable.QuestionNumber < 10) {
            setTimeout(function() { nextQuestion("numeracy"); }, 1500);
        }
        else {
            myVariable.DisplayResult = setTimeout(function() { reportScore("numeracy"); }, 1500);
        }
    }
}

var query;
//create new question object from random operators and numbers generated
//use to define answer property through calculateAnswer function 
function newQuestion() {
    query = new question();
    Object.defineProperty(query, 'answer', {
        value: calculateAnswer(),
        writeable: true
    });
}

//initialise question object with random numbers and operators
function question(firstNumber, secondNumber, thirdNumber, firstOperator, secondOperator, answer) {
    this.firstNumber = generateNumber(),
        this.secondNumber = generateNumber(),
        this.thirdNumber = generateNumber(),
        this.firstOperator = generateOperator(),
        this.secondOperator = generateOperator(),
        this.answer = 0;
}

//generate random operators for question objects
function generateOperator() {
    var operatorValue;  
    switch (Math.ceil(Math.random() * Math.floor(3))) {
        case 1:
            operatorValue="+";
            break;
        case 2:
            operatorValue="-";
            break;
        case 3:
            operatorValue="x";
            break;
    }
  	return operatorValue;
}

//generate random numbers for question objects
function generateNumber() {
    return Math.ceil(Math.random() * Math.floor(10));
}

