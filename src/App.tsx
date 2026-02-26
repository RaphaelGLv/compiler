import { useState } from "react";
import { LexicAnalyzer } from "./core/lexic-analyzer";
import { LexicResultTable } from "./presentation/lexic-analysis/lexic-result-table/lexic-result-table";
import type { ILexicAnalysisResult } from "./interfaces/lexic-analysis/lexic-analysis-result";
import { Input } from "./presentation/components/ui/input";

const calculatorLexicAnalyzer = new LexicAnalyzer({
  alphabet: [
    { regex: /^[0-9]+$/, value: "INTEGER_NUMBER", isSeparator: false },
    { regex: /^[0-9]+\.[0-9]+$/, value: "REAL_NUMBER", isSeparator: false },
    { regex: /^\+$/, value: "PLUS_OPERATOR", isSeparator: true },
    { regex: /^-$/, value: "MINUS_OPERATOR", isSeparator: true },
    { regex: /^\*$/, value: "MULTIPLY_OPERATOR", isSeparator: true },
    { regex: /^\/$/, value: "DIVIDE_OPERATOR", isSeparator: true },
    { regex: /^\($/, value: "OPEN_PARENTHESIS", isSeparator: true },
    { regex: /^\)$/, value: "CLOSE_PARENTHESIS", isSeparator: true },
    { regex: /^ +$/, value: "WHITESPACE", isSeparator: true },
    { regex: /^\n+$/, value: "NEWLINE", isSeparator: true },
    { regex: /^\n+$/, value: "NEWLINE", isSeparator: true },
  ],
});

function App() {
  const [input, setInput] = useState("");
  const [lexicResult, setLexicResult] = useState<ILexicAnalysisResult>({
    lexemes: [],
    errors: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInput(newInput);

    const result = calculatorLexicAnalyzer.analyze(newInput);
    setLexicResult(result);
  };

  return (
    <main className="min-h-dvh p-10 bg-background">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        <form action="" className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Expression</div>
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ex: (12 + 3) / 4"
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
