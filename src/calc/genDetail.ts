const math = require('mathjs');
import { toMixedFraction } from './common'

function splitMixedFraction(mixedFraction: any, output: any[]) {
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
    if (["+","-"].indexOf(formula.op)>=0&&formula.left != undefined && formula.right != undefined) {
        getAdditionItems(formula.left, s, output)
        if (formula.op == "-") {
            s = -s;
        }
        getAdditionItems(formula.right, s, output)
    } else if(["÷","×"].indexOf(formula.op)>=0) {
        var output2: number[] = []
        getMultiplyItems(formula,output2);
    } else {
        splitMixedFraction(math.multiply(formula, s), output);
    }
}

function getMultiplyItems(formula: any, output: number[]) {
    //获取+/-的元素
    if (["÷","×"].indexOf(formula.op)>=0&&formula.left != undefined && formula.right != undefined) {
        getMultiplyItems(formula.left, output)
        getMultiplyItems(formula.right, output)
    } else if(["+","-"].indexOf(formula.op)>=0) {
        var output2: number[] = []
        getAdditionItems(formula,1,output2);
    } else {
        console.log("...",formula);
        output.push(formula);
    }
}


function getIntegersProcess(integers: number[]) {
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

function getNextSimilarly(input: any[]): any[] {
    let maxi = 0, maxj = 0, similar = 0;
    for (let i = 0; i < input.length; ++i) {
        for (let j = i+1; j < input.length; ++j) {
            let s = math.lcm(input[i].d, input[j].d)
            s = s * s / (input[i].d * input[j].d)
            if (s <= similar||similar==0) {
                maxi = i;
                maxj = j;
                similar = s;
            }
            if(similar==1){
                break;
            }
        }
        if(similar==1){
            break;
        }
    }
    if (maxi != maxj) {
        var result = [math.add(input[maxi], input[maxj])]
        for (let i = 0; i < input.length; ++i) {
            if (i != maxi && i != maxj) {
                result.push(input[i])
            }
        }
        return result;
    } else {
        return input;
    }

}

function getFractionsProcess(fractions: any[]) {
    let total = fractions.reduce((accumulator, currentValue) => math.add(accumulator, currentValue), 0);
    // math.format(total, { fraction: 'ratio' })
    let similar = 0;
    console.log("FractionsProcess, start:" + fractions.map((element) => toMixedFraction(element)))
    while (fractions.length>1) {
        fractions = getNextSimilarly(fractions);
        ++similar;
        console.log("FractionsProcess, " + similar + " got:" + fractions.map((element) => toMixedFraction(element)))
    }
    console.log("FractionsProcess,got " + math.format(total, { fraction: 'ratio' }))
}

function getAdditionProcess(formula: any) {
    //获取对人友好的运算过程
    var output: number[] = []
    var pending: any[] = []
    getAdditionItems(formula, 1, output)

    console.log("Process1", output.map((element) => toMixedFraction(element)))
    console.log("pending", pending)

    // let integers = output.filter((number) => math.abs(number) >= 1);
    // let fractions = output.filter((number) => math.abs(number) < 1);
    // getIntegersProcess(integers);
    // getFractionsProcess(fractions)
}


function getMultiplyProcess(formula: any) {
    // //获取+/-的元素
    // if (formula.left != undefined && formula.right != undefined) {
    //     getAdditionItems(formula.left, s, output)
    //     if (formula.op == "-") {
    //         s = -s;
    //     }
    //     getAdditionItems(formula.right, s, output)
    // } else {
    //     splitMixedFraction(math.multiply(formula, s), output);
    // }
}

function getProcess(formula: any):string[]{
    var process = []
    if(["÷","×"].indexOf(formula.op)>=0){
        var lprocess = getProcess(formula.left)
        process.push(...lprocess);
        var rprocess = getProcess(formula.right)
        process.push(...rprocess);
        process.push(formula.left.value+formula.op+formula.left.right)
    }
    return process

}

export { getAdditionProcess }