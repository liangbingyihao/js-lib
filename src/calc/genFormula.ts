const math = require('mathjs');
import { toMixedFraction,generateRandomFraction,genNodeFromResult } from './common'


function generateRandomNumber(min: number, max: number): any {
    return Math.floor(Math.random() * (max - min) + min);
}


function fromMixedFraction(input: any) {
    if (input === null || input === undefined || input.trim() === "") {
        return null;
    }
    //把带分数字符串换成规范的数字
    if (typeof input === 'string' && input.includes("'")) {
        var num = input.trim().replace(/'([^']+)'/g, '$1').split(" ");
        if (num.length == 2) {
            //带分数12 3/4
            var n = num[0], result, f = math.fraction(num[1]);
            if (n[0][0] === "-") {
                result = math.chain(n).multiply(-1).add(f).multiply(-1).done();
            } else {
                result = math.chain(n).add(f).done();
            }
            console.log(input, result, toMixedFraction(result, false))
            return result
        }
        return math.fraction(num[0]);
    }
    return math.fraction(input);
}

// function confuse(formula: any) {
//     //把式子搞复杂点
//     let opStrList = ["÷", "×"];
//     if (formula.op == "÷" && opStrList.indexOf(formula.left.op) >= 0 && opStrList.indexOf(formula.right.op) >= 0) {
//         //全部都是*/的情况
//     }
//     return formula;

// }


function genFormula(level: number, size: number) {
    // <option value="1">学前(10以内)</option>
    // <option value="2">1(100以内)</option>
    // <option value="3">2~3(乘除)</option>
    // <option value="4" selected>4~6(小数)</option> 不要出现负数?
    // <option value="7">7(有理数)</option>
    var fraction = false, negative = false, min = 1, max = 101, minOP = 0, maxOP = 4, totalMax = null, result = null;
    if (level > 3) {
        //四年级后这里开始出现乘除、混合运算
        fraction = true;
        if (level > 6) {
            maxOP = 2;
            //这里开始出现负数
            negative = true
            min = generateRandomNumber(-50, -10);
        }
        result = generateRandomFraction(min, max, fraction);
    } else if (level < 3) {
        //低幼版，不要混合运算了
        // size = 1;
        //2:加减,4:加减乘除
        maxOP = 2;
        if (level <= 1) {
            min = 3;
            max = 11;
            totalMax = 10;
        } else {
            //100以上加减
            min = 10;
        }
        result = generateRandomFraction(min, max, fraction);
    } else {
        //专门考乘除
        minOP = 2, min = 2, max = 20;
        totalMax = 100;
        result = generateRandomFraction(min, max, fraction);
    }
    if (size > 1) {
        //分治方案，获得更多项
        // console.log("result", result);
        var node;
        if (level == 3) {
            //专门搞一个版本是连乘连除的
            // console.log("size>1",result,totalMax)
            node = genNodeFromResult(result, minOP, maxOP, negative, fraction, 50);
        } else {
            node = genNodeFromResult(result, 0, 2, negative, fraction, totalMax);
        }
        // console.log("1/2", node);
        var left = genNodeFromResult(node.left, minOP, maxOP, negative, fraction, totalMax);
        // console.log("1/4", left);
        var right = genNodeFromResult(node.right, minOP, maxOP, negative, fraction, totalMax);
        // console.log("1/4", right);
        var term = "(" + left.term + ")" + node.op + "(" + right.term + ")"
        return { "term": term, "value": math.format(result, { fraction: 'ratio' }), "left": left, "right": right, "result": result, "op": node.op ,"resultStr":toMixedFraction(result)}
    } else {
        return genNodeFromResult(result, minOP, maxOP, negative, fraction, totalMax);
    }
    // if(size<=1){
    //     //不出现混合运算
    //     return genLeaf(min,max,factor,negative,generateRandomNumber(minOP,maxOP));
    // }else{
    //     return genNode(min,max,factor,negative,generateRandomNumber(minOP,maxOP))
    // }
}

function splitMixedFractionStr(fraction: any) {
    //-7/2->-3 1/2
    var result = { "main": "", "n": "", "d": "" }
    if (fraction == null || fraction == undefined) {
        return result;
    }
    if (fraction.d == 0) {
        result["main"] = fraction.n;
    } else {
        let wholePart = Math.floor(fraction.n / fraction.d);
        let remainder = fraction.n % fraction.d;

        result["main"] = wholePart == 0 && remainder != 0 ? "" : wholePart.toString();
        result["n"] = remainder == 0 ? "" : remainder.toString();
        result["d"] = fraction.d.toString();

    }

    if (fraction.s == -1) {
        result["main"] = "-" + result["main"]
    }

    return result;

}


function checkResult(correct: any, answer: any) {
    // console.log(typeof correct,correct,fromMixedFraction(correct))
    // console.log(typeof answer,answer, fromMixedFraction(answer))
    var result;
    correct = math.fraction(correct);
    if (typeof answer == "string" && answer.trim().length > 0) {
        result = math.equal(correct, math.fraction(answer));
    }
    if (result) {
        return null;
    } else {
        return splitMixedFractionStr(correct);
    }
}

const genQuestion = {
    genFormula,
    checkResult,
}

export default genQuestion
export { genFormula, checkResult}