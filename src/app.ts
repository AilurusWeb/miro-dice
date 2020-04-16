const buttonReply = document.getElementById("buttonReply");
const inputReply = document.getElementById("inputReply");
let dicetrayReplies = document.getElementById("dicetrayReplies");
let currentUser = "Khü" //A remplacer par le retour du serveur Miro

let validInput = (value: string) => { //Validation de l'input dès la saisie dans le chat
    const rollRegEx = /(^\d*D\d+){1}\s?(((\+|-)\s?\d+\s?)+$|$)/gi;
    const splitValue = value.split(" ");
    for (const elements of splitValue) {
        if (!elements.match(rollRegEx) || typeof elements !== "string") {
            return false;
        }
    }
    return true;
}

buttonReply.addEventListener("click", (event) => {
    let value = (<HTMLInputElement>inputReply).value;
    if (validInput(value)) {
        let rolls = new Chat(currentUser).submit(value);
    }
});

inputReply.addEventListener("keydown", (event) => {
    let value = (<HTMLInputElement>inputReply).value;
    if (event.key === "Enter" && validInput(value)) {
        let rolls = new Chat(currentUser).submit(value);
    }
});

/**
 Interfaces
 **/

interface DiceSchema {
    side: number;
    value: number;
    toString: string
}

interface RollSchema {
    nb_dices: number,
    dices: Array<DiceSchema>,
    modifiers: ModifiersSchema,
    toString: string,
    sum: number
}

interface ModifiersSchema {
    sum: number,
    toString: string
}

/**
 Classes
 **/

class Dice {

    private _dice: DiceSchema;

    public constructor(str_dice: string) {
        this._toDice(str_dice);
    }

    private _toDice(str_dice: string) {
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

    private _rollDice(side: number): number {
        return Math.floor(Math.random() * side) + 1
    }

    public dice(): DiceSchema {
        return this._dice;
    }
}


/**
 *
 **/
class Modifiers {

    private _str: string;

    public constructor(str: string) {
        this._str = str;
    }

    public modifiers(): ModifiersSchema {
        return {
            sum: this.sum(),
            toString: this._str
        }
    }

    public sum(): number {
        let arr = this._str.match(/(\+\d+)|(\-\d+)/g);
        let sum = 0;
        if (arr === null) return 0;
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

    private _rolls: Array<RollSchema> = [];

    public constructor(str_roll: string) {
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
            let r: RollSchema = {
                nb_dices: nb_dices,
                dices: dices,
                modifiers: modifiers,
                toString: str_roll,
                sum: this._calc(dices_sum, modifiers.sum)
            }

            this._rolls.push(r);
        }
    }

    public rolls(): Array<RollSchema> {
        return this._rolls;
    }

    private _nb_dice(str_dice: string): number {
        return parseInt(str_dice.match(/^\d*/)[0]) || 1;
    }

    private _calc(dice_value: number, modifiers_value: number): number {
        return dice_value + modifiers_value;
    }


    /*Fonction permettant de séparer une string de type "1D6+4" en une liste ["1D6","+4"]*/
    private _disjoin(str_roll: string): Array<string> {
        let regex = /(\+|\-)/g;
        let index = str_roll.search(regex)
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

    private _value: string;
    private _rolls: Array<RollSchema>;

    public constructor(value: string) {
        if (value) {
            this._rolls = new Rolls(value).rolls();
        }
    }

    private _reply() {
        /*Création d'une liste affichant les différents lancer*/
        let renderRolls: Array<any> = [];

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

    public render() {
        let divReply = document.createElement("div");
        divReply.className = "dicetray__reply";
        divReply.innerHTML = this._reply();
        (<HTMLInputElement>dicetrayReplies).appendChild(divReply);
        (<HTMLInputElement>inputReply).value = '';
    }
}

/**
 *
 **/
class Chat {
    private _sender: string;

    public constructor(sender: string) {

    }

    private _insertReply() {

    }

    public submit(str: string) {
        return new InputStream(str).render();
    }
}

/* Templating */

let renderReply = function (replies: any) {
    return `
    <div class="dicetray__reply-username">${currentUser}</div>
    <div class="dicetray__reply-rolls">
      ${replies.join('')}
    </div>
  `
}

let renderRoll = function (dice: DiceSchema, modifiers: ModifiersSchema) {
    let roll = {
        side: dice.side,
        dice: dice.value,
        bonus: modifiers.sum,
        sum: dice.value + modifiers.sum,
    }
    return `
    <div class="dicetray__roll">
      <span class="c-side">${roll.side}</span>
      <span class="c-result"><b>${roll.dice}</b> <small>(dé)</small> + <b>${roll.bonus}</b> <small>(bonus)</small> = <b>${roll.sum}</b></span>
    </div>
  `
}