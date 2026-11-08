import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Common { id: string; label: string; error?: string | undefined; hint?: string | undefined; className?: string | undefined }

function Help({ id, error, hint }: { id: string; error?: string | undefined; hint?: string | undefined }) {
  if (error) return <p id={`${id}-err`} className="text-sm text-destructive">{error}</p>;
  if (hint) return <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>;
  return null;
}
const describedBy = (id: string, error?: string, hint?: string) => (error ? `${id}-err` : hint ? `${id}-hint` : undefined);

export function Field({ id, label, type = "text", error, hint, placeholder, defaultValue, className }: Common & { type?: string | undefined; placeholder?: string | undefined; defaultValue?: string | undefined }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} placeholder={placeholder} defaultValue={defaultValue} aria-invalid={!!error} aria-describedby={describedBy(id, error, hint)} className="h-11 bg-card" />
      <Help id={id} error={error} hint={hint} />
    </div>
  );
}

export function TextareaField({ id, label, error, hint, placeholder, defaultValue, rows = 4, className }: Common & { placeholder?: string | undefined; defaultValue?: string | undefined; rows?: number }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} name={id} rows={rows} placeholder={placeholder} defaultValue={defaultValue} aria-invalid={!!error} aria-describedby={describedBy(id, error, hint)} className="bg-card" />
      <Help id={id} error={error} hint={hint} />
    </div>
  );
}

export function SelectField({ id, label, error, hint, options, defaultValue, placeholder = "Choose…", className }: Common & { options: readonly (string | { value: string; label: string })[]; defaultValue?: string | undefined; placeholder?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Select name={id} {...(defaultValue ? { defaultValue } : {})}>
        <SelectTrigger id={id} className="h-11 bg-card" aria-invalid={!!error} aria-describedby={describedBy(id, error, hint)}><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {options.map((o) => { const v = typeof o === "string" ? o : o.value; const l = typeof o === "string" ? o : o.label; return <SelectItem key={v || "_none"} value={v || "_none"}>{l}</SelectItem>; })}
        </SelectContent>
      </Select>
      <Help id={id} error={error} hint={hint} />
    </div>
  );
}
