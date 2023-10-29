const math = require('mathjs');
import { generateRandomNumber, genNodeFromResult, toMixedFraction, shuffleString } from './common'

const variableName = ["1", "x", "y", "z"]

// 从数组中随机选择n个元素
function getRandomElements(array: any[], n: number) {
    // 复制数组以免修改原始数组
    const copiedArray = [...array];
    const randomElements = [];

    while (randomElements.length < n && copiedArray.length > 0) {
        // 生成一个随机索引
        const randomIndex = Math.floor(Math.random() * copiedArray.length);
        // 从复制的数组中删除并添加到结果中
        randomElements.push(copiedArray.splice(randomIndex, 1)[0]);
    }

    return randomElements;
}


function multiplyByNames(names1: any[], names2: any[]): any[] {
    var result: any[] = []
    for (let i = 0; i < names1.length; ++i) {

        for (let j = 0; j < names2.length; ++j) {
            if (names2[j] >= names1[i]) {
                result.push(names1[i] + names2[j])
            }
        }
    }
    return result;
}

function getNames(cntVariable: number, cntDegree: number) {
    //获取多项式所有可能的变量
    if (cntVariable <= 0) {
        cntVariable = 1;
    }
    if (cntDegree <= 0) {
        cntDegree = 1;
    }
    let names = variableName.slice(0, cntVariable + 1);

    var result: string[] = names;
    for (let i = 1; i < cntDegree; ++i) {
        result = multiplyByNames(names, result)
    }
    result = result.map((element) => element.replace(/1/g, ""))
    return result.sort((e1, e2) => e2.length - e1.length)

}

function getCoefficients(coreNames: string[], cntDegree: number) {
    let first = true, c = 0;
    let coefficients = coreNames.map((element) => {
        if (first) {
            first = false;
            c = generateRandomNumber(1, 4) * generateRandomNumber(2, 3);
        } else {
            let r = generateRandomNumber(1, 3)
            if (r == 2) {
                c = 0;
            } else {
                c = generateRandomNumber(-3, 4) * generateRandomNumber(2, 5) + r
            }
        }
        if (c == 0) {
            return genNodeFromResult(math.fraction(c, 1), 0, 1, true, false, 50);
        } else {
            return genNodeFromResult(math.fraction(c, 1), 0, 1, true, false, 50);
        }
    })
    return coefficients;
}

function getPolynomial(coreNames: string[], coefficients: string[]) {
    var result = []
    for (let i = 0; i < coreNames.length; ++i) {
        let cs: any = coefficients[i];

        if (!math.equal(cs.left, 0)) {
            result.push(toMixedFraction(cs.left) + shuffleString(coreNames[i]))
        }
        if (!math.equal(cs.right, 0)) {
            if (cs.op == "-") {
                result.push(toMixedFraction(math.multiply(-1, cs.right)) + shuffleString(coreNames[i]))
            } else {
                result.push(toMixedFraction(cs.right) + shuffleString(coreNames[i]))
            }
        }
    }
    return result.join("+");

}


function genPolynomial(cntVariable: number, cntDegree: number) {
    let names = getNames(cntVariable, cntDegree)
    let coefficients: any[] = getCoefficients(names, cntDegree);
    let polynomial = getPolynomial(names, coefficients);


    return { "names": names, "coefficients": coefficients, "polynomial": polynomial };
}

export { genPolynomial }