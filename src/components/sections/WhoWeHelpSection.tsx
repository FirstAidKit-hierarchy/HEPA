import { Activity, BarChart3, FlaskConical, Pill, ShieldCheck } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/common";
import { useSiteContent } from "@/components/providers";

const accentStyles = [
  {
    iconWrap: "bg-accent-blue/12 text-accent-blue",
    accentLine: "from-accent-blue/70 to-accent-blue/10",
  },
  {
    iconWrap: "bg-primary/12 text-primary",
    accentLine: "from-primary/70 to-primary/10",
  },
] as const;

const audienceIcons = {
  pill: Pill,
  activity: Activity,
  flaskConical: FlaskConical,
  barChart3: BarChart3,
  shieldCheck: ShieldCheck,
} as const;

const WhoWeHelpSection = () => {
  const {
    siteContent: {
      home: { audiences },
    },
  } = useSiteContent();

  return (
    <section id="who-we-help" className="py-16 sm:py-20">
      <div className="section-container">
        <Reveal>
          <SectionHeading eyebrow={audiences.eyebrow} title={audiences.title} description={audiences.description} />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {audiences.cards.map((card, index) => {
            const accent = accentStyles[index % accentStyles.length];
            const Icon = audienceIcons[card.iconKey as keyof typeof audienceIcons] ?? Pill;

            return (
              <Reveal key={card.title} delay={index * 80}>
                <article className="group h-full overflow-hidden rounded-[1.85rem] border border-border/70 bg-card/90 p-6 shadow-[0_18px_42px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-1 hover:border-accent-blue/20 hover:shadow-[0_28px_62px_rgba(15,23,42,0.1)]">
                  <div className={`inline-flex rounded-2xl p-3 ${accent.iconWrap}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">{card.title}</h3>
                  <div className={`mt-5 h-px w-full bg-gradient-to-r ${accent.accentLine}`} />
                  <dl className="mt-5 space-y-5 text-sm leading-6 text-muted-foreground">
                    <div>
                      <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-foreground/75">Who</dt>
                      <dd className="mt-2">{card.who}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-foreground/75">
                        How HEPA helps
                      </dt>
                      <dd className="mt-2">{card.help}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-foreground/75">Outcome</dt>
                      <dd className="mt-2">{card.outcome}</dd>
                    </div>
                  </dl>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhoWeHelpSection;
