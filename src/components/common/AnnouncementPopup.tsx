import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";

const CAMPAIGN_END_AT = new Date("2026-07-04T23:59:59+03:00").getTime();
const HIDDEN_PATH_PREFIXES = ["/admin", "/password-reset", "/password-reset-email-preview", "/404-preview"];

const AnnouncementPopup = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const hiddenOnRoute = HIDDEN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  useEffect(() => {
    if (hiddenOnRoute) {
      setOpen(false);
      return;
    }

    if (Date.now() > CAMPAIGN_END_AT) {
      setOpen(false);
      return;
    }

    setOpen(true);
  }, [hiddenOnRoute]);

  const closePopup = () => {
    setOpen(false);
  };

  if (hiddenOnRoute) {
    return null;
  }

  return (
    open && (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm">
        <section
          aria-label="HEPA LinkedIn post"
          className="relative w-full max-w-[34rem] overflow-hidden rounded-lg bg-white shadow-[0_28px_90px_rgba(8,15,28,0.36)] sm:max-w-[38rem] lg:max-w-[42rem]"
        >
          <button
            type="button"
            onClick={closePopup}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-slate-950 text-white shadow-[0_10px_28px_rgba(8,15,28,0.38)] transition hover:scale-105 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2"
            aria-label="Close LinkedIn post"
            title="Close"
          >
            <X size={28} strokeWidth={2.6} />
          </button>

          <object
            data="/HEPA%20Linkedin%20Post.pdf#toolbar=0&navpanes=0&scrollbar=0"
            type="application/pdf"
            aria-label="HEPA LinkedIn post"
            className="block aspect-[1/1.08] max-h-[calc(100vh-8rem)] w-full"
          >
            <a
              href="/HEPA%20Linkedin%20Post.pdf"
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[20rem] items-center justify-center p-6 text-center text-sm font-semibold text-accent-blue"
            >
              Open HEPA LinkedIn post
            </a>
          </object>
        </section>
      </div>
    )
  );
};

export default AnnouncementPopup;
