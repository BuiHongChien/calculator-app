"use strict";

const calculator = {
  displayFirstRow: "0",
  displaySecondRow: "0",
  stringForEval: "",
  openingBracket: [],
  isResult: false,
};

const factorialize = (num) => {
  if (num < 0) return -1;
  else if (num == 0) return 1;
  else {
    return num * factorialize(num - 1);
  }
};

const isOperand = (char) => {
  if (char === "-" || char === "+" || char === "*" || char === "/") return true;
  return false;
};

const lastChar = (string) => {
  return string[string.length - 1];
};

const isNumber = (char) => {
  return char >= "0" && char <= "9";
};

const updateDisplay = () => {
  const firstRow = document.querySelector(".container__result--first-row");
  const secondRow = document.querySelector(".container__result--second-row");

  firstRow.value = calculator.displayFirstRow;
  secondRow.value = calculator.displaySecondRow;
};
updateDisplay();

const handleForEval = () => {
  let { stringForEval, displaySecondRow } = calculator;

  stringForEval = displaySecondRow.replace("Sin", "Math.sin")
    .replace("Cos", "Math.cos")
    .replace("Tan", "Math.tan")
    .replace("Log", "Math.log")
    .replace("Sqrt", "Math.sqrt")
    .replace("pi", "Math.PI")
    .replace("e", "Math.E");
  
    console.log(stringForEval)

  while (stringForEval.indexOf("Sqr(") !== -1) {
    const id = stringForEval.indexOf("Sqr(");

    if (stringForEval.substring(id, stringForEval.length).includes(")")) {
      for (var i = id + 4; i < stringForEval.length; i++)
        if (!(isNumber(stringForEval[i]) || stringForEval[i] === ".")) break;

      const sqrString = stringForEval.substring(id, i + 2);
      const number =
        "(" +
        stringForEval.substring(id + 4, i) +
        "*" +
        stringForEval.substring(id + 4, i) +
        ")";

      stringForEval = stringForEval.replace(sqrString, number);
    } else break;
  }

  while (stringForEval.indexOf("!") !== -1) {
    const id = stringForEval.indexOf("!");
    for (var i = id - 1; i >= 0; i--) {
      if (!isNumber(stringForEval[i])) break;
    }

    const factorial = stringForEval.substring(i, id + 1);
    const number = stringForEval.substring(i, id);
    const factorialResult = factorialize(parseInt(number));

    console.log(factorial, number, factorialResult);

    stringForEval = stringForEval.replace(factorial, factorialResult);
    console.log(stringForEval);
  }

  calculator.stringForEval = stringForEval;
  console.log(stringForEval);
  return;
};

const inputNumber = (number) => {
  const { displaySecondRow } = calculator;

  calculator.displaySecondRow =
    displaySecondRow === "0" ? number : displaySecondRow + number;
  handleForEval();
};

const inputDecimal = (dot) => {
  const secondRow = calculator.displaySecondRow;

  for (var i = secondRow.length; i >= 0; i--) {
    if (!(isNumber(secondRow[i]) || secondRow[i] === ".")) {
      break;
    }
  }
  if (
    !calculator.displaySecondRow.substring(i, secondRow.length).includes(dot)
  ) {
    calculator.displaySecondRow += dot;
  }

  handleForEval();
};

const inputEquals = () => {
  const secondRow = calculator.displaySecondRow;
  const { stringForEval } = calculator;

  if (calculator.openingBracket.length > 0) return;

  calculator.displayFirstRow = secondRow;
  calculator.displaySecondRow = eval(stringForEval);
  calculator.isResult = true;
};

const inputAllClear = () => {
  calculator.displayFirstRow = "0";
  calculator.displaySecondRow = "0";
  calculator.isResult = false;
  calculator.operand = null;
  calculator.firstOperand = null;
  calculator.stringForEval = "";
};

const inputClear = () => {
  const last = lastChar(calculator.displaySecondRow);
  const prevLastChar = calculator.displaySecondRow[length - 2];
  const len = calculator.displaySecondRow.length;

  if (last !== "(" || isOperand(prevLastChar))
    calculator.displaySecondRow = calculator.displaySecondRow.slice(0, -1);
  else {
    for (var i = len - 2; i >= 0; i--) {
      if (isOperand(calculator.displaySecondRow[i]) || calculator.displaySecondRow[i]==='(' ) break;
    }
    console.log(i)

    calculator.displaySecondRow = calculator.displaySecondRow.slice(0, i + 1);
  }

  handleForEval();
};

const inputBracket = (bracket) => {
  if (bracket === "(") {
    if (
      isOperand(lastChar(calculator.displaySecondRow)) ||
      calculator.displaySecondRow === "0"
    ) {
      inputNumber(bracket);
      calculator.openingBracket.push(calculator.displaySecondRow.length);
    }
    return;
  }

  if (
    calculator.openingBracket.length <= 0 ||
    lastChar(calculator.displaySecondRow) === "("
  )
    return;
  else {
    inputNumber(bracket);
    calculator.openingBracket.pop();
  }

  handleForEval();
};

const inputSpecialNumber = (specialNumber) => {
  const char = lastChar(calculator.displaySecondRow);

  if (!(isNumber(lastChar) || char === "." || char==='pi' || char==='e')) {
    inputNumber(specialNumber);
    updateDisplay();
  }

  handleForEval();
};

const inputOperator = (operator) => {
  const char = lastChar(calculator.displaySecondRow);

  if (char !== "." && char !== "(" && !isOperand(lastChar) && calculator.displaySecondRow!=='0') {
    inputNumber(operator);
    updateDisplay();
  }

  handleForEval();
};

const inputFormula = (formula) => {
  const char = lastChar(calculator.displaySecondRow);

  if (formula === "!") {
    if (isNumber(char)) {
      for(var i = calculator.displaySecondRow.length-1; i>0; i--)
        if(!isNumber(calculator.displaySecondRow[i]) && calculator.displaySecondRow[i] !=='.') break
      
      if(calculator.displaySecondRow.substring(i+1, length).includes('.')) return

      inputNumber(formula);
      updateDisplay();
      handleForEval();
      return;
    }
  }

  if (
  (!isNumber(char) && char !== ".") ||
    calculator.displaySecondRow === "0"
  ) {
    console.log(formula);
    inputNumber(formula);
    calculator.openingBracket.push(calculator.displaySecondRow.length);
    updateDisplay();
  }

  handleForEval()
};

const keys = document.querySelector(".container__board");
keys.addEventListener("click", (event) => {
  const { target } = event;
  if (!target.matches("button")) return;

  if (target.classList.contains("operator")) {
    calculator.isResult = false;

    inputOperator(target.value);
    return;
  }

  if (target.classList.contains("bracket")) {
    inputBracket(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains("special-number")) {
    calculator.isResult = false;

    inputSpecialNumber(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains("all-clear")) {
    inputAllClear();
    updateDisplay();
    return;
  }

  if (target.classList.contains("clear")) {
    if (!calculator.isResult) {
      inputClear();
      updateDisplay();
    }
    return;
  }

  if (target.classList.contains("math-formula")) {
    calculator.isResult = false;

    inputFormula(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains("equals")) {
    if (!calculator.isResult) {
      inputEquals(target.value);
      updateDisplay();
    }
    return;
  }

  if (target.classList.contains("number")) {
    if (!calculator.isResult) {
      inputNumber(target.value);
      updateDisplay();
    }
    return;
  }

  if (target.classList.contains("decimal")) {
    if (!calculator.isResult) {
      inputDecimal(target.value);
      updateDisplay();
    }
    return;
  }

  if (target.classList.contains("copy")) {
    var copyNumber = document.getElementById("second-row");

    console.log(copyNumber);
    
    copyNumber.select();
    copyNumber.setSelectionRange(0, 9999);
    document.execCommand("copy");
  }
});
