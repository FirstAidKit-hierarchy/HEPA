import { CheckCircle2, Download } from "lucide-react";
import { ActionButtons, Reveal } from "@/components/common";
import { useSiteContent } from "@/components/providers";
import { Button } from "@/components/ui/button";
import PartnersSection from "@/components/sections/PartnersSection";

const HeroSection = () => {
  const {
    siteContent: {
      home: { hero },
    },
  } = useSiteContent();

  return (
    <section id="home" className="relative overflow-hidden pt-16">
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(36, 48, 66, 0.34) 0%, rgba(24, 36, 52, 0.5) 100%),
            radial-gradient(circle at 78% 18%, rgba(43, 138, 191, 0.2) 0%, transparent 40%)
          `,
        }}
      />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-[#2B8ABF]/16 blur-3xl" />
      <div className="absolute bottom-10 left-0 w-[300px] h-[300px] rounded-full bg-[#7ED957]/10 blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] rounded-full bg-[#2B8ABF]/12 blur-3xl" />
      <div className="section-container relative z-10 py-16 pb-44 sm:py-20 sm:pb-48 lg:py-28 lg:pb-52">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-center lg:gap-12">
          <Reveal className="max-w-3xl">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-sky-50 shadow-[0_10px_30px_rgba(8,15,28,0.18)]">
              {hero.badge}
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_10px_35px_rgba(8,15,28,0.24)] sm:text-5xl lg:text-6xl">
              {hero.title.lead}
              <span className="mt-3 block bg-gradient-to-r from-[#79D3FF] via-[#2B8ABF] to-[#65D1A7] bg-clip-text text-transparent">
                {hero.title.highlight}
              </span>
            </h1>
            <div className="mt-8 flex flex-col gap-4 sm:items-start">
              <ActionButtons primaryCta={hero.primaryCta} primaryClassName="w-full sm:w-auto" />
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full border-white/35 bg-white/[0.03] text-white hover:border-white hover:bg-white hover:text-slate-950 sm:w-auto"
              >
                <a href={hero.downloadCta.href} download={hero.downloadCta.download}>
                  <Download size={18} />
                  {hero.downloadCta.label}
                </a>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {hero.quickPoints.map((point, index) => (
                <Reveal
                  key={point}
                  delay={index * 90}
                  className="rounded-2xl border border-white/12 bg-white/[0.06] p-4 shadow-[0_12px_32px_rgba(8,15,28,0.12)] backdrop-blur-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <CheckCircle2 size={16} className="text-[#7ED957]" />
                    </div>
                    <p className="text-sm font-medium text-slate-100">{point}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160} className="lg:justify-self-end">
            <aside className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(8,15,28,0.5),rgba(8,15,28,0.26))] p-6 shadow-[0_28px_70px_rgba(8,15,28,0.22)] backdrop-blur-2xl sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(43,138,191,0.28),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(126,217,87,0.16),_transparent_30%)]" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#79D3FF]">
                  {hero.summaryCard.eyebrow}
                </p>
                <h2 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-[1.85rem]">
                  {hero.summaryCard.title}
                </h2>
                <div className="mt-6 space-y-4">
                  {hero.summaryCard.items.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/70">{item.label}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-100">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10">
        <PartnersSection embedded />
      </div>
    </section>
  );
};

export default HeroSection;
