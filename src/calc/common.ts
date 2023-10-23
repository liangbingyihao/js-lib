
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

export { toMixedFraction}