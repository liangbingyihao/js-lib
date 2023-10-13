import add from './add';
import subtract from './subtract';
import multiply from './multiply';
import divide from './divide';
import gen from './gen';
declare const calc: {
    add: typeof add;
    subtract: typeof subtract;
    multiply: typeof multiply;
    divide: typeof divide;
    gen: typeof gen;
};
export default calc;
export { add, subtract, multiply, divide, gen };
