import { useRef } from "react";
import Editor from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import type { languages } from "monaco-editor";
import { Button } from "./button";
import { TokenSuffix, type IToken } from "@/interfaces/lexic-analysis/token";
import { TokenComment } from "@/interfaces/lexic-analysis/token-config";

interface CodeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  alphabet: IToken[];
}

const LANGUAGE_ID = "lalg";

export function CodeTextarea({ value, onChange, alphabet }: CodeTextareaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveCodeAsTxtFile = () => {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "code.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportTxtFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        onChange(content);
      };
      reader.readAsText(file);
    }
  };

  const handleEditorWillMount = (monaco: Monaco) => {
    if (
      monaco.languages
        .getLanguages()
        .some((l: { id: string }) => l.id === LANGUAGE_ID)
    ) {
      return;
    }

    monaco.languages.register({ id: LANGUAGE_ID });

    const dynamicRules: languages.IMonarchLanguageRule[] = alphabet.map(
      (token: IToken): languages.IMonarchLanguageRule => {
        const rawPattern = token.regex.source.replace(/^\^|\$$/g, "");

        let type = "identifier";
        if (token.value.endsWith(TokenSuffix.KEYWORD)) type = "keyword";
        else if (token.value.endsWith(TokenSuffix.OPERATOR)) type = "operator";
        else if (token.value.endsWith(TokenSuffix.LITERAL)) type = "number";
        else if (token.value.endsWith(TokenSuffix.TYPE)) type = "type";
        else if (token.config?.comment === TokenComment.INLINE_START)
          type = "comment";

        if (token.config?.comment === TokenComment.MULTILINE_START) {
          return [
            new RegExp(rawPattern),
            { token: "comment", next: "@comment" },
          ];
        }

        return [new RegExp(rawPattern), type];
      },
    );

    monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, {
      tokenizer: {
        root: dynamicRules,
        comment: [
          [/[^}]+/, "comment"],
          [/\}/, { token: "comment", next: "@pop" }],
        ],
      },
    });
  };

  return (
    <section className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
        >
          Import
        </Button>
        <Button className="flex-1" onClick={saveCodeAsTxtFile}>
          Save
        </Button>
        <input
          type="file"
          accept=".txt"
          onChange={handleImportTxtFile}
          className="hidden"
          ref={fileInputRef}
        />
      </div>

      <div className="border rounded-md overflow-hidden bg-[#1e1e1e] h-125">
        <Editor
          height="100%"
          width="100%"
          defaultLanguage={LANGUAGE_ID}
          theme="vs-dark"
          value={value}
          onChange={(val) => onChange(val || "")}
          beforeMount={handleEditorWillMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10 },
            fontFamily: "JetBrains Mono, Menlo, Monaco, Courier New, monospace",
          }}
        />
      </div>
    </section>
  );
}
