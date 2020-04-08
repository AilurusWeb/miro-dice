/*
|| Reply :  String envoyé sur le tchat
|| Roll  :  2D6+6-2
|| Dices :  2D6
|| Side  :  2D6 -> 6
|| Acc   :  2D6 -> 2 (accumulator)
|| Bonus :  +6-2
*/

/*
|| Utiliser Class
|| Utiliser TypeScript
*/


/* Elements */
const inputRoll = document.getElementById('inputRoll');
const buttonRoll = document.getElementById('buttonRoll');

let divReplies = document.getElementById('repliesContain')

function getRolls (reply) {
  let rolls = extractRolls(reply)
  if(!rolls) return false

  rolls = rolls.map( roll => {
    return splitRollAndBonus(roll)
  })
  console.log(rolls)
}

/**
 * Génère et calcul les valeurs d'un lancé de dé
 * @param  {String} roll String du lancé de dé
 * @param  {Int} sumBonus Somme des valeurs des bonus associées au jet
 * @return {Object}  Object contenant les lancés de dé calculés
 */
function calcRoll (roll, sumBonus) {
  if (!roll) return false
  let figures = roll.split(/d/gi).filter(x => x)
  let occurence = figures[0]
  let sides = figures[1]
  let results = []
  let sum = 0
  for (let i = 0; i > occurence; i++) {
    let dice = Math.floor(Math.random() * sides) + 1
    results.push({
      'dice': dice,
      'bonus': sumBonus,
      'sum':  dice + sumBonus
    })
  }
  return results
}

/**
 * Calcule les bonus du jet de dé
 * 5d5[+5-9+6]
 * @param  {String} Bonus
 * @return {Int}    Somme des bonus
 */
function calcBonus (bonus) {
  if (!bonus) return 0
  let adds = bonus.match(/(\+\d+)|(\-\d+)/g)
  let sum = 0
  for (let v of adds) {
    sum += parseInt(v)
  }
  return parseInt(sum)
}

function splitRollAndBonus (roll) {
  console.log(roll)
  let dices = roll.match(/(\d*?D\d+)/gi)[0]
  let bonus = roll.replace(dices, '')
  if (!bonus) bonus = 0
  return {
    'dices': dices,
    'bonus': calcBonus(bonus)
  }
}

/* Functions */


/**
 * Vérifie que la chaine de caractère contient un lancer de dé valide
 * 5d5 | 5d5+5-5 | d5
 * @param  {String} (word) Mot à vérifier
 * @return {Boolean}
 */
function isRollsString (word) {
  if(typeof word !== 'string') return false
  
  // Ne contient que : chiffre, d || D, + || -
  const hasBadChars = /[^d^\d^\+^\-]/gi;

  // Ne contient qu'un seul 'd'
  const onceD = /d{2,}/gi;

  // A le bon format d'un lancé de dé
  const rollFormat = /(\d*?D\d+)(((\+|-)\d+)*)?/gi;
  
  if (word.search(hasBadChars) !== -1) return false
  if (word.match(onceD) !== null)      return false
  if (word.match(rollFormat) === null) return false
  return true    
}

/**
 * Extrait les String dans la phrase qui sont des lancés de dés
 * @param  {String} (reply) String envoyée sur le tchat
 * @return {Array}  Tableau de String qui correspondent à des lancés de dé avec leurs bonus  
 */
function extractRolls (reply) {
  let words = reply.split(" ")
  let rolls = []
  for (let word of words) {
    if (isRollsString(word)) {
      rolls.push(word)
    } 
  }
  return (rolls.length > 0)? rolls : false
}

function inputValidation () {
  if (inputRoll.value.length <= 0) return false
  return true
}

function setReply (username, reply) {
  let calc = getRolls(reply)
  let divReply = document.createElement("div");
      divReply.className = "rolldice__reply";
      divReply.innerHTML = `<span class="rolldice__reply-username">${username}</span>
                         <span class="rolldice__reply-result">${reply}</span>`;
  divReplies.appendChild(divReply)
  inputRoll.value = ''
}

/* Events */

buttonRoll.addEventListener("click", (event) => {
  if(inputValidation()) {
    setReply("khu", inputRoll.value)
  }
});

inputRoll.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && inputValidation()) {
    setReply("khu", inputRoll.value)
  } 
});

function showRollsByName() {

}