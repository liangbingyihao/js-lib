import calc from './calc'

var level=7,size=3,loop=10;
for(var i=0;i<loop;++i){
     var result = calc.genFormula(level,size)
     console.log(result);
    //  calc.getAdditionProcess(result)
}

// console.log(calc.genPolynomial(2, 2))
// var level = 7, size = 2, loop = 5;
// for (var i = 1; i < loop; ++i) {
//      for (var j = 1; j < 4; ++j) {
//           console.log(calc.genPolynomial(i, j))
//      }
// }
var level = 7, size = 2, loop = 5;
for (var i = 1; i < loop; ++i) {
     for (var j = 1; j < 4; ++j) {
        //   console.log(calc.genPolynomial(i, j))
          console.log(calc.genPolynomial(2, 2))
     }
}
