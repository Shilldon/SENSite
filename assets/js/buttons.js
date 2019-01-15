var Answer=[];
var Question=[];
var QuestionNumber=0;

function generateNumber()
{
    return Math.ceil(Math.random() * Math.floor(10));    
}

function startNumeracyTest() {
    var firstNumber;
    var secondNumber;
    var thirdNumber="";
    var firstOperator;
    var secondOperator="";
    
    for (i=0;i<=9;i++) {
        firstNumber= generateNumber();
        secondNumber= generateNumber();
        thirdNumber="";
        secondOperator="";
        switch (i) {
            case 0 : firstOperator='+'; Answer[i]=firstNumber+secondNumber; break;
            case 1 : firstOperator='+'; Answer[i]=firstNumber+secondNumber;break;
            case 2 : firstOperator='-'; Answer[i]=firstNumber-secondNumber;break;
            case 3 : firstOperator='-'; Answer[i]=firstNumber-secondNumber;break;
            case 4 : firstOperator='+'; secondOperator='+'; thirdNumber=generateNumber(); Answer[i]=firstNumber+secondNumber+thirdNumber; break;
            case 5 : firstOperator='+'; secondOperator='-'; thirdNumber=generateNumber(); Answer[i]=firstNumber+secondNumber-thirdNumber; break;
            case 6 : firstOperator='-'; secondOperator='+'; thirdNumber=generateNumber(); Answer[i]=firstNumber-secondNumber+thirdNumber; break;
            case 7 : firstOperator='-'; secondOperator='-'; thirdNumber=generateNumber(); Answer[i]=firstNumber-secondNumber-thirdNumber; break;
            case 8 : firstOperator='x'; Answer[i]=firstNumber*secondNumber;break;
            case 9 : firstoperator='x'; Answer[i]=firstNumber*secondNumber;break;
        }
        Question[i]=firstNumber+" "+firstOperator+" "+secondNumber+" "+secondOperator+" "+thirdNumber+" = ";
    }
}

$(".test-tab--test-button").on("click", function() {
    var buttonId = $(this).attr("id").split("-");
    var action = buttonId[2];
    var testId = buttonId[1];
    switch (action) {
        case 'select':
            $("#test-tab--landing").fadeOut(250);
            setTimeout(function() { $("#test-tab--" + testId).fadeIn(250); }, 250);
            break;
        case 'start':
            $("#test-tab--" + testId).fadeOut(250);
            setTimeout(function() { $("#test-tab--" + testId + "-1").fadeIn(250); }, 250);
            startNumeracyTest();
            $("#question-header").text("Question "+(QuestionNumber+1).toString());
            $("#numeracy-question").text(Question[0]);
            break;
        case 'back':
             $(this).closest('section').fadeOut(250);
            setTimeout(function() { $("#test-tab--landing").fadeIn(250); }, 250);
            break;
        case 'skip':
            var name=$(this).attr('id');
            QuestionNumber++;
            $("#numeracy-question").text(Question[QuestionNumber]);
            break;
    }       
})
