import type { ReactNode } from "react";
import { DataTable, type Column } from "./DataTable";
import { PageHeader } from "./PageHeader";

export function SimpleTablePage<T>({ title, description, actions, rows, columns, children }: { title: string; description?: string | undefined; actions?: ReactNode | undefined; rows: T[]; columns: Column<T>[]; children?: ReactNode | undefined }) {
  return (
    <>
      <PageHeader title={title} description={description} actions={actions} />
      {children}
      <DataTable rows={rows} columns={columns} />
    </>
  );
}
