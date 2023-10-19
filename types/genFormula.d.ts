declare function genFormula(level: number, size: number): {
    term: string | undefined;
    value: any;
    left: any;
    right: any;
    result: any;
    op: any;
};
declare function checkResult(correct: any, answer: any): {
    main: number;
    n: number;
    d: any;
} | null;
declare const genQuestion: {
    genFormula: typeof genFormula;
    checkResult: typeof checkResult;
};
export default genQuestion;
export { genFormula, checkResult };
