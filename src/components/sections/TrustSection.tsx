import { Database, Globe, Quote, ShieldCheck, Users, Workflow } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/common";
import { useSiteContent } from "@/components/providers";

const trustIcons = {
  globe: Globe,
  workflow: Workflow,
  users: Users,
  shieldCheck: ShieldCheck,
  database: Database,
} as const;

const TrustSection = () => {
  const {
    siteContent: {
      home: { trust },
    },
  } = useSiteContent();

  return (
    <section className="bg-section-gradient py-16 sm:py-20">
      <div className="section-container">
        <Reveal>
          <SectionHeading eyebrow={trust.eyebrow} title={trust.title} description={trust.description} />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {trust.stats.map((stat, index) => (
            <Reveal key={stat.value} delay={index * 80}>
              <article className="h-full rounded-[1.7rem] border border-border/70 bg-card/90 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
                <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{stat.label}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.78fr)]">
          <div className="grid gap-5 sm:grid-cols-2">
            {trust.pillars.map((pillar, index) => {
              const Icon = trustIcons[pillar.iconKey as keyof typeof trustIcons] ?? Globe;

              return (
                <Reveal key={pillar.title} delay={index * 70}>
                  <article className="h-full rounded-[1.8rem] border border-border/70 bg-card/95 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.07)]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue">
                        <Icon size={24} />
                      </div>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-foreground">{pillar.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <div className="space-y-5">
            <Reveal delay={120}>
              <article className="rounded-[1.9rem] border border-border/70 bg-card/95 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.07)] sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Quote size={24} />
                </div>
                <p className="mt-6 text-base leading-8 text-foreground">{trust.testimonial.quote}</p>
                <p className="mt-4 text-sm font-medium text-muted-foreground">{trust.testimonial.attribution}</p>
              </article>
            </Reveal>

            <Reveal delay={200}>
              <article className="rounded-[1.9rem] border border-border/70 bg-background/85 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)] sm:p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-blue">{trust.launchChecklist.eyebrow}</p>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                  {trust.launchChecklist.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
