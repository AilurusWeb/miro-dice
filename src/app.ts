
//Simulation retour Miro
let currentUser = "Khü" //A remplacer par le retour du serveur Miro

class Chat {
    private _sender: string;

    public constructor(sender: string) {}

    private _insertReply() {}

    public submit(str: string) {
        return new InputStream(str).render();
    }
}

//##################################################################
//########################### TEMPLATING ###########################
//##################################################################

const renderReply = function (replies: any) {
    return `
    <div class="dicetray__reply-username">${currentUser}</div>
    <div class="dicetray__reply-rolls">
      ${replies.join('')}
    </div>
  `
}

const renderRoll = function (dice: DiceSchema, modifiers: ModifiersSchema) {
        let sumDice = 0;
        for (const i of dice.value) {
            sumDice += i;
        }

    const roll = {
        side: dice.side,
        dice: dice.value,
        bonus: modifiers.sum,
        sum: sumDice + modifiers.sum,
    }
    return `
    <div class="dicetray__roll">
      <span class="c-side">${roll.side}</span>
      <span class="c-result"><b>${roll.dice}</b> <small>(dé)</small> + <b>${roll.bonus}</b> <small>(bonus)</small> = <b>${roll.sum}</b></span>
    </div>
  `
}

/**
 *
 **/
class InputStream {

    private _value: string;
    private _rolls: Array<RollSchema>;

    public constructor(value: string) {
        let rollsList = this._extractRolls(value);
        this._rolls = new Rolls(rollsList).rolls();
    }

    private _extractRolls(strRolls: string): Array<string> {
        /*Converti l'input en liste*/
        return strRolls.split(" "); 
    }

    private _reply() {
        let renderRolls: Array<any> = [];

        for (const roll of this._rolls) {
            const modifiers = roll.modifiers;
            renderRolls = roll.dices.map(dice => renderRoll(dice, modifiers));
        }
        return renderReply(renderRolls);
    }

    public render() {
        const divReply = document.createElement("div");
        divReply.className = "dicetray__reply";
        divReply.innerHTML = this._reply();
        (<HTMLInputElement>dicetrayReplies).appendChild(divReply);
        (<HTMLInputElement>inputReply).value = '';
    }

}

/*
Fonction permettant de valider l'input saisie dans le chat
Conversion en liste en séparant avec les espaces
Chaque élément doit correspondre à la regEx et être une chaine
*/
function validInput(value: string) { //A passer dans la classe chat

    const rollRegEx = /(^\d*D\d+){1}\s?(((\+|-)\s?\d+\s?)+$|$)/gi;
    const splitValue = value.split(" ");
    for (const elements of splitValue) {
        if (!elements.match(rollRegEx) || typeof elements !== "string") {
            return false;
        }
    }
    return true;
}

//#############################################################################
//########################### DEFINITION DES CLASSES ##########################
//#############################################################################

/**
 Définition des valeurs attendues dans l'objet de type "DiceSchema"
 Cette interface est utilisée dans la classe Dice
 **/
interface DiceSchema {
  side: number;
    value: Array<number>;
    toString: string
}

/**
 Classe permettant de créé un objet Dice qui récupère la partie "dé" de la chaine de caractère du chat
 pour renvoyer la valeur du dé, le nombre de lancer, la chaine de caractère du chat.
 
 **/
class Dice {
  
  private _dice: DiceSchema;

    public constructor(strDice: string) {
    this._toDice(strDice);
    }
    
    private _toDice(strDice: string) {
        //Récupération de tous les chiffres du lancer
        const arr = strDice.split(/d/gi);
        let rollTime = 0;
        let side = 0;

        if (arr.length < 2) {
            rollTime = 1;
            side = parseInt(arr[0]);
        }
        else {
            rollTime = parseInt(arr[0]);
            side = parseInt(arr[1]);
        }

        //Appel de la méthode ._rollDice x fois selon la valeur du dé.
        let i = 0;
        let value = [];
        while (i < rollTime) {
            value.push(this._rollDice(side));
            i++;
        };
        this._dice = {
            side: side,
            value: value,
            toString: strDice,
        };
    }
  
  private _rollDice(side: number): number {
      //Génération d'un nombre aléatoire compris entre 1 et la valeur en paramètre
    return Math.floor(Math.random() * side) + 1
  }

  public dice(): DiceSchema {
      return this._dice;
  }
}

/**
 Définition des valeurs attendues dans l'objet de type "ModifiersSchema"
 Cette interface est utilisée dans la classe Modifiers
 **/
interface ModifiersSchema {
    sum: number;
    toString: string;
}

/**
 Classe permettant de créé un objet Modifiers qui récupère la partie "modifier" de la chaine de caractère du chat
 pour renvoyer la somme des modifiers
 --> A passer en methode de la classe inputStream ou chat vu la taille ?
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
    const arr = this._str.match(/(\+\d+)|(-\d+)/g);
    let sum = 0;
    if (arr === null) return 0;
    for (const value of arr) {
      sum += parseInt(value);
    }
    return sum;
  }
}

/**
 Définition des valeurs attendues dans l'objet de type "RollSchema"
 Cette interface est utilisée dans la classe Rolls
 **/
interface RollSchema {
    nbDices: number;
    dices: Array<DiceSchema>;
    modifiers: ModifiersSchema;
    sum: number;
}

/**
*
 **/
class Rolls {

    private _rolls: Array<RollSchema> = [];

    public constructor(rollsList: Array<string>) {
            for (const roll of rollsList) {
                const [strDices, strModifiers] = this._disjoin(roll);
                const dice = new Dice(strDices).dice();
                const modifier = new Modifiers(strModifiers).modifiers();
                let dices = [];
                let dicesSum = 0;
                dices.push(dice);

                for (const i of dice.value)
                {
                    dicesSum += dice.value[i];
                }
                const r: RollSchema = {
                    nbDices: dice.value.length,
                    dices: dices,
                    modifiers: modifier,
                    sum: this._calc(dicesSum, modifier.sum)
                }

                this._rolls.push(r);
            }
        }

    public rolls(): Array<RollSchema> {
        return this._rolls;
    }
    
    private _nbDice(strDice: string): number {
        return parseInt(strDice.match(/^\d*/)[0]) || 1;
    }

    private _calc(diceValue: number, modifiersValue: number): number {
        return diceValue + modifiersValue;
    }

    private _disjoin(strRoll: string): Array<string> {
        const regex = /(\+|-)/g;
        const index = strRoll.search(regex)
        let roll = [strRoll, '0'];
        if (index !== -1) {
            roll = [
                strRoll.slice(0, index),
                strRoll.slice(index)
            ];
        }
        return roll;
    }
}


//#############################################################################
//########################### INTERACTION AVEC HTML ###########################
//#############################################################################


const buttonReply = document.getElementById("buttonReply");
const inputReply = document.getElementById("inputReply");
const dicetrayReplies = document.getElementById("dicetrayReplies");


buttonReply.addEventListener("click", () => {
    const value = (<HTMLInputElement>inputReply).value;
    if (validInput(value)) {
        const rolls = new Chat(currentUser).submit(value);
    }
});

inputReply.addEventListener("keydown", (event) => {
    const value = (<HTMLInputElement>inputReply).value;
    if (event.key === "Enter" && validInput(value)) {
        const rolls = new Chat(currentUser).submit(value);
    }
});