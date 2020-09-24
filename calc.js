// todo
/////////////////////////////////////
// make new repo and git-tracked
/////////////////////////////////////
// reduce code by:
// reduce repetition in functions around % checks
/////////////////////////////////////
// more than one decimal point???
// extras:
// adding sign button to existing calc being displayed
// limit size of user input (as well as fontsize change)
// how to display temp error message on screen
// user can input more than one set of brackets
// repeat last operation if you press multiple equals signs
// 19%/17% should be > 1 !!!
// adding commas to display
// handle numbers bigger than display by reducing font-size? (14digits+)
// add a delete button?
// allow user to click inside number to edit it?
// tell user they are trying to make an illegal op



const operatorArray  = ["%", "/", "*", "-", "+"];
const numberArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let inputString = "";
let evalString = "";

// boot-up message
let bootMessage = "MARK'S CALC 2020";

// error message
let errorMessage = "INVALID ENTRY";

// pointer for scrren to access output font etc
const screen = document.getElementById("screen");

// array for the button ids
const buttonIdArray = ["clr", "brackets", "percentage", "division",
                    "n7", "n8", "n9", "multiply",
                    "n4", "n5", "n6", "minus",
                    "n1", "n2", "n3", "plus",
                    "sign", "n0", "period", "equals"];

// array for the button text
const buttonTextArray = ["C", "( )", "%", "/",
                        "7", "8", "9", "*",
                        "4", "5", "6", "-",
                        "1", "2", "3", "+",
                        "&#177;", "0", ".","="];


// call the boot-up function with the boot-up message
bootUp(bootMessage);

function bootUp(message) {
    // get sub-screen div and inject message
    document.getElementById("sub-screen").innerHTML = message;
}

// call the button building function
buildButtons();

function buildButtons() {

    // create string to store HTML for buttons section
    let buttonsHTML = "";

    // loop through button arrays, adding the HTML for each button
    for(let i=0; i<buttonIdArray.length; i++){
        buttonsHTML += `<button id="${buttonIdArray[i]}">${buttonTextArray[i]}</button>`;
    }

    //inject buttonsHTML into calc-buttons div
    document.getElementById("calc-buttons").innerHTML = buttonsHTML;

    //attach event listener to button ids
    buttonIdArray.forEach(buttonId => {
        let buttonFuncString = buttonId + `()`;
        
        if(buttonId.substring(0,1) == "n"){
            buttonFuncString = `numeric("${buttonId.substr(1,1)}")`;           
        }
        document.getElementById(buttonId).addEventListener("click", () => {
            eval(buttonFuncString);
            updateScreen();
        }); 
    });
}



function displayErrorMessage(code){
    switch (code) {
        case 1:
            errorMessage = "MAXIMUM ENTRY";
            break;
        default:
            errorMessage = "INVALID ENTRY";
            break;
    }
    screen.innerHTML = errorMessage;
}

function clr() {
    // clear input
    inputString = "";
    evalString = "";  
}

function plus() {
    if (checkLast()) {
        inputString += "+";
        percentFix("+");
    }
}

function minus() {
    if (checkLast()) {
        inputString += "-";
        percentFix("-");
    }
}

function multiply() {
    if (checkLast()) {
        inputString += "*";
        percentFix("*");
    }
}

function division() {
    if (checkLast()) {
        inputString += "/";
        percentFix("/");
    }
}

function checkLast() {
    //checks if previous character was either a percentage or not an operator
    if (!operatorArray.includes(inputString[inputString.length-1]) || inputString[inputString.length-1] == "%"){
        return true;
    }else{
        return false;
    }
}

function percentage() {
    if (!operatorArray.includes(inputString[inputString.length-1])){
        inputString += "%";
        evalString += "*0.01"
    }
}

function sign() {
    inputString[0] !== "-" ? inputString = "-"+ inputString : inputString = inputString.slice(1);
    evalString[0] !== "-" ? evalString = "-"+ evalString : evalString = evalString.slice(1);
}

function period() {
    inputString += ".";
    evalString += ".";
}

function equals() {
    // if last char is a percentage or not an operator
    if (checkLast()) {
        // if contains open but not close bracket, close bracket first
        if (inputString.includes("(") && !inputString.includes(")")){
            inputString += ")";
            evalString += ")";
        }
        // if input string evaluates
        if (evalString){
            console.log(evalString);
            evalString = truncateDecimals(eval(evalString),10);
            inputString = evalString.toString();
        } else {
            displayErrorMessage(0);
        }
    }
    
    updateScreen();
}

function numeric(digit) {
    if (!errorMessage.includes(inputString[inputString.length-1])){
        // add * sign if previous char was a closing bracket
        if(inputString[inputString.length - 1] == ")") {
            inputString += "*"+digit;
            evalString += "*"+digit;
        } else {
            inputString += digit;
            evalString += digit;
        }
    }
}

function updateScreen() {
    if(inputString.length>24){
        displayErrorMessage(1);
        inputString.slice(0,-1);
        evalString.slice(0,-1);
    }else{
        // adjust font-size
        if(inputString.length>20) {
            screen.style.fontSize = "0.75rem";
        }else if(inputString.length>13) {
            screen.style.fontSize = "1rem";
        }else{
            screen.style.fontSize = "1.5rem";
        }
        screen.innerHTML = inputString;
    }
}

// function to truncate decimal places, which turned out to be
// a bit of a rabbit hole - as rounding using Math methods is
// riddled with edge-cases
// https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript
function truncateDecimals(num,digits) {
    var numS = num.toString(),
        decPos = numS.indexOf('.'),
        substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
        trimmedResult = numS.substr(0, substrLength),
        finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

    return parseFloat(finalResult);
}

function brackets() {
    // is this the first bracket entered?
    if (!inputString.includes("(")) {       
            //was the previous character a number or a pecentage? if so add a * first
            //else add an opening bracket
            if (numberArray.includes(inputString[inputString.length - 1]) || inputString[inputString.length - 1] == "%") {
                inputString += "*(";
                evalString += "*(";
            } else {
                inputString += "(";
                evalString += "(";
            }      
    } else {
        // does the input string contain more than just an opening bracket?
        if (inputString.length!=1) {
            // was the previous character a number or a percentage?
            if (numberArray.includes(inputString[inputString.length - 1]) || inputString[inputString.length - 1] == "%") {
                if (!inputString.includes(")")) {
                    inputString += ")";
                    evalString += ")";
                }
            }
        }
    }
    updateScreen();
}


// fix trailing percentage sign
function percentFix(operator) {
    if (evalString[evalString.length-1] == "*") {
        evalString += `1${operator}`;
    } else {
        evalString += operator;
    }
}




