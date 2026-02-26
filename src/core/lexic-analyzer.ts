import type { ILexeme } from "../interfaces/lexic-analysis/lexeme";
import type { ILexicAnalysisResult } from "../interfaces/lexic-analysis/lexic-analysis-result";
import type { ILexicAnalyzer, ILexicAnalyzerConstructor } from "../interfaces/lexic-analysis/lexic-analyzer";
import type { IToken } from "../interfaces/lexic-analysis/token";

export class LexicAnalyzer implements ILexicAnalyzer {
    alphabet: IToken[];

    constructor({
        alphabet,
    }: ILexicAnalyzerConstructor) {
        this.alphabet = alphabet;
    }

    analyze(input: string): ILexicAnalysisResult {
        const result: ILexicAnalysisResult = {
            lexemes: [],
            errors: []
        };
        let lastLexemeIndexAdded = 0;
        
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            const nextChar = input[i + 1];

            const charIsSeparator = this.alphabet.some((token) => 
                token.isSeparator && token.regex.test(char));

            const nextCharIsSeparator = this.alphabet.some((token) => 
                token.isSeparator && token.regex.test(nextChar));

            if (nextCharIsSeparator || (!nextCharIsSeparator && charIsSeparator)) {
                const lexemeValue = input.substring(lastLexemeIndexAdded, i + 1);
                this.addLexeme(result, lexemeValue, [lastLexemeIndexAdded, i + 1]);
                lastLexemeIndexAdded = i + 1;
            }
        }
        
        if (lastLexemeIndexAdded < input.length) {
            const lexemeValue = input.substring(lastLexemeIndexAdded);
            this.addLexeme(result, lexemeValue, [lastLexemeIndexAdded, input.length]);
        }

        return result;
    }

    private addLexeme(lexicAnalysisResult: ILexicAnalysisResult, value: string, columnGap: ILexeme['position']['columnGap']) {
        const lexemeToken = this.alphabet.find((token) => 
            token.regex.test(value));

        if (!lexemeToken) {
            lexicAnalysisResult.errors.push({
                reason: 'Unrecognized token',
                value,
                position: {
                    columnGap
                }
            });
            return;
        }

        const lexemeTokenIndex = this.alphabet.findIndex((token) => 
            token.regex.test(value));

        lexicAnalysisResult.lexemes.push({
            tokenValue:lexemeToken.value,
            value,
            position: {
                columnGap,
                tokenIndex: lexemeTokenIndex
            }
        });
    }
}