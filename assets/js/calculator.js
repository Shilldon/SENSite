
//function used by the numeracy test to generate answers
//Each question comprises three numbers and two operators, generated randomly.
//Prototypes are created for the operators (+, - and *)
//For simplicity division has not been implemented.

var Calculator = function(numberThree) {
    this.value = numberThree;
    return this.value;
};

Calculator.prototype.add = function(number) {
    this.value += number;
};

Calculator.prototype.subtract = function(number, reverse) {
    if (reverse == true) {
        this.value = number - this.value;
    }
    else {
        this.value = this.value - number;
    }
};

Calculator.prototype.multiply = function(number) {
    this.value *= number;
};

function calculateAnswer() {
    var initialCalculatorInput = query.firstNumber;
    var firstCalculatorInput = query.secondNumber;
    var secondCalculatorInput = query.thirdNumber;
    var firstOperator = query.firstOperator;
    var secondOperator = query.secondOperator;
    var subtractReverse = false;
    if (secondOperator == "x") {
        initialCalculatorInput = query.thirdNumber;
        firstCalculatorInput = query.secondNumber;
        secondCalculatorInput = query.firstNumber;
        firstOperator = query.secondOperator;
        secondOperator = query.firstOperator;
        subtractReverse = true;
    }
    var calculator = new Calculator(initialCalculatorInput);

    var number = firstCalculatorInput;

    var operator = firstOperator;

    for (j = 0; j < 2; j++) {
        switch (operator) {
            case "x":
                calculator.multiply(number);
                break;
            case "+":
                calculator.add(number);
                break;
            case "-":
                calculator.subtract(number, subtractReverse);
                break;
        }
        operator = secondOperator;
        number = secondCalculatorInput;
    }
    return calculator.value;
}