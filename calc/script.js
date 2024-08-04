let displayValue = '';
let presentNum = '';
let previousNum = '';
let operation = null;
let displayTotal;
function mcFunction() {
    document.getElementById("display").value = 0;
}
function bcFunction() {
     displayTotal = document.getElementById("display").value;
    document.getElementById("display").value = displayTotal.slice(0, -1);
}
function cFunction() {
    displayValue = '';
    document.getElementById("display").value = displayValue;   
}
function msFunction() {
    displayValue = document.getElementById("display").value;    
}
function mrFunction() {
    document.getElementById("display").value = displayValue;   
}
function mplusFunction() {
    displayValue = (Number(displayValue) + Number(document.getElementById("display").value)).toString();
    document.getElementById("display").value = displayValue;
}
function minusFunction() {
    displayValue = (Number(displayValue) - Number(document.getElementById("display").value)).toString();
    document.getElementById("display").value = displayValue;
}
function appendNum(num) {
    document.getElementById("display").value += num;   
}
function setOperation(op) {
    previousNum = document.getElementById("display").value;
    operation = op;
    if(op=='1/x'){
        document.getElementById("display").value=Math.round((1/previousNum)*100)/100;
        }
        else{
    document.getElementById("display").value = previousNum+op;
        }   
}
function ans() {
    let answer;
    const num1 = parseFloat(previousNum);
    let fullnum=document.getElementById("display").value;
    let nums=fullnum.split(operation);
    debugger
    const num2 = parseFloat(nums[1]);
    if (isNaN(num1) || isNaN(num2)) return;

    switch (operation) {
        case '+':
            answer = num1 + num2;
            break;
        case '-':
            answer = num1 - num2;
            break;
        case '*':
            answer = num1 * num2;
            break;
        case '/':
            answer = num2 === 0 ? 'Error' : num1 / num2;
            break;
        case '%':
            answer = num1 % num2;
            break;
        case '1/x':
            if(display.value == 0) alert("error");
            else display.value=Math.round((1/display.value)*100)/100;
            
            break;
        default:
            return; 
    }
    presentNum = answer;
    operation = null;
    previousNum = '';
    displayValue = answer;
    document.getElementById("display").value = answer;
}
function result() {
    ans();
}
function pFunction() {
    let currentVal = parseFloat(document.getElementById("display").value);
    if (!isNaN(currentVal)) {
        document.getElementById("display").value = (-currentVal).toString();
    }
}
function mFunction() {
    let currentVal = parseFloat(document.getElementById("display").value);
    if (!isNaN(currentVal)) {
        document.getElementById("display").value = Math.sqrt(currentVal).toString();
    }
}
