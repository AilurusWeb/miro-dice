"use strict";
const buttonReply = document.getElementById("buttonReply");
const inputReply = document.getElementById("inputReply");
let dicetrayReplies = document.getElementById("dicetrayReplies");
let currentUser = "Khü"; //A remplacer par le retour du serveur Miro
let validInput = (value) => {
    const rollRegEx = /(^\d*D\d+){1}\s?(((\+|-)\s?\d+\s?)+$|$)/gi;
    const splitValue = value.split(" ");
    for (const elements of splitValue) {
        if (!elements.match(rollRegEx) || typeof elements !== "string") {
            return false;
        }
    }
    return true;
};
buttonReply.addEventListener("click", (event) => {
    let value = inputReply.value;
    if (validInput(value)) {
        let rolls = new Chat(currentUser).submit(value);
    }
});
inputReply.addEventListener("keydown", (event) => {
    let value = inputReply.value;
    if (event.key === "Enter" && validInput(value)) {
        let rolls = new Chat(currentUser).submit(value);
    }
});
/**
 Classes
 **/
class Dice {
    constructor(str_dice) {
        this._toDice(str_dice);
    }
    _toDice(str_dice) {
        //Récupération de tous les chiffres du lancer
        let arr = str_dice.split(/d/gi);
        let side = (arr.length < 2) ? parseInt(arr[0]) : parseInt(arr[1]);
        let value = (arr[1]) ? this._rollDice(parseInt(arr[1])) : this._rollDice(parseInt(arr[0]));
        this._dice = {
            side: side,
            value: value,
            toString: str_dice
        };
    }
    _rollDice(side) {
        return Math.floor(Math.random() * side) + 1;
    }
    dice() {
        return this._dice;
    }
}
/**
 *
 **/
class Modifiers {
    constructor(str) {
        this._str = str;
    }
    modifiers() {
        return {
            sum: this.sum(),
            toString: this._str
        };
    }
    sum() {
        let arr = this._str.match(/(\+\d+)|(\-\d+)/g);
        let sum = 0;
        if (arr === null)
            return 0;
        for (let value of arr) {
            sum += parseInt(value);
        }
        return sum;
    }
}
/**
 *
 **/
class Rolls {
    constructor(str_roll) {
        this._rolls = [];
        /*Séparation d'une string de type "1D6 12D6-8" en une liste ["1D6","12D6-8"]*/
        let rolls = str_roll.split(" ");
        for (let roll of rolls) {
            /*      Parcours de la liste rolls et pour chaque élément de la liste :
                    - Séparation du lancer 1D6 et des modifiers +4-5
                    - Récupération du nombre de lancer
                    - Instanciation d'un objet Modifiers renvoyant la somme des modifiers
            */
            let [str_dices, str_modifiers] = this._disjoin(roll);
            let nb_dices = this._nb_dice(str_dices);
            let dices = [];
            let dices_sum = 0;
            let modifiers = new Modifiers(str_modifiers).modifiers();
            for (let i = 0; i < nb_dices; i++) {
                /*- Instanciation d'un objet Dice par lancer renvoyant un objet dice comprenant: le type de dé et sa valeur*/
                let dice = new Dice(str_dices).dice();
                dices.push(dice);
                dices_sum += dice.value;
            }
            /*      - Création d'un objet r comprenant : le nombre de dé, les objets dices, les objets modifiers, la somme de l'ensemble*/
            let r = {
                nb_dices: nb_dices,
                dices: dices,
                modifiers: modifiers,
                toString: str_roll,
                sum: this._calc(dices_sum, modifiers.sum)
            };
            this._rolls.push(r);
        }
    }
    rolls() {
        return this._rolls;
    }
    _nb_dice(str_dice) {
        return parseInt(str_dice.match(/^\d*/)[0]) || 1;
    }
    _calc(dice_value, modifiers_value) {
        return dice_value + modifiers_value;
    }
    /*Fonction permettant de séparer une string de type "1D6+4" en une liste ["1D6","+4"]*/
    _disjoin(str_roll) {
        let regex = /(\+|\-)/g;
        let index = str_roll.search(regex);
        let roll = [str_roll, '0'];
        if (index !== -1) {
            roll = [
                str_roll.slice(0, index),
                str_roll.slice(index)
            ];
        }
        return roll;
    }
}
/**
 *
 **/
class InputStream {
    constructor(value) {
        if (value) {
            this._rolls = new Rolls(value).rolls();
        }
    }
    _reply() {
        /*Création d'une liste affichant les différents lancer*/
        let renderRolls = [];
        /*Pour chaque lancer récupération de l'objet contenant un ModifierSchema et une liste de DiceSchema*/
        for (let roll of this._rolls) {
            let modifiers = roll.modifiers;
            /*Récupération de la liste des DiceSchema et implémentation de l'affichage(DiceSchema, ModifierSchema) renderRollss*/
            for (let dice of roll.dices) {
                renderRolls.push(renderRoll(dice, modifiers));
            }
        }
        return renderReply(renderRolls);
    }
    render() {
        let divReply = document.createElement("div");
        divReply.className = "dicetray__reply";
        divReply.innerHTML = this._reply();
        dicetrayReplies.appendChild(divReply);
        inputReply.value = '';
    }
}
/**
 *
 **/
class Chat {
    constructor(sender) {
    }
    _insertReply() {
    }
    submit(str) {
        return new InputStream(str).render();
    }
}
/* Templating */
let renderReply = function (replies) {
    return `
    <div class="dicetray__reply-username">${currentUser}</div>
    <div class="dicetray__reply-rolls">
      ${replies.join('')}
    </div>
  `;
};
let renderRoll = function (dice, modifiers) {
    let roll = {
        side: dice.side,
        dice: dice.value,
        bonus: modifiers.sum,
        sum: dice.value + modifiers.sum,
    };
    return `
    <div class="dicetray__roll">
      <span class="c-side">${roll.side}</span>
      <span class="c-result"><b>${roll.dice}</b> <small>(dé)</small> + <b>${roll.bonus}</b> <small>(bonus)</small> = <b>${roll.sum}</b></span>
    </div>
  `;
};
