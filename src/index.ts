import calc from './calc'
// console.log(calc.genFormula(1,1))
// console.log(calc.genFormula(1,1))
// console.log(calc.genFormula(2,1))
// console.log(calc.genFormula(2,1))
// console.log(calc.genFormula(3,1))
// console.log(calc.genFormula(3,1))
var level=4,size=1,loop=10;
for(var i=0;i<loop;++i){
    console.log(calc.genFormula(level,size))
}