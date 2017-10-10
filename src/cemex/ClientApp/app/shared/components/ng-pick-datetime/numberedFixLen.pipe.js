"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var NumberFixedLenPipe = (function () {
    function NumberFixedLenPipe() {
    }
    NumberFixedLenPipe.prototype.transform = function (num, len) {
        var number = Math.floor(num);
        var length = Math.floor(len);
        if (num === null || isNaN(number) || isNaN(length)) {
            return num;
        }
        var numString = number.toString();
        while (numString.length < length) {
            numString = '0' + numString;
        }
        return numString;
    };
    return NumberFixedLenPipe;
}());
NumberFixedLenPipe.decorators = [
    { type: core_1.Pipe, args: [{
                name: 'numberFixedLen'
            },] },
];
NumberFixedLenPipe.ctorParameters = function () { return []; };
exports.NumberFixedLenPipe = NumberFixedLenPipe;
//# sourceMappingURL=numberedFixLen.pipe.js.map