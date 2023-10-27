const math = require('mathjs');

function toMixedFraction(fraction: any, showDecimal: boolean = false) {
    //把数字转换成用户能看懂的带分数
    if (fraction == null || fraction == undefined) {
        return "";
    }
    var term;
    if (fraction.d == 0) {
        term = fraction.n;
    } else {
        var wholePart = Math.floor(fraction.n / fraction.d);
        var remainder = fraction.n % fraction.d;
        var decimal = remainder / fraction.d;

        if (decimal === 0) {
            term = wholePart.toString(); // 整数情况
        } else if (showDecimal && (decimal == 0.125 || decimal == 0.75 || decimal == 0.25 || decimal == 0.5 || decimal == 0.4 || decimal == 0.6 || decimal == 0.8)) {
            term = fraction.n / fraction.d;
        } else if (wholePart == 0) {
            term = "'" + remainder + '/' + fraction.d + "'";
        } else {
            term = wholePart.toString() + " " + "'" + remainder + '/' + fraction.d + "'"; // 带分数情况
        }
    }

    if (fraction.s == -1) {
        term = "(-" + term + ")"
    }
    return term;
}


function generateRandomNumber(min: number, max: number): any {
    return Math.floor(Math.random() * (max - min) + min);
}


function generateRandomFraction(min: number, max: number, fraction: boolean, factor = 0): any {
    if (!fraction) {
        return math.fraction(generateRandomNumber(min, max), 1);
    } else {
        // fixme 获取更友好的分数...
        if (factor <= 1) {
            factor = generateRandomNumber(2, 10) * generateRandomNumber(2, 10)
        }
        return math.fraction(generateRandomNumber(min, 150), factor);
    }
}


export { toMixedFraction,generateRandomNumber,generateRandomFraction}