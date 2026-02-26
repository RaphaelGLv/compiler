import { useRef } from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";

interface CodeTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function CodeTextarea({ value, onChange }: CodeTextareaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveCodeAsTxtFile = () => {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "code.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImportTxtFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onChange({
          target: { value: content },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      };
      reader.readAsText(file);
    }
  };

  return (
    <section className="flex flex-col gap-1">
      <div className="flex gap-1 ">
        <Button
          className="flex-1"
          onClick={triggerFileInput}
          variant={"outline"}
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
      <Textarea className="resize-none" value={value} onChange={onChange} />
    </section>
  );
}
