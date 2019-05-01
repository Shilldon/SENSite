describe("Test Calculator addtion and subtraction functions", function() {
    beforeEach(function() {
        calc = new Calculator(0);
    });


    describe("Test addition function",
        function() {
            it("should return 2", function() {
                calc.add(2);
                expect(calc.value).toBe(2);
            })
            it("should return 0", function() {
                calc.add(-1);
                expect(calc.value).toBe(-1);
            })
            it("should return 4", function() {
                calc.add(2);
                calc.add(2)
                expect(calc.value).toBe(4);
            })
        })

    describe("Test subtraction function",
        function() {
            it("should return -2", function() {
                calc.subtract(2);
                expect(calc.value).toBe(-2);
            })
            it("should return -8", function() {
                calc.subtract(2);
                calc.subtract(6);
                expect(calc.value).toBe(-8);
            })
            it("should return 2", function() {
                calc.subtract(-2);
                expect(calc.value).toBe(2);
            })
        })

    describe("Test addition before subtraction",
        function() {
            it("should return 5", function() {
                calc.add(7)
                calc.subtract(2);
                expect(calc.value).toBe(5);
            })
            it("should return -5", function() {
                calc.add(2)
                calc.subtract(7);
                expect(calc.value).toBe(-5);
            })
            it("should return 0", function() {
                calc.add(5)
                calc.subtract(5);
                expect(calc.value).toBe(0);
            })
        })
    describe("Test subtraction before addition",
        function() {
            it("should return 5", function() {
                calc.subtract(2);
                calc.add(7)
                expect(calc.value).toBe(5);
            })
            it("should return -5", function() {
                calc.subtract(7);
                calc.add(2)
                expect(calc.value).toBe(-5);
            })
            it("should return 0", function() {
                calc.subtract(5);
                calc.add(5)
                expect(calc.value).toBe(0);
            })
        })
});

describe("Test Calculator multiplication function", function() {
    beforeEach(function() {
        calc = new Calculator(5);
    });
    describe("Test multiplication function",
        function() {
            it("should return 50", function() {
                calc.multiply(10);
                expect(calc.value).toBe(50);
            })
            it("should return 500", function() {
                calc.multiply(10);
                calc.multiply(10);
                expect(calc.value).toBe(500);
            })
            it("should return -75", function() {
                calc.multiply(5);
                calc.multiply(-3);
                expect(calc.value).toBe(-75);
            })
        })
});


describe("Test error modal",
    function() {
        it("Should change text in error message modal",
            function() {
                var answer = "A";
                checkAnswer(answer);
                var message = $("#error-message").text();
                expect(message).toBe('Please enter digits only.');
            })
        it("Should change text in error message modal",
            function() {
                var answer = "";
                checkAnswer(answer);
                var message = $("#error-message").text();
                expect(message).toBe('Please enter digits only.');
            })
    });
