$(document).ready(function() {
    $('#literacy-answer').keypress(function(e) {
        if (e.keyCode == 13)
            $('#button-numeracy-submit').click();
    });
});

 var AnswerArray=[];
 var QuestionArray=[];

function defineQuestion(AnswerArray) {
    console.log("definingquestion");
    var questionDivContents;
    for(i=0;i<AnswerArray.length;i++) {
        questionDivContents=questionDivContents+"<div class='col-xs-2'>"+AnswerArray[i]+" </div>";    
    }
    $("#test-tab--literacy-test-question").html(questionDivContents)
}

function startLiteracyTest() {
    console.log("starting literacy test")
    AnswerArray=["the","cat","sat","on","the","mat"];
    defineQuestion(AnswerArray);
}