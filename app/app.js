/*coucou*/

var buttonReply = document.getElementById("buttonReply");
var inputReply = document.getElementById("inputReply");
var dicetrayReplies = document.getElementById("dicetrayReplies");
var validInput = function (value) {
    return (value) ? true : false;
};
buttonReply.addEventListener("click", function (event) {
    var value = inputReply.value;
    if (validInput(value)) {
        var rolls = new Chat('Khü').submit(value);
    }
});
inputReply.addEventListener("keydown", function (event) {
    var value = inputReply.value;
    if (event.key === "Enter" && validInput(value)) {
        var rolls = new Chat('Khü').submit(value);
    }
});
var Dice = (function () {
    function Dice(str_dice) {
        this._toDice(str_dice);
    }
    Dice.prototype._toDice = function (str_dice) {
        var arr = str_dice.match(/\d/gi);
        var side = (arr.length < 2) ? 1 : parseInt(arr[0]);
        var value = (arr[1]) ? this._rollDice(parseInt(arr[1])) : this._rollDice(parseInt(arr[0]));
        this._dice = {
            side: side,
            value: value,
            toString: str_dice
        };
    };
    Dice.prototype._rollDice = function (side) {
        return Math.floor(Math.random() * side) + 1;
    };
    Dice.prototype.dice = function () {
        return this._dice;
    };
    return Dice;
}());
var Modifiers = (function () {
    function Modifiers(str) {
        this._str = str;
    }
    Modifiers.prototype.modifiers = function () {
        return {
            sum: this.sum(),
            toString: this._str
        };
    };
    Modifiers.prototype.sum = function () {
        var arr = this._str.match(/(\+\d+)|(\-\d+)/g);
        var sum = 0;
        if (arr === null)
            return 0;
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var value = arr_1[_i];
            sum += parseInt(value);
        }
        return sum;
    };
    return Modifiers;
}());
var Rolls = (function () {
    function Rolls(str_roll) {
        this._rolls = [];
        var rolls = this._extractRolls(str_roll);
        if (rolls) {
            for (var _i = 0, rolls_1 = rolls; _i < rolls_1.length; _i++) {
                var roll = rolls_1[_i];
                var _a = this._disjoin(roll), str_dices = _a[0], str_modifiers = _a[1];
                var nb_dices = this._nb_dice(str_dices);
                var dices = [];
                var dices_sum = 0;
                var modifiers = new Modifiers(str_modifiers).modifiers();
                for (var i = 0; i < nb_dices; i++) {
                    var dice = new Dice(str_dices).dice();
                    dices.push(dice);
                    dices_sum += dice.value;
                }
                var r = {
                    nb_dices: nb_dices,
                    dices: dices,
                    modifiers: modifiers,
                    toString: str_roll,
                    sum: this._calc(dices_sum, modifiers.sum)
                };
                this._rolls.push(r);
            }
        }
    }
    Rolls.prototype.rolls = function () {
        return this._rolls;
    };
    Rolls.prototype._nb_dice = function (str_dice) {
        return parseInt(str_dice.match(/^\d*/)[0]) || 1;
    };
    Rolls.prototype._calc = function (dice_value, modifiers_value) {
        return dice_value + modifiers_value;
    };
    Rolls.prototype._extractRolls = function (str_rolls) {
        var words = str_rolls.split(" ");
        var rolls = [];
        for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
            var word = words_1[_i];
            if (this._isRoll(word)) {
                rolls.push(word);
            }
        }
        return (rolls.length) ? rolls : [];
    };
    Rolls.prototype._disjoin = function (str_roll) {
        var regex = /(\+|\-)/g;
        var index = str_roll.search(regex);
        var roll = [str_roll, '0'];
        if (index !== -1) {
            roll = [
                str_roll.slice(0, index),
                str_roll.slice(index)
            ];
        }
        return roll;
    };
    Rolls.prototype._isRoll = function (word) {
        if (!this._validChar(word))
            return false;
        if (!this._noDuplicateD(word))
            return false;
        if (!this._validRollFormat(word))
            return false;
        return true;
    };
    Rolls.prototype._validChar = function (word) {
        var accepted = /[^d^\d^\+^\-]/gi;
        return (word.search(accepted) === -1) ? true : false;
    };
    Rolls.prototype._noDuplicateD = function (word) {
        return (!word.match(/d{2,}/gi)) ? true : false;
    };
    Rolls.prototype._validRollFormat = function (word) {
        var format = /(\d*?D\d+)(((\+|-)\d+)*)?/gi;
        return (word.match(format)) ? true : false;
    };
    return Rolls;
}());
var InputStream = (function () {
    function InputStream(value) {
        if (value) {
            this._rolls = new Rolls(value).rolls();
        }
    }
    InputStream.prototype._reply = function () {
        var renderRolls = [];
        var _loop_1 = function (roll) {
            var modifiers = roll.modifiers;
            renderRolls = roll.dices.map(function (dice) { return renderRoll(dice, modifiers); });
        };
        for (var _i = 0, _a = this._rolls; _i < _a.length; _i++) {
            var roll = _a[_i];
            _loop_1(roll);
        }
        return renderReply(renderRolls);
    };
    InputStream.prototype.render = function () {
        var divReply = document.createElement("div");
        divReply.className = "dicetray__reply";
        divReply.innerHTML = this._reply();
        dicetrayReplies.appendChild(divReply);
        inputReply.value = '';
    };
    return InputStream;
}());
var Chat = (function () {
    function Chat(sender) {
    }
    Chat.prototype._insertReply = function () {
    };
    Chat.prototype.submit = function (str) {
        return new InputStream(str).render();
    };
    return Chat;
}());
var renderReply = function (replies) {
    return "\n    <div class=\"dicetray__reply-username\">Kh\u00FC</div>\n    <div class=\"dicetray__reply-rolls\">\n      " + replies.join('') + "\n    </div>\n  ";
};
var renderRoll = function (dice, modifiers) {
    var roll = {
        side: dice.side,
        dice: dice.value,
        bonus: modifiers.sum,
        sum: dice.value + modifiers.sum
    };
    return "\n    <div class=\"dicetray__roll\">\n      <span class=\"c-side\">" + roll.side + "</span>\n      <span class=\"c-result\"><b>" + roll.dice + "</b> <small>(d\u00E9)</small> + <b>" + roll.bonus + "</b> <small>(bonus)</small> = <b>" + roll.sum + "</b></span>\n    </div>\n  ";
};
//# sourceMappingURL=app.js.map