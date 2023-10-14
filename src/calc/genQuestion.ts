const math = require('mathjs');

function toMixedFraction(input:any,showDecimal:boolean) {
    //把数字转换成用户能看懂的带分数
    var fraction = math.fraction(input);
    if(fraction.d==0){
        return fraction.n;
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
  
function fromMixedFraction(input:any){
    //把带分数字符串换成规范的数字
    if(typeof input === 'string'){
        var num = input.trim().replace(/'([^']+)'/g, '$1').split(" ");
        if(num.length==2){
            //带分数12 3/4
            var n = num[0],result,f=math.fraction(num[1]);
            if(n[0][0]==="-"){
                result = math.chain(n).multiply(-1).add(f).multiply(-1).done();
            }else{
                result = math.chain(n).add(f).done();
            }
            console.log(input,result,toMixedFraction(result,false))
            return result
        }
    }
    return math.fraction(input);
}


function generateRandomNumber(min: number, max: number): any {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomFraction(factor:number): any {
    if(factor==0){
        return 0;
    }
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

function generateRationalNumber(min: number, max: number,factor:number,negative:boolean): any{
    // var n = math.fraction(generateRandomNumber(min,max),1);
    var n = generateRandomNumber(min,max);
    var f = generateRandomFraction(factor);
    var s = 1;
    if(negative){
        s = getRandomOp();
    }
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

function genNode(factor:number,negative:boolean){
    var left=generateRationalNumber(0,100,factor,negative),right=generateRationalNumber(0,100,factor,negative),op=getRandomOp();
    return generateNodeStr(left,right,op);
}

function genFormula(level:number) {
    var factor = 0,negative=false;
    if(level>3){
        factor = generateRandomNumber(2,10);
    }
    if(level>6){
        negative=true;
    }
    var result = genNode(factor,negative);
    while(level>0){
        result = generateNodeStr(result,genNode(factor,negative),getRandomOp());
        level--;
    }
    // checkResult(" -1.125 ", -1.8);
    // fromMixedFraction(" -12 0/4 ")
    return result;
}

function checkResult(question:any,answer:any){
	console.log(typeof question,question)
	console.log(typeof answer,answer)
    return math.equal(fromMixedFraction(question), fromMixedFraction(answer));
}
const genQuestion = {
    genFormula,
    checkResult,
  }
  
export default genQuestion
export {genFormula,checkResult}