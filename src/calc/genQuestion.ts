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
        return sig+"'"+remainder + '/' + fraction.d+"'";
    } else {
        return sig+wholePart.toString() +" "+"'"+remainder + '/' + fraction.d+"'"; // 带分数情况
    }
  }
  
function splitMixedFraction(input:any){
	//把带分数分成三部分字符串(主体，分子，分母)
	if(typeof input === 'string' && input.includes("'")){
		var num = input.trim().replace(/'([^']+)'/g, '$1').split(" ");
		var result = {"main":"","n":"","d":""},fraction=null;
		if(num.length==2){
			result["main"] = num[0];
			fraction = num[1];
		}else{
			fraction = num[0];
		}
		if(fraction!=null){
			var nd = fraction.split("/");
			result.n=nd[0];
			result.d=nd[1];			
		}
		return result;
	}
	return {"main":input};
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

  function getRandomS() {
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
        s = getRandomS();
    }
    var r = math.chain(n).add(f).multiply(s).done();
    return {"n":n,"d":math.format(f, { fraction: 'ratio' }),"f":f,"s":s,"value":r,"term":toMixedFraction(r,true)};
}

function generateNodeStr(left:any,right:any,op:number){
    //op:0+1-2*3/
    var result,opStr,term;
    if(op==0){
        opStr = "+";
        result =  math.add(left["value"], right["value"]);
        if(right["term"].startsWith("-")||right["term"].startsWith("'-")){
            term = left["term"]+opStr+"("+right["term"]+(")");
        }else{
            term = left["term"]+opStr+right["term"];
        }
    } else if(op==1){
        opStr="-"
        result = math.subtract(left["value"], right["value"])
        if(right.s==1){
            term = left["term"]+opStr+right["term"];
        }else{
            term = left["term"]+opStr+"("+right["term"]+(")");
        }
    } else{
        if(op==2){
            opStr="*"
            result = math.multiply(left["value"], right["value"])
        }else{
            opStr="/"
            result = math.divide(left["value"], right["value"])
        }
        term="";
        // if(left.s==undefined&&!/[^+-]/.test(left["term"])){
        if(left.s==undefined){
            // console.log("left",opStr,left)
            term="("+left["term"]+")"+opStr;
        }else{
            term=left["term"]+opStr;
        }
        if(right.s==undefined){
            // console.log("right",opStr,right)
            term+="("+right["term"]+(")");
        }else{
            term+=right["term"];
        }

    }
    return {"term":term,"resultStr":toMixedFraction(result,false),"op":op,"left":left,"right":right,"value":result};

}

function genLeaf(min:number,max:number,factor:number,negative:boolean,op:number){
    //op:0+1-2*4/,negative:是否有负数，factor：分数的公因数，0表示没有分数
    //返回number[+-*/]number
    //fix min,max应当是控制返回的范围，而不是控制每一个数的范围
    if(op>1){
        //乘法不要出现1
        min = 2;
    }
    var left;
    if(factor==0&&op==3){
        //三年级...要能整除才行
        var right = generateRationalNumber(2,10,factor,negative)
        left = right.n*generateRandomNumber(1,10);
        left = generateRationalNumber(left,left,factor,negative)
        return generateNodeStr(left,right,op);
    }
    left = generateRationalNumber(min,max,factor,negative);
    if(!negative&&op==1){
        //确保不能出现负数
        max = Math.round(left.value);
        if(max==0){
            return left;
        }
    }else if(op==3){
        //不出现0、1
        min = 2;
    }
    return generateNodeStr(left,generateRationalNumber(min,max,factor,negative),op);
}

function genNode(min:number,max:number,factor:number,negative:boolean,numOP:number){
    //op:0+1-2*4/,negative:是否有负数，factor：分数的公因数，0表示没有分数
    //返回leaf[+-*/]leaf
    var left = genLeaf(min,max,factor,negative,generateRandomNumber(0,numOP));
    var op=generateRandomNumber(0,numOP);   
    if(!negative&&op==1){
        //不能出现负数
        max = Math.round(left.value);
    }else if(op==3){
        //不出现0
        min = 1;
    }
    return generateNodeStr(left,genLeaf(min,max,factor,negative,generateRandomNumber(0,numOP)),op);
}

function genFormula(level:number,size:number) {
    // <option value="1">学前(10以内)</option>
    // <option value="2">1(100以内)</option>
    // <option value="3">2~3(乘除)</option>
    // <option value="4" selected>4~6(小数)</option> 不要出现负数?
    // <option value="7">7(有理数)</option>
    var factor = 0,negative=false,min=1,max=101,minOP=0,maxOP=4;
    if(level>3){
        //四年级后这里开始出现乘除、混合运算
        factor = generateRandomNumber(2,10);
    }else if(level<3){
        //低幼版，不要混合运算了
        size=1;
        //2:加减,4:加减乘除
        maxOP=2;
        if(level<=1){
            min=3;
            max=10;
        }else{
            //100以上加减
            min=10;
        }
    } else{
        //专门考乘除
        minOP=2,min=1,max=10,size=1;
    }
    if(level>6){
        //这里开始出现负数
        negative=true;
    }
    if(size<=1){
        //不出现混合运算
        return genLeaf(min,max,factor,negative,generateRandomNumber(minOP,maxOP));
    }else{
        return genNode(min,max,factor,negative,generateRandomNumber(minOP,maxOP))
    }
    // var left = genLeaf(min,max,factor,negative,generateRandomNumber(0,numOP));
    // if(size>1){
    //     var right,op=generateRandomNumber(0,numOP);   
    //     if(!negative&&op==1){
    //         //不能出现负数
    //         max = Math.round(left.value);
    //         if(max==0){
    //             return left;
    //         }
    //         right=genLeaf(min,max,factor,negative,generateRandomNumber(0,numOP));
    //     }else if(op==3){
    //         //不能出现0
    //         right=genLeaf(min,max,factor,negative,generateRandomNumber(0,numOP));
    //     }else{
    //         right=genLeaf(min,max,factor,negative,generateRandomNumber(0,numOP));
    //     }
    //     return generateNodeStr(left,right,op);
    // }
}

function checkResult(correct:any,answer:any){
	console.log(typeof correct,correct,fromMixedFraction(correct))
	console.log(typeof answer,answer, fromMixedFraction(answer))
    var result = math.equal(fromMixedFraction(correct), fromMixedFraction(answer));
	if(result){
		return null;
	}else{
		return splitMixedFraction(correct);
	}
}
const genQuestion = {
    genFormula,
    checkResult,
  }
  
export default genQuestion
export {genFormula,checkResult}