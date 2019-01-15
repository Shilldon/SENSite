describe("check answer", function() {
    it("should return correct", function() {
        expect(checkAnswer(10)).toBe("correct");
    });
    it("it should return error box with request for an answer", function() {
        spyOn(window, "alert");
        checkAnswer("");
        expect(window.alert).toHaveBeenCalledWith("Enter an answer!");
    });
    it("it should return error box with request for number answer", function() {
        spyOn(window, "alert");
        checkAnswer("ten");
        expect(window.alert).toHaveBeenCalledWith("Enter a number as your answer!");
    });
})