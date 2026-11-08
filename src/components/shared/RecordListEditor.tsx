import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formValues, useAction } from "@/hooks/use-action";
import { EditSection } from "./EditSection";
import { Field, SelectField, TextareaField } from "./FormField";
import { EmptyState } from "./States";

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "date" | "month" | "url" | "textarea" | "select";
  options?: readonly string[];
  hint?: string;
  placeholder?: string;
  full?: boolean;
}

/** Add / edit / remove a list of passport records through a dialog form. Validation runs in the service. */
export function RecordListEditor<T extends { id: string }>({
  title, visibility, noun, items, fields, toValues, save, remove, render, emptyText, canEdit = true,
}: {
  title: string;
  visibility: string;
  noun: string;
  items: T[];
  fields: FieldDef[];
  toValues: (item: T) => Record<string, string>;
  save: (args: { raw: Record<string, string>; id?: string | undefined }) => Promise<unknown>;
  remove: (id: string) => Promise<unknown>;
  render: (item: T) => ReactNode;
  emptyText: string;
  canEdit?: boolean;
}) {
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const saveAction = useAction(save, { success: `${noun} saved`, onFieldErrors: setErrors, onSuccess: () => setEditing(null) });
  const removeAction = useAction(remove, { success: `${noun} removed` });
  const current = editing && editing !== "new" ? toValues(editing) : {};

  const open = (v: T | "new") => { setErrors({}); setEditing(v); };

  return (
    <EditSection title={title} visibility={visibility} actions={<Button variant="outline" onClick={() => open("new")}><Plus />Add {noun.toLowerCase()}</Button>}>
      {items.length === 0 ? <EmptyState title={`No ${title.toLowerCase()} yet`} text={emptyText} /> : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3 rounded-lg border p-4">
              <div className="min-w-0 flex-1">{render(item)}</div>
              <div className="flex shrink-0 gap-1">
                {canEdit && <Button size="icon" variant="ghost" aria-label={`Edit ${noun.toLowerCase()}`} onClick={() => open(item)}><Pencil /></Button>}
                <Button size="icon" variant="ghost" aria-label={`Remove ${noun.toLowerCase()}`} disabled={removeAction.isPending} onClick={() => { if (window.confirm(`Remove this ${noun.toLowerCase()}?`)) removeAction.mutate(item.id); }}><Trash2 /></Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing === "new" ? `Add ${noun.toLowerCase()}` : `Edit ${noun.toLowerCase()}`}</DialogTitle>
            <DialogDescription>Fields marked in red need fixing before saving.</DialogDescription>
          </DialogHeader>
          <form
            key={editing === "new" ? "new" : editing?.id}
            noValidate
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => { e.preventDefault(); saveAction.mutate({ raw: formValues(e.currentTarget), id: editing && editing !== "new" ? editing.id : undefined }); }}
          >
            {fields.map((f) => {
              const common = { id: f.name, label: f.label, error: errors[f.name], hint: f.hint, defaultValue: current[f.name], className: f.full ? "sm:col-span-2" : undefined };
              if (f.type === "textarea") return <TextareaField key={f.name} {...common} placeholder={f.placeholder} />;
              if (f.type === "select") return <SelectField key={f.name} {...common} options={f.options ?? []} />;
              return <Field key={f.name} {...common} type={f.type ?? "text"} placeholder={f.placeholder} />;
            })}
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={saveAction.isPending}>{saveAction.isPending ? "Saving…" : "Save"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </EditSection>
  );
}
