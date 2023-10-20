import calc from './calc'
// console.log(calc.genFormula(1,1))
// console.log(calc.genFormula(1,1))
// console.log(calc.genFormula(2,1))
// console.log(calc.genFormula(2,1))
// console.log(calc.genFormula(3,1))
// console.log(calc.genFormula(4,1))
// console.log(calc.checkResult("17/5",'0 17/5'))
var level=3,size=2,loop=10;
for(var i=0;i<loop;++i){
     console.log(calc.genFormula(level,size))
}
// console.log(calc.checkResult("-0 1/5",'0 1/5'))
