declare function genFormula(level: number, size: number): {
    term: string;
    resultStr: any;
    op: number;
    left: any;
    right: any;
    vaule: any;
};
declare function checkResult(question: any, answer: any): any;
declare const genQuestion: {
    genFormula: typeof genFormula;
    checkResult: typeof checkResult;
};
export default genQuestion;
export { genFormula, checkResult };
