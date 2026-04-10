import { useEffect } from "react";
import { AnimatedHepaLogo } from "@/components/brand";
import { useAppTheme, useSiteContent } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NOT_FOUND_TITLE = "404 | HEPA";
const NOT_FOUND_ROBOTS = "noindex,nofollow,noarchive,nosnippet";

function upsertMeta(name: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  return element;
}

const NotFoundPage = () => {
  const { isDark } = useAppTheme();
  const {
    siteContent: { notFoundPage },
  } = useSiteContent();

  useEffect(() => {
    const previousTitle = document.title;
    const robotsMeta = upsertMeta("robots");
    const previousRobots = robotsMeta.getAttribute("content");

    document.title = NOT_FOUND_TITLE;
    robotsMeta.setAttribute("content", NOT_FOUND_ROBOTS);

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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
        <div
          className={cn(
            "absolute inset-0",
            "bg-[linear-gradient(180deg,rgba(36,48,66,0.34)_0%,rgba(24,36,52,0.5)_100%),radial-gradient(circle_at_78%_18%,rgba(43,138,191,0.2)_0%,transparent_40%)]",
            "dark:bg-[linear-gradient(180deg,rgba(8,15,28,0.7)_0%,rgba(8,15,28,0.88)_100%),radial-gradient(circle_at_78%_18%,rgba(43,138,191,0.18)_0%,transparent_40%)]",
          )}
        />
        <div className="absolute right-0 top-12 h-44 w-44 rounded-full bg-[#2B8ABF]/16 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-[#7ED957]/10 blur-3xl sm:h-56 sm:w-56" />

        <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/12 bg-white/[0.08] px-6 py-10 text-center shadow-[0_24px_64px_rgba(8,15,28,0.18),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-3xl sm:px-8 sm:py-12">
          <div className="flex justify-center">
            <AnimatedHepaLogo dark={isDark} className="h-10 sm:h-12" imageClassName="h-10 w-auto sm:h-12" autoPlay />
          </div>

          <p className="mt-8 text-[5rem] font-extrabold leading-none tracking-[-0.06em] text-white sm:text-[6.5rem]">404</p>
          <p className="mt-4 text-lg font-semibold text-slate-100 sm:text-xl">{notFoundPage.title}</p>
          <Button
            variant="outline"
            asChild
            className="mt-6 rounded-full border-white/15 bg-white/[0.08] px-6 text-white hover:bg-white/[0.14] hover:text-white"
          >
            <a href={notFoundPage.buttonHref}>{notFoundPage.buttonLabel}</a>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
