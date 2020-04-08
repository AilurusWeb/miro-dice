/* Elements */
const inputRoll = document.getElementById('inputRoll');
const buttonRoll = document.getElementById('buttonRoll');

let repliesContain = document.getElementById('repliesContain')

/* Functions */

// Check Response contains rolls
// return array || false
function hasRollsString(str) {
  if(typeof str !== 'string') return false
  let words = str.split(" ")
  // check that this string does not have other unwanted characters
  // d D chiffre + -
  const hasBadChars = /[^d^\d^\+^\-]/gi;
  // 
  // 
  const onceD = /d{2,}/gi;
  // check that this string has good format
  // 5d5 5D5 5d5+5 5d5+5-5
  const rollFormat = /(\d*?D\d+)(((\+|-)\d+)*)?/gi;

  for (let word of words) {
    console.log(word, "Begin")
    if (word === null) continue
    if (word.search(hasBadChars) !== -1) continue
    if (word.match(onceD) !== null) continue
    if (word.match(rollFormat) === null) continue

    console.log(word, ", it's perfect !")
  }
//  let results = str.match(regex) || []
//  console.log(results, " --")
//  if (results.length > 0) return results.map(str => str.trim())
//  else  return false
}

// Convert string roll to calculate 
// 5d6+3 6d6+2 5d6
function calcRolls(rolls) {
  if(!Array.isArray(rolls) || rolls.length < 1) return false

//  console.log(rolls, "rolls")
  let results = []
  for ( const roll of rolls ) {
    results.push({
      dice: 1,
      bonus: 2
    }) 

  }
  //console.log()
}

function inputValidation() {
  if (inputRoll.value.length <= 0) return false
  return true
}

function resultRoll() {
  console.log("Roulez !")
}

function reply(username, response) {
  let reply = document.createElement("div");
      reply.className = "rolldice__reply";
      reply.innerHTML = `<span class="rolldice__reply-username">${username}</span>
                         <span class="rolldice__reply-result">${response}</span>`;
  repliesContain.appendChild(reply)
  let rolls = hasRollsString(response)
  calcRolls(rolls)
  inputRoll.value = ''
}

/* Events */

buttonRoll.addEventListener("click", (event) => {
  if(inputValidation()) {
    reply("khu", inputRoll.value)
  }
});

inputRoll.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && inputValidation()) {
    reply("khu", inputRoll.value)
  } 
});
