//functions specific to memory test

//Clicking on 'game' icon in memory test
$(".test-tab--memory-icon").on("click", function() {
    //check if the icon is already showing, has been paired or if the board is locked (because 2 icons have been clicked and are being checked)
    //otherwise turn the icon over
    console.log(myVariable.BoardLocked);
    if ($(this).data("showing") == false && myVariable.BoardLocked==false && $(this).data("paired")==false) {
        turnUp($(this));
    }
});


//Start the memory test
function startMemoryTest() {
    //set global to show current test is memory (for reporting the reporting score chart)
    myVariable.CurrentTest="memory";
    //lock the board
    myVariable.BoardLocked=true;
    //zero the score and start a new timer using Date() function
    myVariable.TotalScore=0;
    myVariable.Start = new Date();    
    var card = $(".test-tab--memory-icon");
    //shuffle up the position array
    var memoryArray = new Array(1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8);
    memoryArray = shuffleArray(memoryArray);
    //for each icon object set its position, its picture, paired and showing statuses
    //this shows the whole board for 5 seconds for the user to try to memorise it
    for (i = 0; i <= 15; i++) {
        $(card[i]).data("position", i);
        $(card[i]).data("showing", true);
        $(card[i]).data("picture", memoryArray[i]);
        $(card[i]).attr('src', 'assets/images/memory-' + memoryArray[i] + '.png');
        $(card[i]).data("paired", false);
    }
    
    //after 5 seconds hide and unlock the board to be clicked 
    setTimeout(function() { hideBoard(); }, 5000);
}

//Displays the icon and checks if matched to first icon clicked
function turnUp(card) {
    var picture = $(card).data("picture");
    var unlockBoardTime=500;
    $(card).attr("src", "assets/images/memory-" + picture + ".png");
    $(card).data("showing", true);
    
    //if there are no icons showing, display icon and record its position
    //set global to record there is one icon showing and the position of that icon
    if (myVariable.CardShowing == false) {
        myVariable.FirstCardShown = $(card).data("position");
        myVariable.CardShowing = true;
    }
    //if this is the second icon clicked show it and lock the board the check to see if matched
    //to first icon
    else {
        myVariable.BoardLocked=true;        
        cards = $(".test-tab--memory-icon");
        var matchCardOne = cards[myVariable.FirstCardShown];
        //if matched leave the icons showing and mark as paired to prevent being clicked again
        //add one to score
        if (picture == $(matchCardOne).data("picture")) {
            $(matchCardOne).data("paired", true);
            $(card).data("paired", true);
            myVariable.TotalScore++;
        }
        //if not matched hide both icons and unlock the board
        else {
            setTimeout(function() { hideCard(card, matchCardOne); }, unlockBoardTime);
        }
        //set global to confirm no icons showing
        myVariable.CardShowing = false;
    }
    //check if all icons have been revealed, if so show the score.
    if(myVariable.TotalScore==8) {
         myVariable.DisplayResult=setTimeout( function() { reportScore("Memory"); },1000);   
    }
    //otherwise unlock the board
    else {
        setTimeout( function() { myVariable.BoardLocked=false; }, unlockBoardTime);
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
    myVariable.BoardLocked=false;
}
