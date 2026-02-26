import type { ILexeme, ILexemeError } from "@/interfaces/lexic-analysis/lexeme";
import type { ILexicAnalysisResult } from "../../../interfaces/lexic-analysis/lexic-analysis-result";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function LexicResultTable({ lexemes, errors }: ILexicAnalysisResult) {
  const list: (ILexeme | ILexemeError)[] = [...lexemes, ...errors].sort(
    (a, b) => {
      if (a.position.columnGap[0] === b.position.columnGap[0]) {
        return a.position.columnGap[0] - b.position.columnGap[0];
      }
      return a.position.columnGap[0] - b.position.columnGap[0];
    },
  );

  const isLexemeError = (
    item: ILexeme | ILexemeError,
  ): item is ILexemeError => {
    return "reason" in item;
  };

  const renderRow = (item: ILexeme | ILexemeError, index: number) => (
    <TableRow
      key={index}
      className={isLexemeError(item) ? "bg-destructive/5" : "hover:bg-muted/50"}
    >
      <TableCell className="py-3 font-medium">{item.value}</TableCell>
      <TableCell
        className={isLexemeError(item) ? "text-destructive" : "text-foreground"}
      >
        {isLexemeError(item) ? item.reason : item.tokenValue}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {item.position.columnGap.join(" : ")}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {isLexemeError(item) ? "" : item.position.tokenIndex}
      </TableCell>
    </TableRow>
  );

  return (
    <Table className="w-full overflow-hidden rounded-xl border bg-card shadow-sm text-center text-xs">
      <TableHeader className="bg-muted/60">
        <TableRow>
          <TableHead className="font-bold uppercase tracking-wide text-center">
            Lexeme
          </TableHead>
          <TableHead className="font-bold uppercase tracking-wide text-center">
            Token
          </TableHead>
          <TableHead className="font-bold uppercase tracking-wide text-center">
            Position (Start Column : End Column)
          </TableHead>
          <TableHead className="font-bold uppercase tracking-wide text-center">
            Token Index
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{list.map((item, index) => renderRow(item, index))}</TableBody>
    </Table>
  );
}
