import { useEffect } from "react";
import { CalendarDays, CreditCard, FileText, Moon, PencilLine, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedHepaLogo } from "@/components/brand";
import { useAppTheme, useSiteContent } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ADMIN_PAGE_PATH } from "@/pages/admin/config";
import { PRIVATE_PAGE_ROBOTS, PRIVATE_PAGE_TITLE } from "./config";

function upsertMeta(name: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  return element;
}

const PrivatePage = () => {
  const { isDark, preference, toggleTheme } = useAppTheme();
  const {
    siteContent: { privatePage: content },
  } = useSiteContent();
  const ThemeIcon = isDark ? Sun : Moon;
  const themeButtonLabel = preference === "system" ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Use system theme";
  const { actions, badge, checklist, description, details, highlight, title } = content;
  const hasAgendaLink = Boolean(actions.agenda.href);
  const hasPaymentLink = Boolean(actions.payment.href);

  useEffect(() => {
    const previousTitle = document.title;
    const robotsMeta = upsertMeta("robots");
    const previousRobots = robotsMeta.getAttribute("content");

    document.title = PRIVATE_PAGE_TITLE;
    robotsMeta.setAttribute("content", PRIVATE_PAGE_ROBOTS);

    return () => {
      document.title = previousTitle;

      if (previousRobots) {
        robotsMeta.setAttribute("content", previousRobots);
        return;
      }

      robotsMeta.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="relative overflow-hidden">
        <div
          className={cn(
            "absolute inset-0",
            "bg-[linear-gradient(180deg,rgba(36,48,66,0.34)_0%,rgba(24,36,52,0.5)_100%),radial-gradient(circle_at_78%_18%,rgba(43,138,191,0.2)_0%,transparent_40%)]",
            "dark:bg-[linear-gradient(180deg,rgba(8,15,28,0.7)_0%,rgba(8,15,28,0.88)_100%),radial-gradient(circle_at_78%_18%,rgba(43,138,191,0.18)_0%,transparent_40%)]",
          )}
        />
        <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-[#2B8ABF]/16 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute bottom-10 left-0 h-40 w-40 rounded-full bg-[#7ED957]/10 blur-3xl sm:h-[18rem] sm:w-[18rem]" />
        <div className="absolute left-1/4 top-1/3 hidden h-[12rem] w-[12rem] rounded-full bg-[#2B8ABF]/12 blur-3xl sm:block" />

        <div className="section-container relative z-10 py-5 sm:py-6">
          <header className="rounded-[1.75rem] border border-white/12 bg-white/[0.08] shadow-[0_20px_60px_rgba(8,15,28,0.18),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-3xl">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:h-16 sm:px-5 sm:py-0">
              <a href="/" className="group inline-flex items-center">
                <AnimatedHepaLogo
                  dark={isDark}
                  className="h-7 sm:h-8"
                  imageClassName="h-7 w-auto transition-transform duration-400 group-hover:scale-105 sm:h-8"
                  autoPlay
                />
              </a>

              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-full border-white/12 bg-white/10 px-3 text-white hover:bg-white/14 hover:text-white"
                >
                  <Link to={ADMIN_PAGE_PATH}>
                    <PencilLine size={15} />
                    Manual edit
                  </Link>
                </Button>
                <button
                  onClick={toggleTheme}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/15"
                  aria-label={themeButtonLabel}
                  title={themeButtonLabel}
                >
                  <ThemeIcon size={16} className="text-[#79D3FF]" />
                </button>
              </div>
            </div>
          </header>

          <div className="py-8 sm:py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center lg:gap-12">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.72rem] font-medium text-sky-50 shadow-[0_10px_30px_rgba(8,15,28,0.18)] sm:px-4 sm:text-sm">
                  {badge}
                </span>
                <h1 className="mt-5 max-w-[11ch] text-[2.55rem] font-extrabold leading-[0.98] tracking-tight text-white drop-shadow-[0_10px_35px_rgba(8,15,28,0.24)] sm:mt-6 sm:max-w-none sm:text-5xl lg:text-6xl">
                  {title}
                  <span className="mt-3 block bg-gradient-to-r from-[#79D3FF] via-[#2B8ABF] to-[#65D1A7] bg-clip-text text-transparent">
                    {highlight}
                  </span>
                </h1>
                <p className="mt-5 max-w-2xl text-[0.98rem] leading-7 text-slate-100/82 sm:mt-6 sm:text-lg sm:leading-8">
                  {description}
                </p>
                <div className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-3">
                  {details.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.4rem] border border-white/12 bg-white/[0.06] p-4 shadow-[0_12px_32px_rgba(8,15,28,0.12)] backdrop-blur-xl"
                    >
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-300/70">{item.label}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-100">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(8,15,28,0.5),rgba(8,15,28,0.26))] p-5 shadow-[0_28px_70px_rgba(8,15,28,0.22)] backdrop-blur-2xl sm:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(43,138,191,0.28),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(126,217,87,0.16),_transparent_30%)]" />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#79D3FF]">Attendee actions</p>
                  <h2 className="mt-4 text-xl font-bold leading-tight text-white sm:text-[1.85rem]">
                    Review the agenda and confirm your seat
                  </h2>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-blue/10 text-[#79D3FF]">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/70">Agenda</p>
                          <p className="mt-1 text-sm font-medium text-white">{hasAgendaLink ? actions.agenda.label : actions.agenda.pendingLabel}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-100">{actions.agenda.note}</p>
                      {hasAgendaLink ? (
                        <Button variant="outline" size="sm" asChild className="mt-4 rounded-full border-white/15 bg-white/[0.08] text-white hover:bg-white/[0.14] hover:text-white">
                          <a href={actions.agenda.href} target="_blank" rel="noreferrer">
                            <CalendarDays size={16} />
                            Open agenda
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled className="mt-4 rounded-full border-white/10 bg-white/[0.05] text-white/70">
                          <CalendarDays size={16} />
                          Agenda pending
                        </Button>
                      )}
                    </div>
                    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-blue/10 text-[#79D3FF]">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/70">Seat confirmation</p>
                          <p className="mt-1 text-sm font-medium text-white">{hasPaymentLink ? actions.payment.label : actions.payment.pendingLabel}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-100">{actions.payment.note}</p>
                      {hasPaymentLink ? (
                        <Button variant="hero" size="sm" asChild className="mt-4 rounded-full px-5 shadow-[0_18px_40px_rgba(126,217,87,0.22)]">
                          <a href={actions.payment.href} target="_blank" rel="noreferrer">
                            <CreditCard size={16} />
                            Confirm seat
                          </a>
                        </Button>
                      ) : (
                        <Button variant="hero" size="sm" disabled className="mt-4 rounded-full px-5">
                          <CreditCard size={16} />
                          Payment pending
                        </Button>
                      )}
                    </div>
                    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/70">Checklist</p>
                      <ul className="mt-4 space-y-3">
                        {checklist.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-100">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7ED957]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivatePage;
