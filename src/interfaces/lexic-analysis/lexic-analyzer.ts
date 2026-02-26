import type { ILexicAnalysisResult } from "./lexic-analysis-result";
import type { IToken } from "./token";

export interface ILexicAnalyzer extends ILexicAnalyzerConstructor, ILexicAnalyzerMethods {}

export interface ILexicAnalyzerConstructor {
    alphabet: IToken[];
}

interface ILexicAnalyzerMethods {
    analyze(input: string): ILexicAnalysisResult;
}
