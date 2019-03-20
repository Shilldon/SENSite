$(".test-tab--memory-icon").on("click", function() {
    console.log("clicked");
    turnUp($(this));
})

function turnUp(card) {
    console.log("clicked");
    $(card).attr("src","assets/images/memory-0.png");
}