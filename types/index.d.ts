import { genFormula, checkResult } from './genFormula';
import { getAdditionProcess } from './genDetail';
import { genPolynomial } from './polynomial';
declare const calc: {
    genFormula: typeof genFormula;
    getAdditionProcess: typeof getAdditionProcess;
    checkResult: typeof checkResult;
    genPolynomial: typeof genPolynomial;
};
export default calc;
export { genFormula, checkResult, getAdditionProcess, genPolynomial };
