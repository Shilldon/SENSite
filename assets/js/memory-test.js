//functions specific to memory test

//Clicking on 'game' icon in memory test
$(".test-tab--memory-icon").on("click", function() {
    //check if the icon is already showing, has been paired or if the board is locked (because 2 icons have been clicked and are being checked)
    //otherwise turn the icon over
    if ($(this).data("showing") == false && BoardLocked==false && $(this).data("paired")==false) {
        turnUp($(this));
    }
})


//Start the memory test
function startMemoryTest() {
    //set global to show current test is memory (for reporting the reporting score chart)
    CurrentTest="memory";
    //lock the board
    BoardLocked=true;
    //zero the score and start a new timer using Date() function
    TotalScore=0;
    Start = new Date();    
    var card = $(".test-tab--memory-icon");
    //shuffle up the position array
    MemoryArray = shuffleArray(MemoryArray);
    //for each icon object set its position, its picture, paired and showing statuses
    //this shows the whole board for 5 seconds for the user to try to memorise it
    for (i = 0; i <= 15; i++) {
        $(card[i]).data("position", i);
        $(card[i]).data("showing", true);
        $(card[i]).data("picture", MemoryArray[i]);
        $(card[i]).attr('src', 'assets/images/memory-' + MemoryArray[i] + '.png');
        $(card[i]).data("paired", false);
    }
    
    //after 5 seconds hide and unlock the board to be clicked 
    setTimeout(function() { hideBoard() }, 5000);
}

//Displays the icon and checks if matched to first icon clicked
function turnUp(card) {
    var picture = $(card).data("picture");
    var unlockBoardTime=500;
    $(card).attr("src", "assets/images/memory-" + picture + ".png");
    $(card).data("showing", true);
    
    //if there are no icons showing, display icon and record its position
    //set global to record there is one icon showing
    if (CardShowing == false) {
        FirstCardShown = $(card).data("position");
        CardShowing = true;
    }
    //if this is the second icon clicked show it and lock the board the check to see if matched
    //to first icon
    else {
        BoardLocked=true;        
        cards = $(".test-tab--memory-icon");
        matchCardOne = cards[FirstCardShown];
        //if matched leave the icons showing and mark as paired to prevent being clicked again
        //add one to score
        if (picture == $(matchCardOne).data("picture")) {
            $(matchCardOne).data("paired", true);
            $(card).data("paired", true);
            TotalScore++;
        }
        //if not matched hide both icons and unlock the board
        else {
            setTimeout(function() { hideCard(card, matchCardOne) }, unlockBoardTime);
        }
        //set global to confirm no icons showing
        CardShowing = false;
    }
    //check if all icons have been revealed, if so show the score.
    if(TotalScore==8) {
         DisplayResult=setTimeout( function() { reportScore("Memory") },1000);   
    }
    //otherwise unlock the board
    else {
        setTimeout( function() { BoardLocked=false }, unlockBoardTime);
    }
}

//function to hide the icons showing on failure to match
function hideCard(firstCard, secondCard) {
    $(secondCard).data("showing", false);
    $(secondCard).attr("src", "assets/images/memory-0.png");
    //$(firstCard)
    $(firstCard)
    .data("showing", false)
    .attr("src", "assets/images/memory-0.png");
}

//Hides all icons on the board and unlocks the board for clicking ready to start 'game'
function hideBoard() {
    var card = $(".test-tab--memory-icon");
    for (i = 0; i <= 15; i++) {
        $(card[i]).data("showing", false);
        $(card[i]).attr('src', 'assets/images/memory-0.png');
    }
    BoardLocked=false;
}
