import type { IToken } from "./token";

export interface ILexeme {
    tokenValue: IToken['value'];
    value: string;
    position: {
        columnGap: [number, number];
        tokenIndex: number;
    };
}

export interface ILexemeError {
    reason: string;
    value: string;
    position: {
        columnGap: [number, number];
    };
}
