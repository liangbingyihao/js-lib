declare function genFormula(level: number, size: number): any;
declare function checkResult(correct: any, answer: any): {
    main: any;
} | null;
declare const genQuestion: {
    genFormula: typeof genFormula;
    checkResult: typeof checkResult;
};
export default genQuestion;
export { genFormula, checkResult };
