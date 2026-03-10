import { useState } from "react";
import { LexicAnalyzer } from "./core/lexic-analyzer";
import { LexicResultTable } from "./presentation/lexic-analysis/lexic-result-table/lexic-result-table";
import type { ILexicAnalysisResult } from "./interfaces/lexic-analysis/lexic-analysis-result";
import { CodeTextarea } from "./presentation/components/ui/code-textarea";

const lalgLexicAnalyzer = new LexicAnalyzer({
  alphabet: [
    {
      regex: /^ $/,
      value: "WHITESPACE",
      config: { isSeparator: true, shouldBeIgnored: true },
    },
    {
      regex: /^\n$/,
      value: "NEWLINE",
      config: {
        isSeparator: true,
        shouldBeIgnored: true,
        comment: "INLINE_END",
      },
    },

    {
      regex: /^:=$/,
      value: "ASSIGNMENT_OPERATOR",
    },
    { regex: /^do$/, value: "DO_OPERATOR" },
    { regex: /^or$/, value: "OR_OPERATOR" },
    { regex: /^and$/, value: "AND_OPERATOR" },
    { regex: /^not$/, value: "NOT_OPERATOR" },
    { regex: /^div$/, value: "DIV_OPERATOR" },
    { regex: /^=$/, value: "EQUAL_OPERATOR" },
    {
      regex: /^<>$/,
      value: "NOT_EQUAL_OPERATOR",
    },
    {
      regex: /^<=$/,
      value: "LESS_EQUAL_OPERATOR",
    },
    {
      regex: /^>=$/,
      value: "GREATER_EQUAL_OPERATOR",
    },
    { regex: /^<$/, value: "LESS_OPERATOR" },
    { regex: /^>$/, value: "GREATER_OPERATOR" },

    {
      regex: /^\t$/,
      value: "TAB",
      config: { isSeparator: true, shouldBeIgnored: true },
    },
    { regex: /^;$/, value: "SEMICOLON", config: { isSeparator: true } },
    { regex: /^:$/, value: "COLON" },
    { regex: /^\($/, value: "LEFT_PARENTHESIS", config: { isSeparator: true } },
    {
      regex: /^\)$/,
      value: "RIGHT_PARENTHESIS",
      config: { isSeparator: true },
    },
    { regex: /^\[$/, value: "LEFT_BRACKET", config: { isSeparator: true } },
    { regex: /^\]$/, value: "RIGHT_BRACKET", config: { isSeparator: true } },

    {
      regex: /^\/\/.*$/,
      value: "LINE_COMMENT",
      config: { comment: "INLINE_START" },
    },
    {
      regex: /^{$/,
      value: "LEFT_BRACE",
      config: { isSeparator: true, comment: "MULTILINE_START" },
    },
    {
      regex: /^}$/,
      value: "RIGHT_BRACE",
      config: { isSeparator: true, comment: "MULTILINE_END" },
    },

    { regex: /^program$/, value: "PROGRAM_KEYWORD" },
    { regex: /^begin$/, value: "BEGIN_KEYWORD" },
    { regex: /^end$/, value: "END_KEYWORD" },
    { regex: /^procedure$/, value: "PROCEDURE_KEYWORD" },
    { regex: /^var$/, value: "VAR_KEYWORD" },
    { regex: /^if$/, value: "IF_KEYWORD" },
    { regex: /^then$/, value: "THEN_KEYWORD" },
    { regex: /^else$/, value: "ELSE_KEYWORD" },
    { regex: /^while$/, value: "WHILE_KEYWORD" },
    { regex: /^read$/, value: "READ_KEYWORD" },
    { regex: /^write$/, value: "WRITE_KEYWORD" },

    { regex: /^(\+)$/, value: "ADD_OPERATOR" },
    { regex: /^(-)$/, value: "SUB_OPERATOR" },
    { regex: /^(\*)$/, value: "MUL_OPERATOR" },

    { regex: /^int$/, value: "INT_TYPE" },
    { regex: /^boolean$/, value: "BOOLEAN_TYPE" },

    { regex: /^true$/, value: "TRUE_LITERAL" },
    { regex: /^false$/, value: "FALSE_LITERAL" },
    { regex: /^[0-9]+\.[0-9]+$/, value: "REAL_LITERAL" },
    { regex: /^[0-9]+$/, value: "INTEGER_LITERAL" },

    {
      regex: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      value: "IDENTIFIER",
      config: {
        rules: [
          {
            testFunction: (value) => {
              return value.length <= 10;
            },
            errorMessage: "Identifiers must be at most 10 characters long.",
          },
        ],
      },
    },
  ],
});

function App() {
  const [input, setInput] = useState("");
  const [lexicResult, setLexicResult] = useState<ILexicAnalysisResult>({
    lexemes: [],
    errors: [],
  });

  const handleInputChange = (value: string) => {
    const cleanedValue = value.replace(/\r\n/g, "\n");

    setInput(cleanedValue);

    const result = lalgLexicAnalyzer.analyze(cleanedValue);
    setLexicResult(result);
  };

  return (
    <main className="min-h-dvh p-10 bg-background">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        <form action="" className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">
            Expression
          </div>
          <CodeTextarea
            alphabet={lalgLexicAnalyzer.alphabet}
            value={input}
            onChange={handleInputChange}
          />
        </form>
        <LexicResultTable
          lexemes={lexicResult.lexemes}
          errors={lexicResult.errors}
        />
      </div>
    </main>
  );
}

export default App;
