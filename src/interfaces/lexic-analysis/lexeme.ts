import type { IToken } from "./token";

export interface ILexeme {
    tokenValue: IToken['value'];
    value: string;
    position: [number, number];
    tokenIndex: number;
}

export interface ILexemeError {
    reason: string;
    value: string;
    position: [number, number];
}
