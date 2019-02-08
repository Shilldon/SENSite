var query;

function newQuestion() {
    query = new question;
    Object.defineProperty(query, 'answer', {
        value: calculateAnswer(),
        writeable: true
    });
    //$("#answer").text(query.answer);
}

Calculator = function(numberThree) {
    this.value = numberThree;
    return this.value;
}

Calculator.prototype.add = function(number) {
    console.log("current value in add " + this.value)
        this.value += number;
        console.log("adding =" + number)
        console.log("new value in add " + this.value)

}

Calculator.prototype.subtract = function(number,reverse) {
        if(reverse==true) {
        this.value = number - this.value;
            
        }
        else
        {
            this.value=this.value-number;
        }

}

Calculator.prototype.multiply = function(number) {
            this.value *= number;
}

function question(questionNumber, firstNumber, secondNumber, thirdNumber, firstOperator, secondOperator, answer) {
    this.questionNumber = 0,
        this.firstNumber = generateNumber(),
        this.secondNumber = generateNumber(),
        this.thirdNumber = generateNumber(),
        this.firstOperator = generateOperator(),
        this.secondOperator = generateOperator(),
        this.answer = 0
}

function calculateAnswer() {
    var initialCalculatorInput = query.firstNumber;
    var firstCalculatorInput = query.secondNumber;
    var secondCalculatorInput = query.thirdNumber;
    var firstOperator = query.firstOperator;
    var secondOperator = query.secondOperator;
    var subtractReverse=false;
    if (secondOperator == "x") {
        initialCalculatorInput = query.thirdNumber;
        firstCalculatorInput = query.secondNumber;
        secondCalculatorInput = query.firstNumber;
        firstOperator = query.secondOperator;
        secondOperator = query.firstOperator;
        subtractReverse=true;
    }
    calculator = new Calculator(initialCalculatorInput);
    
    var number=firstCalculatorInput;
    
    var operator = firstOperator;

    for (j = 0; j < 2; j++) {
        console.log("for number ="+number);
        console.log("for operator="+operator);
        switch (operator) {
            case "x":
                calculator.multiply(number);
                break;
            case "+":
                calculator.add(number);
                break;
            case "-":
                calculator.subtract(number,subtractReverse);
                break
        }
        operator=secondOperator;
        number=secondCalculatorInput;
    }
    return calculator.value;
}

function generateOperator() {
    switch (Math.ceil(Math.random() * Math.floor(3))) {
        case 1:
            return "+";
            break;
        case 2:
            return "-";
            break;
        case 3:
            return "x";
            break;
    }
}

function generateNumber() {
    return Math.ceil(Math.random() * Math.floor(10));
}
