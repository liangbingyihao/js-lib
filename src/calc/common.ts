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
            factor = generateRandomNumber(2, 10) * generateRandomNumber(2, 7)
        }
        return math.fraction(generateRandomNumber(min, 80), factor);
    }
}


function getRandomFactor(x: number) {
    //获取一个随机因数
    const factors = [], offset = Math.ceil(x / 2) + 1;
    for (let i = 2; i < offset; i++) {
        if (x % i === 0) {
            factors.push(i);
        }
    }
    if (factors.length > 0) {
        return factors[generateRandomNumber(0, factors.length)];
    }
    return 1;
}

function isPrime(num: number) {
    if (num <= 1) {
        return false;
    }
    if (num <= 3) {
        return true;
    }
    if (num % 2 === 0 || num % 3 === 0) {
        return false;
    }

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) {
            return false;
        }
    }

    return true;
}


function genNodeFromResult(result: any, minOP: number, maxOp: number, negative: boolean, fraction: boolean, max: any = null) {
    //从结果倒推式子
    //op:0+1-2*3/
    if (isPrime(result.n) && minOP == 2) {
        minOP = 3;
    }
    var op = generateRandomNumber(minOP, maxOp), mainInt = math.round(result).n, offset = Math.ceil(mainInt / 2);
    var left, right, term, opStr;
    switch (op) {
        case 0:
            var factor = getRandomFactor(result.d);
            if (negative) {
                left = generateRandomFraction(mainInt * -1 - offset, mainInt + offset, fraction, factor);
            } else {
                left = generateRandomFraction(Math.ceil(mainInt / 2), mainInt, fraction, factor);
            }
            right = math.subtract(result, left);
            if (right.s == -1 && !negative) {
                opStr = "-"
                right = math.multiply(right, -1);
            } else {
                opStr = "+"
            }
            term = toMixedFraction(left, true) + opStr + toMixedFraction(right, true)
            break;
        case 1:
            var factor = getRandomFactor(result.d);
            if (negative) {
                left = generateRandomFraction(mainInt * -1 - offset, mainInt + offset, fraction, factor);
            } else {
                if (max == null) {
                    left = generateRandomFraction(mainInt + 5, mainInt + 5 + offset, fraction, factor);
                } else {
                    left = generateRandomFraction(mainInt + 1, max, fraction);
                }
            }
            right = math.subtract(left, result);
            if (right.s == -1 && !negative) {
                opStr = "+"
                right = math.multiply(right, -1);
            } else {
                opStr = "-"
            }
            term = toMixedFraction(left, true) + opStr + toMixedFraction(right, true)
            break;
        case 2:
            opStr = "×"
            if (!fraction) {
                left = math.fraction(getRandomFactor(mainInt), 1)
                right = math.divide(result, left);
            } else {
                //(x1/x2)*(y1/y2)=a/b
                const nfactor = getRandomFactor(result.n) * generateRandomNumber(2, 5);
                const dfactor = getRandomFactor(result.d);
                // console.log("****",result.n,result.d,nfactor,dfactor)
                left = math.fraction(nfactor, dfactor)
                // right = math.fraction(result.n/nfactor,result.d/dfactor)
                right = math.divide(result, left);
            }
            let rightTerm = toMixedFraction(right)
            if (true || /^\(.+\)$/.test(rightTerm)) {
                term = toMixedFraction(left, true) + "×" + rightTerm
            } else {
                term = toMixedFraction(left, true) + "×(" + rightTerm + ")"
            }
            break;
        case 3:
            opStr = "÷"
            if (!fraction) {
                if (max == null || max == undefined) {
                    // console.log("*****",max,result);
                    max = 10000;
                }
                // if(result==null||result.n==0){
                //     return null;
                // }
                right = math.fraction(generateRandomNumber(2, Math.floor(max / result.n)), 1);
                if (right.n == 1) {
                    console.log("???", max, result.n)
                }
                left = math.multiply(result, right);
            } else {
                if (result.n == 0) {
                    left = math.fraction(0, 1)
                    if (negative) {
                        right = generateRandomFraction(mainInt * -1 - offset, mainInt + offset, fraction, 13);
                    } else {
                        right = generateRandomFraction(Math.ceil(mainInt / 2), mainInt, fraction, 17);
                    }
                } else {
                    const nfactor = getRandomFactor(result.n);
                    const dfactor = getRandomFactor(result.d);
                    left = math.fraction(nfactor, dfactor)
                    right = math.divide(left, result);
                }
            }
            rightTerm = toMixedFraction(right, true)
            if (true || /^\(.+\)$/.test(rightTerm)) {
                term = toMixedFraction(left, true) + "÷" + rightTerm
            } else {
                term = toMixedFraction(left, true) + "÷(" + rightTerm + ")"
            }
            break;
        default:
            break;
    }
    return { "term": term, "value": math.format(result, { fraction: 'ratio' }), "left": left, "right": right, "result": result, "op": opStr }
}

function shuffleString(inputString: string) {
    // 将字符串转换为字符数组
    const charArray = inputString.split('');
    const n = charArray.length;

    // Fisher-Yates 随机化算法
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [charArray[i], charArray[j]] = [charArray[j], charArray[i]];
    }

    // 将字符数组重新组合成字符串
    const shuffledString = charArray.join('');
    return shuffledString;
}

function replaceWithExponents(inputString: string) {
    return inputString.replace(/([a-zA-Z])\1+/g, (match, group) => {
        return group + '^' + match.length;
    });
}

const commont = {
    toMixedFraction,
    generateRandomNumber,
    generateRandomFraction,
    genNodeFromResult,
    shuffleString,
    replaceWithExponents
}


export default commont
export { toMixedFraction, generateRandomNumber, generateRandomFraction, genNodeFromResult, shuffleString,replaceWithExponents }