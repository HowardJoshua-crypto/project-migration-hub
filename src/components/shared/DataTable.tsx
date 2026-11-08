import type { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface Column<T> { header: string; cell: (row: T) => ReactNode; className?: string | undefined }

export function DataTable<T>({ columns, rows, empty = "Nothing here yet." }: { columns: Column<T>[]; rows: T[]; empty?: string | undefined }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60">
            {columns.map((c) => <TableHead key={c.header} className={c.className}>{c.header}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">{empty}</TableCell></TableRow>
          ) : rows.map((r, i) => (
            <TableRow key={i}>
              {columns.map((c) => <TableCell key={c.header} className={c.className}>{c.cell(r)}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
