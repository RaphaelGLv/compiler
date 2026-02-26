import type { ILexeme, ILexemeError } from "./lexeme";

export interface ILexicAnalysisResult {
    lexemes: ILexeme[];
    errors: ILexemeError[];
}