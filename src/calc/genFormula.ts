const math = require('mathjs');

function generateRandomNumber(min: number, max: number): any {
    return Math.floor(Math.random() * (max - min) + min);
}

function toMixedFraction(fraction:any,showDecimal:boolean=false) {
    //把数字转换成用户能看懂的带分数
    if(fraction==null||fraction==undefined){
        return "";
    }
    var term;
    if(fraction.d==0){
        term = fraction.n;
    } else{
        var wholePart = Math.floor(fraction.n / fraction.d);
        var remainder = fraction.n % fraction.d;
        var decimal = remainder/fraction.d;
      
        if (decimal === 0) {
            term =  wholePart.toString(); // 整数情况
        }else if (showDecimal && (decimal==0.125||decimal==0.75||decimal==0.25||decimal==0.5||decimal==0.4||decimal==0.6||decimal==0.8)){
            term =  fraction.n / fraction.d;
        } else if(wholePart==0) {
            term =  "'"+remainder + '/' + fraction.d+"'";
        } else {
            term =  wholePart.toString() +" "+"'"+remainder + '/' + fraction.d+"'"; // 带分数情况
        }
    }
    
    if(fraction.s==-1){
        term = "(-"+term+")"
    }
    return term;
  }
  
function fromMixedFraction(input:any){
	if(input === null || input === undefined || input.trim() === ""){
		return null;
	}
    //把带分数字符串换成规范的数字
    if(typeof input === 'string' && input.includes("'")){
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
		return math.fraction(num[0]);
    }
    return math.fraction(input);
}

function generateRandomFraction(min: number, max: number,fraction:boolean,factor=0): any {
    if(!fraction){
        return math.fraction(generateRandomNumber(min,max),1);
    }else{
        // fixme 获取更友好的分数...
        if(factor<=1){
            factor = generateRandomNumber(2,10)*generateRandomNumber(2,10)
        }
        return math.fraction(generateRandomNumber(min,150),factor);
    }
}

function getRandomFactor(x:number){
    const factors = [],offset = Math.ceil(x/2)+1;
    for (let i = 2; i < offset; i++) {
        if (x % i === 0) {
            factors.push(i);
        }
    }
    if(factors.length>0){
        return factors[generateRandomNumber(0,factors.length)];
    }
    return 1;
}

function genNodeFromResult(result:any,minOP:number,maxOp:number,negative:boolean,fraction:boolean,max:any=null){
    //从结果倒推式子

    //op:0+1-2*3/
    var op = generateRandomNumber(minOP,maxOp),mainInt=math.round(result).n,offset=Math.ceil(mainInt/2);
    var left,right,term;
    switch(op){
        case 0:
            var factor = getRandomFactor(result.d);
            if(negative){
                left = generateRandomFraction(mainInt*-1-offset,mainInt+offset,fraction,factor);
            }else{
                left = generateRandomFraction(Math.ceil(mainInt/2),mainInt,fraction,factor);
            }
            right = math.subtract(result,left);
            term = toMixedFraction(left)+"+"+toMixedFraction(right)
            break;
        case 1: 
            var factor = getRandomFactor(result.d);
            if(negative){
                left = generateRandomFraction(mainInt*-1-offset,mainInt+offset,fraction,factor);
            }else{
                if(max==null){
                    left = generateRandomFraction(mainInt+5,mainInt+5+offset,fraction,factor);
                }else{
                    left = generateRandomFraction(mainInt+1,max,fraction);
                }
            }
            right = math.subtract(left,result);
            term = toMixedFraction(left)+"-"+toMixedFraction(right)
            break;
        case 2:
            if(!fraction){
                left = math.fraction(getRandomFactor(mainInt),1)
                right = math.divide(result,left);
            }else{
                //(x1/x2)*(y1/y2)=a/b
                const nfactor = getRandomFactor(result.n) * generateRandomNumber(2,5);
                const dfactor = getRandomFactor(result.d);
                console.log("****",result.n,result.d,nfactor,dfactor)
                left = math.fraction(nfactor,dfactor)
                // right = math.fraction(result.n/nfactor,result.d/dfactor)
                right = math.divide(result,left);
            }
            term = toMixedFraction(left)+"×("+toMixedFraction(right)+")"
            break;
        case 3:
            if(!fraction){
                if(max!=null){
                    right = math.fraction(generateRandomNumber(2,max),1);
                    left  = math.multiply(result,right);
                }
            }else{
                const nfactor = getRandomFactor(result.n);
                const dfactor = getRandomFactor(result.d);
                // console.log("////",result.n,result.d,nfactor,dfactor)
                left = math.fraction(nfactor,dfactor)
                right = math.divide(left,result);
                // right = math.fraction(result.d/dfactor,result.n/nfactor)
            }
            term = toMixedFraction(left)+"÷("+toMixedFraction(right)+")"
            break;
        default:
            break;
    }
    return {"term":term,"value":math.format(result, { fraction: 'ratio' }),"left":left,"right":right,"result":result,"op":op}
}

function genFormula(level:number,size:number) {
    // <option value="1">学前(10以内)</option>
    // <option value="2">1(100以内)</option>
    // <option value="3">2~3(乘除)</option>
    // <option value="4" selected>4~6(小数)</option> 不要出现负数?
    // <option value="7">7(有理数)</option>
    var fraction = false,negative=false,min=1,max=101,minOP=0,maxOP=4,totalMax=null,result=null;
    if(level>3){
        //四年级后这里开始出现乘除、混合运算
        fraction = true;
        if(level>6){
            //这里开始出现负数
            min=generateRandomNumber(-50,-10);
        }
        result = generateRandomFraction(min,max,fraction);
    }else if(level<3){
        //低幼版，不要混合运算了
        size=1;
        //2:加减,4:加减乘除
        maxOP=2;
        if(level<=1){
            min=3;
            max=11;
            totalMax=10;
        }else{
            //100以上加减
            min=10;
        }
        result = generateRandomFraction(min,max,fraction);
    } else{
        //专门考乘除
        minOP=2,min=2,max=10,size=1;
        totalMax=10;
        result = generateRandomFraction(min,max,fraction);
    }
    return genNodeFromResult(result,minOP,maxOP,negative,fraction,totalMax);
    // if(size<=1){
    //     //不出现混合运算
    //     return genLeaf(min,max,factor,negative,generateRandomNumber(minOP,maxOP));
    // }else{
    //     return genNode(min,max,factor,negative,generateRandomNumber(minOP,maxOP))
    // }
}



function checkResult(correct:any,answer:any){
	console.log(typeof correct,correct,fromMixedFraction(correct))
	console.log(typeof answer,answer, fromMixedFraction(answer))
	correct = math.fraction(correct);
    var result = math.equal(correct, math.fraction(answer));
	if(result){
		return null;
	}else{
        var fix = math.fix(correct)
        var fraction = math.subtract(correct,fix)
        return {"main":fix.n*fix.s,"n":fraction.n*fraction.s,"d":fraction.d}
	}
}

const genQuestion = {
    genFormula,
    checkResult,
  }
  
export default genQuestion
export {genFormula,checkResult}