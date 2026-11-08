import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, BarChart3, Briefcase, Building2, FileCheck2, GraduationCap, Handshake, Lock, Search, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { OpportunityCard } from "@/components/shared/OpportunityCard";
import { OpportunitySearch } from "@/components/shared/OpportunitySearch";
import { MockBadge } from "@/components/shared/MockBadge";
import { opportunities } from "@/mocks/data";
import hero from "@/assets/hero-graduates.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillBridge Uganda — Your Skills Deserve an Opportunity" },
      { name: "description", content: "Discover jobs, internships, fellowships and projects in Uganda. Build your Digital Talent Passport and connect with organisations shaping Uganda's future." },
      { property: "og:title", content: "SkillBridge Uganda — Your Skills Deserve an Opportunity" },
      { property: "og:description", content: "Connecting Skills to Opportunities. Building Partnerships for Impact." },
    ],
  }),
  component: Home,
});

const steps = [
  { icon: GraduationCap, title: "Build your passport", text: "Add education, skills, certificates, experience and portfolio in one place." },
  { icon: BadgeCheck, title: "Get verified", text: "Universities and issuers confirm your credentials so employers can trust them." },
  { icon: Search, title: "Discover opportunities", text: "Search jobs, internships, fellowships and projects curated for Uganda." },
  { icon: FileCheck2, title: "Apply with control", text: "Choose exactly what each employer sees. Your submission is locked as sent." },
];
const talentBenefits = ["One reusable professional identity", "Verified credentials employers trust", "Public, private or shared-only sections", "Track every application in one place"];
const employerBenefits = ["Verified organisation profile", "Structured applicant review for your team", "Roles for owners, recruiters and reviewers", "Reach graduates from universities nationwide"];
const stats = [["12,400+", "Talent passports"], ["380", "Verified organisations"], ["2,150", "Opportunities posted"], ["46", "Institutional partners"]];

function Home() {
  return (
    <PublicLayout>
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Connecting Skills to Opportunities</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] text-primary-foreground md:text-6xl">Your Skills Deserve an Opportunity.</h1>
            <p className="mt-5 max-w-lg text-lg text-primary-foreground/80">
              Discover jobs, internships, fellowships and projects. Build your professional identity and connect with organizations shaping Uganda's future.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/opportunities" search={{}}>Explore Opportunities <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="onDark"><Link to="/signup">Create Your Talent Passport</Link></Button>
            </div>
          </div>
          <img src={hero} alt="Young Ugandan graduates working together on a laptop" width={1600} height={1104} className="aspect-[4/3] w-full rounded-2xl object-cover" />
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-4xl px-4">
        <OpportunitySearch />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><MockBadge /><h2 className="mt-2 text-3xl font-bold">Featured opportunities</h2></div>
          <Button asChild variant="outline"><Link to="/opportunities" search={{}}>View all <ArrowRight /></Link></Button>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.slice(0, 3).map((op) => <OpportunityCard key={op.id} op={op} />)}
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-bold">How SkillBridge works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title}>
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground"><s.icon className="size-5" /></span>
                  <span className="text-sm font-semibold text-muted-foreground">Step {i + 1}</span>
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-20 md:grid-cols-2">
        <BenefitCard icon={GraduationCap} title="For students and graduates" items={talentBenefits} to="/talent" cta="Learn about the Talent Passport" />
        <BenefitCard icon={Building2} title="For employers" items={employerBenefits} to="/employers" cta="Hire through SkillBridge" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-8 rounded-2xl border bg-card p-8 md:grid-cols-2 md:p-12">
          <div>
            <Handshake className="size-9 text-primary" />
            <h2 className="mt-4 text-3xl font-bold">Institutional partnerships</h2>
            <p className="mt-3 text-muted-foreground">Universities, NGOs, government agencies and development organisations run employability programmes, verify credentials and measure outcomes for their learners — with consent built in.</p>
            <Button asChild className="mt-6"><Link to="/partners">Become a partner</Link></Button>
          </div>
          <div className="rounded-xl bg-primary-deep p-8 text-primary-foreground">
            <span className="inline-block rounded-md bg-primary px-2 py-1 text-xs font-bold">SDG 17</span>
            <h3 className="mt-4 text-2xl font-bold text-primary-foreground">Partnerships for the Goals</h3>
            <p className="mt-3 text-primary-foreground/80">SkillBridge brings education, industry and development partners onto one platform, so investment in young people turns into measurable employment outcomes across Uganda.</p>
          </div>
        </div>
      </section>

      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center gap-3"><BarChart3 className="size-5 text-primary" /><h2 className="text-2xl font-bold text-primary-foreground">Impact so far</h2><MockBadge label="Illustrative figures" /></div>
          <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map(([v, l]) => <div key={l}><div className="text-4xl font-extrabold">{v}</div><div className="mt-1 text-sm text-primary-foreground/70">{l}</div></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <ShieldCheck className="mx-auto size-9 text-primary" />
        <h2 className="mt-4 text-3xl font-bold">Ready to cross the bridge?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Join thousands of young Ugandans and the organisations investing in them.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg"><Link to="/signup">Create Your Talent Passport</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/employers">I'm hiring</Link></Button>
        </div>
      </section>
    </PublicLayout>
  );
}

function BenefitCard({ icon: Icon, title, items, to, cta }: { icon: typeof Users; title: string; items: string[]; to: "/talent" | "/employers"; cta: string }) {
  return (
    <div className="rounded-2xl border bg-card p-8 shadow-soft">
      <Icon className="size-9 text-primary" />
      <h2 className="mt-4 text-2xl font-bold">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((i) => <li key={i} className="flex gap-2 text-sm"><Lock className="mt-0.5 size-4 shrink-0 text-primary" />{i}</li>)}
      </ul>
      <Button asChild variant="link" className="mt-4 px-0"><Link to={to}>{cta} <ArrowRight /></Link></Button>
    </div>
  );
}
