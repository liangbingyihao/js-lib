const math = require('mathjs');
import { toMixedFraction } from './common'

function splitMixedFraction(mixedFraction: any, output: number[]) {
    // 提取整数部分
    var integerPart = math.floor(mixedFraction); // 使用 math.floor() 来提取整数部分
    if (mixedFraction.s == -1 && mixedFraction.d > 1) {
        integerPart = math.add(integerPart, 1);
    }
    if (!math.equal(0, integerPart)) {
        output.push(integerPart);
    }
    let fraction = math.subtract(mixedFraction, integerPart);
    if (!math.equal(0, fraction)) {
        output.push(fraction);
    }
}


function getAdditionItems(formula: any, s: number, output: number[]) {
    //获取+/-的元素
    if (formula.left != undefined && formula.right != undefined) {
        getAdditionItems(formula.left, s, output)
        if (formula.op == "-") {
            s = -s;
        }
        getAdditionItems(formula.right, s, output)
    } else {
        splitMixedFraction(math.multiply(formula, s), output);
    }
}

function getIntegersProcess(integers: any[]) {
    // 使用自定义排序函数进行排序
    let total = integers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    integers.sort((a: any, b: any) => {
        const absA = math.abs(a);
        const absB = math.abs(b);
        if (absA < absB) {
            return -1; // a排在b之前
        } else if (absA > absB) {
            return 1; // a排在b之后
        } else {
            return 0; // 顺序无关
        }
    });
    console.log("IntegersProcess ,got " + total, integers.map((element) => toMixedFraction(element)))
}

function getFractionsProcess(fractions: any[]) {
    let total = fractions.reduce((accumulator, currentValue) => math.add(accumulator, currentValue), 0);
    let process = []
    console.log("FractionsProcess,got " + math.format(total, { fraction: 'ratio' }), fractions.map((element) => toMixedFraction(element)))
}

function getAdditionProcess(formula: any) {
    //获取对人友好的运算过程
    var output: number[] = []
    getAdditionItems(formula, 1, output)

    console.log("Process1", output.map((element) => toMixedFraction(element)))

    let integers = output.filter((number) => math.abs(number) >= 1);
    let fractions = output.filter((number) => math.abs(number) < 1);
    getIntegersProcess(integers);
    getFractionsProcess(fractions)
}

export { getAdditionProcess }