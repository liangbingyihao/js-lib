import { genFormula, checkResult } from './genFormula';
declare const calc: {
    genFormula: typeof genFormula;
    checkResult: typeof checkResult;
};
export default calc;
export { genFormula, checkResult };
