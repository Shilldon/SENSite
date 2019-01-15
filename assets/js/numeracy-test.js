$(document).ready(function(){
    $('#numeracy-answer').keypress(function(e){
      if(e.keyCode==13)
      $('#button-numeracy-submit').click();
    });
});

function nextQuestion() {
    QuestionNumber++;
     $("#numeracy-answer").val('');
     $("#question-header").text("Question "+(QuestionNumber+1).toString());
     $("#numeracy-question").text(Question[QuestionNumber]);
     $("#answer-mark").fadeOut('slow');
}

$("#button-numeracy-submit").on("click", function() {
    answer=+$("#numeracy-answer").val();
    
    console.log("answer="+answer);
    console.log("question number="+QuestionNumber);
    console.log("question answer="+Answer[QuestionNumber]);
    if(isNaN(answer)){
        alert("Enter a number as your answer!")        
    }
    else if(answer==Answer[QuestionNumber]) {
        $("#answer-mark").css('display','block');
        $("#answer-mark").attr('src','assets/images/tick.png');
        if(QuestionNumber<9) {
            setTimeout( function() { nextQuestion() }, 2500);
        }
    }
    else {
        alert("wrong");
    }
})
