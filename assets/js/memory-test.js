$(".test-tab--memory-icon").on("click", function() {
    if ($(this).data("showing") == false && BoardLocked==false) {
        turnUp($(this));
    }
})

var MemoryArray = new Array(1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8);
var CardShowing = false
var FirstCardShown = 0;
var TotalScore = 0;
var Start = new Date();
var BoardLocked=false;

function turnUp(card) {
    var picture = $(card).data("picture");
    $(card).attr("src", "assets/images/memory-" + picture + ".png");
    $(card).data("showing", true);
    if (CardShowing == false) {
        FirstCardShown = $(card).data("position");
        CardShowing = true;
    }
    else {
        BoardLocked=true;        
        cards = $(".test-tab--memory-icon");
        matchCardOne = cards[FirstCardShown];
        if (picture == $(matchCardOne).data("picture")) {
            $(matchCardOne).data("paired", true);
            $(card).data("paired", true);
            TotalScore++;
        }
        else {
            setTimeout(function() { hideCard(card, matchCardOne) }, 750);
        }
        CardShowing = false;
    }
    if(TotalScore==8) {
         DisplayResult=setTimeout( function() { reportMemoryScore() },1000);   
    }
    setTimeout( function() { BoardLocked=false }, 750);
}

function hideCard(firstCard, secondCard) {
    $(secondCard).data("showing", false);
    $(secondCard).attr("src", "assets/images/memory-0.png");
    console.log("first card=" + firstCard)
    $(firstCard).data("showing", false);
    $(firstCard).attr("src", "assets/images/memory-0.png");
}

function shuffleMemoryArray(arr) {
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

function startMemoryTest() {
    TotalScore=0;
    Start = new Date();    
    var card = $(".test-tab--memory-icon");
    MemoryArray = shuffleMemoryArray(MemoryArray);
    for (i = 0; i <= 15; i++) {
        $(card[i]).data("position", i);
        $(card[i]).data("showing", true);
        $(card[i]).data("picture", MemoryArray[i]);
        $(card[i]).attr('src', 'assets/images/memory-' + MemoryArray[i] + '.png');
        $(card[i]).data("paired", false);
    }
    setTimeout(function() { hideBoard() }, 5000);
    //console.log("card showing?="+$(card[1]).attr("showing"));
}

function hideBoard() {
    var card = $(".test-tab--memory-icon");

    for (i = 0; i <= 15; i++) {
        $(card[i]).data("showing", false);
        $(card[i]).attr('src', 'assets/images/memory-0.png');
    }
}

function reportMemoryScore() {
 //   QuestionNumber = 0;
    var end = new Date();
    var startTime = Start.getTime();
    var endTime = end.getTime();
    var TotalTime = Math.ceil((endTime - startTime) / 1000);
    var result = Math.ceil(TotalScore / TotalTime * 100);
    $("#test-tab--memory-test").fadeOut(250);
    setTimeout(function() { $("#test-tab--memory-result").fadeIn(250); }, 250);
    $("#memory-result").text(result.toString());
}
