const buttonReply = document.getElementById("buttonReply");
const inputReply = document.getElementById("inputReply");
let dicetrayReplies = document.getElementById("dicetrayReplies");

let validInput = (value: string) => {
  return (value)? true : false;
}

buttonReply.addEventListener("click", (event) => {
  let value = (<HTMLInputElement>inputReply).value;
  if(validInput(value)) {
    let rolls = new Chat('Khü').submit(value);
  }
});

inputReply.addEventListener("keydown", (event) => {
  let value = (<HTMLInputElement>inputReply).value;
  if (event.key === "Enter" && validInput(value)) {
    let rolls = new Chat('Khü').submit(value);
  } 
});

/**
 *
 **/
interface DiceSchema {
  side: number;
  value: number;
  toString: string
}

/**
 *
 **/
class Dice {
  
  private _dice: DiceSchema;

  public constructor(str_dice: string) {
    this._toDice(str_dice);
  }

  private _toDice(str_dice: string) {
    let arr = str_dice.match(/\d/gi);
    let side = (arr.length<2)? 1 : parseInt(arr[0]);
    let value = (arr[1])? this._rollDice(parseInt(arr[1])) : this._rollDice(parseInt(arr[0]));
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
interface ModifiersSchema {
  sum: number,
  toString: string
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
interface RollSchema {
  nb_dices: number,
  dices: Array<DiceSchema>,
  modifiers: ModifiersSchema,
  toString: string,
  sum: number
}

/**
 *
 **/
class Rolls {

  private _rolls: Array<RollSchema> = [];

  public constructor(str_roll: string) {
    let rolls = this._extractRolls(str_roll);
    if (rolls) {
      for (let roll of rolls) {
        let [str_dices, str_modifiers] = this._disjoin(roll);
        let nb_dices = this._nb_dice(str_dices);
        let dices = [];
        let dices_sum = 0;
        let modifiers = new Modifiers(str_modifiers).modifiers();

        for (let i = 0; i < nb_dices; i++) {
          let dice = new Dice(str_dices).dice();
          dices.push(dice);
          dices_sum += dice.value;
        }
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
  }

  public rolls(): Array<RollSchema> {
    return this._rolls;
  }

  private _nb_dice (str_dice: string): number {
    return parseInt(str_dice.match(/^\d*/)[0]) || 1;
  }

  private _calc(dice_value: number, modifiers_value: number): number {
    return dice_value + modifiers_value;
  }

  private _extractRolls(str_rolls: string): Array<string> {
    let words = str_rolls.split(" ");
    let rolls = [];
    for(let word of words) {
      if (this._isRoll(word)) {
        rolls.push(word);
      }
    }
    return (rolls.length)? rolls : [];
  }

  private _disjoin(str_roll: string): Array<string> {
    let regex = /(\+|\-)/g;
    let index = str_roll.search(regex)
    let roll = [str_roll, '0'];
    if(index !== -1) {
      roll = [
        str_roll.slice(0,index),
        str_roll.slice(index)
      ];
    }
    return roll;
  }

  private _isRoll(word: string): boolean {
    if (!this._validChar(word)) return false;
    if (!this._noDuplicateD(word)) return false;
    if (!this._validRollFormat(word)) return false;
    return true;
  }

  private _validChar(word: string): boolean {
    const accepted = /[^d^\d^\+^\-]/gi;
    return (word.search(accepted) === -1)? true : false;
  }

  private _noDuplicateD(word: string): boolean {
    return (!word.match(/d{2,}/gi))? true : false;
  }
  
  private _validRollFormat(word: string): boolean {
    const format = /(\d*?D\d+)(((\+|-)\d+)*)?/gi;
    return (word.match(format))? true : false;
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
    let renderRolls: Array<any> = [];

    for (let roll of this._rolls) {
      let modifiers = roll.modifiers;
      renderRolls = roll.dices.map( dice => renderRoll(dice, modifiers) );
    }
    return renderReply(renderRolls);
  }

  public render () {
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
    <div class="dicetray__reply-username">Khü</div>
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