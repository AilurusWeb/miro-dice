/*
|| Reply :  String envoyé sur le tchat
|| Roll  :  2D6+6-2
|| Dices :  2D6
|| Side  :  2D6 -> 6
|| Acc   :  2D6 -> 2 (accumulator)
|| Bonus :  +6-2
*/

/*
|| Rendre AllUser
|| Utiliser Class
|| Utiliser TypeScript
|| Utiliser Linter
|| Utiliser Design
*/
let currentUser = {}

function getCurrentUser () {
  var xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      console.log(this.responseText);
    }
  });

  xhr.open("GET", "https://api.miro.com/v1/users/me");

  xhr.send(currentUser);
}
getCurrentUser()
console.log(currentUser)


/* Elements */
const inputReply = document.getElementById('inputReply');
const buttonReply = document.getElementById('buttonReply');

let divReplies = document.getElementById('dicetrayReplies')

function getRolls (reply) {
  let rolls = extractRolls(reply)
  if(!rolls) return false

  return rolls.map( roll => {
    roll = splitRollAndBonus(roll)
    return calcRoll(roll.dices, roll.bonus)
  })
}

/**
 * Génère et calcul les valeurs d'un lancé de dé
 * @param  {String} dices String du lancé de dé
 * @param  {Int} bonus Somme des valeurs des bonus associées au jet
 * @return {Object}  Object contenant les lancés de dé calculés
 */
function calcRoll (dices, bonus) {
  if (!dices) return false
  let figures = dices.split(/d/gi).filter(x => x)
  if (figures.length === 1) figures.unshift(1)
  let occurence = figures[0] 
  let sides = figures[1]
  let rolls = []
  let sum = 0
  for (let i = 1; i <= occurence; i++) {
    let dice = Math.floor(Math.random() * sides) + 1
    rolls.push({
      'side': sides,
      'dice': dice,
      'bonus': bonus,
      'value':  dice + bonus,
    })
  }
  return rolls
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

function rollToString (roll) {
  const config = showRollsDetails()
  let reply = ""
  if (!config) {
    reply = `Total du lancé : ${roll.value}<br>`
  }
  else {
    reply = renderRoll(roll)
    //reply = `D${roll.side} : ${roll.dice} (dé) + ${roll.bonus} (bonus) = ${roll.value}<br>`
  }
  return reply
}

function rollsToString (rolls) {
  
}

function inputValidation () {
  if (inputReply.value.length <= 0) return false
  return true
}

function setReply (username, reply) {
  let rolls = getRolls(reply)
  reply = rolls.map( rolls => {
    return rolls.map (roll => rollToString(roll))
  })
  let divReply = document.createElement("div");
      divReply.className = "dicetray__reply";
      divReply.innerHTML = renderReply(reply);
  divReplies.appendChild(divReply)
  inputReply.value = ''
}

/* Events */

buttonReply.addEventListener("click", (event) => {
  if(inputValidation()) {
    setReply("khu", inputReply.value)
  }
});

inputReply.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && inputValidation()) {
    setReply("khu", inputReply.value)
  } 
});

function showRollsByName() {

}

function showRollsDetails() {
  // Que la somme (sans détail)
  // La somme = valeur du dé + bonus
  // Sous forme de tableau
  return true
}

/* Templating */

let renderReply = function (replies) {
  return `
    <div class="dicetray__reply-username">Khü</div>
    <div class="dicetray__reply-rolls">
      ${replies.join('')}
    </div>
  `
}

let renderRoll = function (roll) {
  return `
    <div class="dicetray__roll">
      <span class="c-side">${roll.side}</span>
      <span class="c-result"><b>${roll.dice}</b> <small>(dé)</small> + <b>${roll.bonus}</b> <small>(bonus)</small> = <b>${roll.value}</b></span>
    </div>
  `
}