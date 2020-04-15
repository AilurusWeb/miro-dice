//#######################################################################
//########################### TESTS UNITAIRES ###########################
//#######################################################################


function testValidInput() {
    const test1 = validInput("a") === true;
    const test2 = validInput(2) === false;
    const test3 = validInput([2, "e"]) === false;
    return test1 && test2 && test3;
}
/*
function testIsRoll() {
    //sous format map pour pouvoir tester arr+side[key] = [value]
    let testMap = [["d1", 1], ["1d1", 2], ["10d1", 11], ["1d10", 11], ["10d10", 20], ["1d", false],
        ["1dd1", false], ["d1d1", false], ["1d1d", false], ["d", false], ["D", false], ["test", false]];
    var result: boolean;

    for (var [key, value] of testMap)
    {
        var test = new Rolls(key as string);
        if (test._isRoll(key) === true) {
            result = result && true
        }
        else {
            result = result && false
        }
    }
}
*/

testValidInput();