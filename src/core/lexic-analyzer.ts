import type { ILexicAnalysisResult } from "@/interfaces/lexic-analysis/lexic-analysis-result";
import type {
  ILexicAnalyzer,
  ILexicAnalyzerConstructor,
} from "@/interfaces/lexic-analysis/lexic-analyzer";
import type { IToken } from "@/interfaces/lexic-analysis/token";

export class LexicAnalyzer implements ILexicAnalyzer {
  alphabet: IToken[];
  private masterRegex: RegExp;
  private tokenMap: Map<string, IToken> = new Map();
  private isReadingMultilineComment = false;

  constructor({ alphabet }: ILexicAnalyzerConstructor) {
    this.alphabet = alphabet;

    const patterns = alphabet.map((token, index) => {
      const groupName = `T${index}`;
      this.tokenMap.set(groupName, token);
      const rawSource = token.regex.source.replace(/^\^|\$$/g, "");
      return `(?<${groupName}>${rawSource})`;
    });

    this.masterRegex = new RegExp(`${patterns.join("|")}|(?<INVALID>.)`, "gs");
  }

  analyze(input: string): ILexicAnalysisResult {
    const result: ILexicAnalysisResult = { lexemes: [], errors: [] };
    let line = 0;
    let lastNewLineIndex = -1;
    this.isReadingMultilineComment = false;

    this.masterRegex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = this.masterRegex.exec(input)) !== null) {
      const value = match[0];
      const index = match.index;
      const column = index - lastNewLineIndex;
      const groups = match.groups as Record<string, string | undefined>;

      if (value === "\n") {
        line++;
        lastNewLineIndex = index;
      }

      if (this.isReadingMultilineComment) {
        const groupName = this.getGroupName(groups);
        const token = groupName ? this.tokenMap.get(groupName) : undefined;

        if (token?.config?.comment === "MULTILINE_END") {
          this.isReadingMultilineComment = false;
        }

        continue;
      }

      if (groups.INVALID) {
        result.errors.push({
          value,
          position: [line + 1, column + 1],
          reason: "Invalid lexeme",
        });
        continue;
      }

      const groupName = this.getGroupName(groups);
      const token = groupName ? this.tokenMap.get(groupName) : undefined;

      if (token) {
        if (token.config?.comment === "MULTILINE_START") {
          this.isReadingMultilineComment = true;
          continue;
        }

        if (token.config?.comment === "INLINE_START") {
          const nextNewLine = input.indexOf("\n", index);
          this.masterRegex.lastIndex =
            nextNewLine === -1 ? input.length : nextNewLine;
          continue;
        }

        if (!token.config?.shouldBeIgnored) {
          let hasAnyError = false;

          token.config?.rules?.forEach((rule) => {
            if (!rule.testFunction(value)) {
              hasAnyError = true;
              result.errors.push({
                position: [line + 1, column + 1],
                value,
                reason: rule.errorMessage,
              });
            }
          });

          if (!hasAnyError)
            result.lexemes.push({
              tokenValue: token.value,
              value,
              position: [line + 1, column + 1],
              tokenIndex: this.alphabet.indexOf(token),
            });
        }
      }
    }

    if (this.isReadingMultilineComment) {
      result.errors.push({
        value: "",
        position: [line + 1, 0],
        reason: "EOF: Block comment not closed",
      });
    }

    return result;
  }

  private getGroupName(
    groups: Record<string, string | undefined>,
  ): string | undefined {
    return Object.keys(groups).find(
      (key) => groups[key] !== undefined && key !== "INVALID",
    );
  }
}
