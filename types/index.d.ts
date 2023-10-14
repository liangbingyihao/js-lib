import add from './add';
import subtract from './subtract';
import multiply from './multiply';
import divide from './divide';
import { genFormula, checkResult } from './genQuestion';
declare const calc: {
    add: typeof add;
    subtract: typeof subtract;
    multiply: typeof multiply;
    divide: typeof divide;
    genFormula: typeof genFormula;
    checkResult: typeof checkResult;
};
export default calc;
export { add, subtract, multiply, divide, genFormula, checkResult };
