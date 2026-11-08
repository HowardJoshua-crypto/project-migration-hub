import { createFileRoute } from "@tanstack/react-router";
import { EditSection } from "@/components/shared/EditSection";
import { talent } from "@/mocks/data";

export const Route = createFileRoute("/app/talent/passport/portfolio")({
  component: () => (
    <EditSection title="Portfolio" visibility="PUBLIC" onAdd="Add project">
      <div className="grid gap-4 md:grid-cols-2">{talent.portfolio.map((p) => (
        <div key={p.title} className="rounded-lg border p-5"><div className="font-medium text-heading">{p.title}</div><p className="mt-1 text-sm text-muted-foreground">{p.summary}</p></div>
      ))}</div>
    </EditSection>
  ),
});
