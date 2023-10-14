const math = require('mathjs');

function toMixedFraction(fraction:any,showDecimal:boolean) {
    if(fraction.n==0&&fraction.d==0){
        return "0";
    }
    var wholePart = Math.floor(fraction.n / fraction.d);
    var remainder = fraction.n % fraction.d;

    var sig = "";
    if(fraction.s==-1){
        sig = "-";
    }
    var decimal = remainder/fraction.d;
  
    if (decimal === 0) {
      return sig+wholePart.toString(); // 整数情况
    }else if (showDecimal && (decimal==0.125||decimal==0.75||decimal==0.25||decimal==0.5||decimal==0.4||decimal==0.6||decimal==0.8)){
        return sig+fraction.n / fraction.d;
    } else if(wholePart==0) {
        return sig+remainder + '/' + fraction.d;
    } else {
        return "'"+sig+wholePart.toString() +" "+ remainder + '/' + fraction.d+"'"; // 带分数情况
    }
  }
  

function generateRandomNumber(min: number, max: number): any {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomFraction(factor:number): any {
    var x = generateRandomNumber(2,10)*generateRandomNumber(2,10);
    var y = factor*generateRandomNumber(3,7);
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
    var s = getRandomOp();
    var r = math.chain(n).add(f).multiply(s).done();
    return {"n":n,"d":math.format(f, { fraction: 'ratio' }),"f":f,"s":s,"vaule":r,"term":toMixedFraction(r,true)};
}

function generateNodeStr(left:any,right:any,op:number){
    var result,opStr,term;
    if(op==1){
        opStr = "+";
        result =  math.add(left["vaule"], right["vaule"]);
        if(right["term"].startsWith("-")||right["term"].startsWith("'-")){
            term = left["term"]+opStr+"("+right["term"]+(")");
        }else{
            term = left["term"]+opStr+right["term"];
        }
    }else{
        opStr="-"
        result = math.subtract(left["vaule"], right["vaule"])
        term = left["term"]+opStr+"("+right["term"]+(")");
    }
    return {"term":term,"resultStr":toMixedFraction(result,false),"op":op,"left":left,"right":right,"vaule":result};

}

function genNode(factor:number){
    var left=generateRationalNumber(0,100,factor),right=generateRationalNumber(0,100,factor),op=getRandomOp();
    return generateNodeStr(left,right,op);
}

function genFormula(level:number) {
    var factor = generateRandomNumber(2,10);
    var result = genNode(factor);
    while(level>0){
        result = generateNodeStr(result,genNode(factor),getRandomOp());
        level--;
    }
    console.log(checkResult(math.fraction(1,4), 0.25))
    return result;
}

function checkResult(question:any,answer:any){
    var result = math.compare(question, answer)
    console.log(result);
    return result.n===0&&result.d===1;
}
const genQuestion = {
    genFormula,
    checkResult,
  }
  
export default genQuestion
export {genFormula,checkResult}