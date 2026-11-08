import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Field({ id, label, type = "text", error, placeholder, defaultValue }: { id: string; label: string; type?: string | undefined; error?: string | undefined; placeholder?: string | undefined; defaultValue?: string | undefined }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} placeholder={placeholder} defaultValue={defaultValue} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className="h-11 bg-card" />
      {error && <p id={`${id}-err`} className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
