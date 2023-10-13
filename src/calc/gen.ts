const math = require('mathjs');

function generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function genNode(){
    var left=generateRandomNumber(1,100),right=generateRandomNumber(1,100),op=generateRandomNumber(1,3)
    return {"left":left,"right":right,"op":op};
}

function gen(...args: number[]) {
    // 创建分数
const fraction1 = math.fraction(1, 2); // 1/2
const fraction2 = math.fraction(1, 4); // 1/4

// 分数加法
const resultAdd = math.add(fraction1, fraction2); // 结果为 3/4

// 分数减法
const resultSubtract = math.subtract(fraction1, fraction2); // 结果为 1/4


console.log("分数加法结果:", math.format(resultAdd, { fraction: 'ratio' }));
console.log("分数减法结果:", math.format(resultSubtract, { fraction: 'ratio' }));

    return genNode();
}

export default gen