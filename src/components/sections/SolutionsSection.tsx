import { Reveal, SectionHeading } from "@/components/common";
import { type AccentToken, solutionsContent } from "@/content/home";

const accentClasses: Record<
  AccentToken,
  {
    card: string;
    iconWrap: string;
    icon: string;
    bullet: string;
  }
> = {
  accentBlue: {
    card: "hover:border-accent-blue/40 hover:shadow-accent-blue/5",
    iconWrap: "bg-accent-blue/10 group-hover:bg-accent-blue/20",
    icon: "text-accent-blue",
    bullet: "bg-accent-blue",
  },
  primary: {
    card: "hover:border-primary/40 hover:shadow-primary/5",
    iconWrap: "bg-primary/10 group-hover:bg-primary/20",
    icon: "text-primary",
    bullet: "bg-primary",
  },
};

const SolutionsSection = () => (
  <section id="capabilities" className="bg-section-gradient py-16 sm:py-20">
    <div className="section-container">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(260px,0.42fr)] lg:items-end">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow={solutionsContent.eyebrow}
            title={solutionsContent.title}
            description={solutionsContent.description}
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-[1.8rem] border border-border/70 bg-background/85 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-blue">Why teams use HEPA</p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Combine evidence generation, pricing and access research, stakeholder input, and delivery-ready outputs in one workflow.
            </p>
          </div>
        </Reveal>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6">
          {solutionsContent.cards.map((solution, index) => {
            const accent = accentClasses[solution.accent];

            return (
              <Reveal key={solution.title} delay={index * 90}>
                <article
                  className={`group h-full rounded-[1.8rem] border border-border bg-card p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.1)] sm:p-8 ${accent.card}`}
                >
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-500 ${accent.iconWrap}`}
                  >
                    <solution.icon className={accent.icon} size={24} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground sm:text-xl">{solution.title}</h3>
                  <p className="mb-5 text-sm leading-6 text-muted-foreground">{solution.description}</p>
                  <ul className="space-y-3">
                    {solution.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${accent.bullet}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
      </div>
    </div>
  </section>
);

export default SolutionsSection;
