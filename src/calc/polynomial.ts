import { number } from "mathjs";
import { generateRandomNumber, generateRandomFraction } from './common'

const variableName = ["x", "y", "z", "m", "n", "a", "b"]

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
    names1.forEach(e1 => {
        names2.forEach(e2 => {
            result.push(e1.concat(e2))
        });
        return e1;
    });
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
    let names = variableName.slice(0, cntVariable);
    // let questions = [],cntMaxNumberOfVariable=Math.min(cntVariable,cntDegree)
    // for (let i = 0; i < cntDegree; ++i) {
    //     questions.push(names[generateRandomNumber(0, cntMaxNumberOfVariable)])
    // }
    var result: any = names.map(function (e) {
        return [e];
    });

    while (cntDegree > 1) {
        result = multiplyByNames(result, names)
        --cntDegree;
    }
    var displayNames = result.map(function (names: any[]) {
        return names.join("");
    })
    var coreNames = result.map(function (names: any[]) {
        return names.sort().join("");
    })
    coreNames = [...new Set(coreNames)]
    return { "core": coreNames, "display": displayNames }
}

function getNames2(cntVariable: number, cntDegree: number) {
    //获取多项式所有可能的变量
    if (cntVariable <= 0) {
        cntVariable = 1;
    }
    if (cntDegree <= 0) {
        cntDegree = 1;
    }
    let names = variableName.slice(0, cntVariable);

    var result = []
    for(let i=0;i<cntDegree;++i){

    }

}
function getCoefficients(coreNames: string[]) {
    return coreNames.map((element) => {
        let c = generateRandomNumber(-3, 4) * generateRandomNumber(2, 5)
        if (c != 0) {
            c += generateRandomNumber(1, 3)
        }
        return c
    })
}

function genPolynomial(cntVariable: number, cntDegree: number) {
    let names = getNames(cntVariable, cntDegree)

    return {"names":names,"coefficients":getCoefficients(names.core)};
}

export { genPolynomial }