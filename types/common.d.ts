declare function toMixedFraction(fraction: any, showDecimal?: boolean): any;
declare function generateRandomNumber(min: number, max: number): any;
declare function generateRandomFraction(min: number, max: number, fraction: boolean, factor?: number): any;
declare function genNodeFromResult(result: any, minOP: number, maxOp: number, negative: boolean, fraction: boolean, max?: any): {
    term: string | undefined;
    value: any;
    left: any;
    right: any;
    result: any;
    op: string | undefined;
};
declare function shuffleString(inputString: string): string;
export { toMixedFraction, generateRandomNumber, generateRandomFraction, genNodeFromResult, shuffleString };
