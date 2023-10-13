const math = require('mathjs');

function toMixedFraction(fraction:any) {
    const numerator = fraction.n;
    const denominator = fraction.d;
    const wholePart = Math.floor(numerator / denominator);
    const remainder = numerator % denominator;

    var numStr = wholePart.toString();
    if(fraction.s==-1){
        numStr = "-"+wholePart;
    }
  
    if (remainder === 0) {
      return numStr; // 整数情况
    } else {
      return "<"+numStr +" "+ remainder + '/' + denominator+">"; // 带分数情况
    }
  }
  

function generateRandomNumber(min: number, max: number): any {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomFraction(factor:number): any {
    var x = generateRandomNumber(2,10)*generateRandomNumber(2,10);
    var y = factor*generateRandomNumber(2,10);
    console.log("factor:"+factor,x,y);
    return math.fraction(x,y);
}

function getRandomOp() {
    // 生成一个随机布尔值，true 或 false
    const isRandomNumberOne = Math.random() < 0.5;
  
    // 根据随机布尔值返回其中一个数
    return isRandomNumberOne ? -1 : 1;
  }

function generateRationalNumber(min: number, max: number,factor:number): any{
    // var n = math.fraction(generateRandomNumber(min,max),1);
    var n = generateRandomNumber(min,max);
    var f = generateRandomFraction(factor);
    var o = getRandomOp();
    var r = math.chain(n).add(f).multiply(o).done();
    return {"n":n,"d":math.format(f, { fraction: 'ratio' }),"f":f,"s":o,"vaule":r,"term":toMixedFraction(r)};
}

function genNode(){
    var factor = generateRandomNumber(2,10);
    var left=generateRationalNumber(0,100,factor),right=generateRationalNumber(0,100,factor),op=getRandomOp();
    var result,opStr;
    if(op==1){
        opStr = "+";
        result =  math.add(left["vaule"], right["vaule"]);
    }else{
        opStr="-"
        result = math.subtract(left["vaule"], right["vaule"])
    }
    var term = left["term"]+opStr+right["term"];
    return {"left":left,"right":right,"result":result,"term":term,"resultStr":toMixedFraction(result)};
}

function genFormula(...args: number[]) {
//     // 创建分数
// const fraction1 = 1 + math.fraction(1, 2); // 1/2
// const fraction2 = math.fraction(5, 4); // 1/4

// // 分数加法
// const resultAdd = math.add(fraction1, fraction2); // 结果为 3/4

// // 分数减法
// const resultSubtract = math.subtract(fraction1, fraction2); // 结果为 1/4


// console.log("分数加法结果:", math.format(resultAdd, { fraction: 'ratio' }));
// console.log("分数减法结果:", math.format(resultSubtract, { fraction: 'ratio' }));
    var node = genNode()
    console.log(node);
    return node;
}

export default genFormula