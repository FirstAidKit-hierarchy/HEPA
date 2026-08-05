import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CalendarClock,
  CheckCircle2,
  Loader2,
  MapPin,
  MessageSquareText,
  Monitor,
  UserRound,
  Video,
  XCircle,
} from "lucide-react";
import { Footer, Navbar } from "@/components/layout";
import { useAppTheme } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type ExpertInvitation,
  type ExpertInvitationResponseStatus,
  loadExpertInvitation,
  submitExpertInvitationResponse,
} from "@/lib/expert-invitations";
import { cn } from "@/lib/utils";
import { EXPERT_CONFIRMATION_TITLE } from "./config";
import { useParams } from "react-router-dom";

function upsertMeta(name: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  return element;
}

const pageDescription = "Review and submit your HEPA expert participation response.";
const finalStatuses = new Set(["Confirmed", "Declined"]);
const interviewFormatOptions = [
  {
    label: "Microsoft Teams",
    icon: Monitor,
  },
  {
    label: "Zoom",
    icon: Video,
  },
  {
    label: "In Person",
    icon: MapPin,
  },
];

const ExpertConfirmationPage = () => {
  const { projectSlug = "" } = useParams();
  const { theme } = useAppTheme();
  const [invitation, setInvitation] = useState<ExpertInvitation | null>(null);
  const [interviewFormat, setInterviewFormat] = useState("Microsoft Teams");
  const [preferredDateTime, setPreferredDateTime] = useState("");
  const [comments, setComments] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submittingStatus, setSubmittingStatus] = useState<ExpertInvitationResponseStatus | "">("");
  const invitationReference = useMemo(
    () => (typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("ref")?.trim() ?? ""),
    [],
  );
  const timeZone = useMemo(() => {
    if (typeof Intl === "undefined") {
      return "unknown";
    }

    return Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
  }, []);
  const responseIsRecorded = invitation ? finalStatuses.has(invitation.responseStatus) : false;

  useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = upsertMeta("description");
    const previousDescription = descriptionMeta.getAttribute("content");

    document.title = EXPERT_CONFIRMATION_TITLE;
    descriptionMeta.setAttribute("content", pageDescription);

    return () => {
      document.title = previousTitle;

      if (previousDescription) {
        descriptionMeta.setAttribute("content", previousDescription);
        return;
      }

      descriptionMeta.remove();
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (!projectSlug || !invitationReference) {
      setErrorMessage("This confirmation link is incomplete.");
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    setIsLoading(true);
    setErrorMessage("");

    void loadExpertInvitation(projectSlug, invitationReference)
      .then((loadedInvitation) => {
        if (!active) {
          return;
        }

        setInvitation(loadedInvitation);
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : "Unable to load this invitation.");
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [invitationReference, projectSlug]);

  const submitResponse = async (responseStatus: ExpertInvitationResponseStatus) => {
    if (!invitation) {
      return;
    }

    if (responseStatus === "Confirmed" && !interviewFormat) {
      setErrorMessage("Choose an interview format.");
      return;
    }

    if (responseStatus === "Confirmed" && !preferredDateTime) {
      setErrorMessage("Choose a preferred date and time.");
      return;
    }

    try {
      setSubmittingStatus(responseStatus);
      setErrorMessage("");
      const updatedInvitation = await submitExpertInvitationResponse({
        projectSlug,
        invitationReference,
        responseStatus,
        interviewFormat: responseStatus === "Confirmed" ? interviewFormat : "",
        preferredDateTime: responseStatus === "Confirmed" ? preferredDateTime : "",
        comments,
        detectedTheme: theme,
        timeZone,
      });

      setInvitation(updatedInvitation);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit your response.");
    } finally {
      setSubmittingStatus("");
    }
  };

  const renderStatusPanel = () => {
    if (!invitation) {
      return null;
    }

    const isConfirmed = invitation.responseStatus === "Confirmed";
    const StatusIcon = isConfirmed ? CheckCircle2 : XCircle;

    return (
      <div
        className={cn(
          "rounded-lg border p-5",
          isConfirmed
            ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200"
            : "border-slate-200 bg-slate-50 text-slate-800 dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-100",
        )}
      >
        <div className="flex items-start gap-3">
          <StatusIcon size={20} className="mt-1 shrink-0" />
          <div>
            <p className="text-sm font-semibold">
              {isConfirmed ? "Participation confirmed." : "Unable to participate recorded."}
            </p>
            <p className="mt-2 text-sm leading-7 opacity-80">
              Thank you. Your response has been submitted for this HEPA expert invitation.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="overflow-x-clip">
        <section className="relative overflow-hidden pt-24 sm:pt-28">
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(180deg, rgba(36, 48, 66, 0.34) 0%, rgba(24, 36, 52, 0.5) 100%),
                radial-gradient(circle at 78% 18%, rgba(43, 138, 191, 0.2) 0%, transparent 40%)
              `,
            }}
          />
          <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-[#2B8ABF]/16 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#7ED957]/10 blur-3xl sm:h-[18rem] sm:w-[18rem]" />

          <div className="section-container relative z-10 py-14 sm:py-16">
            <div className="max-w-4xl">
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-sky-50 shadow-[0_10px_30px_rgba(8,15,28,0.18)]">
                <UserRound size={16} className="mr-2 text-[#79D3FF]" />
                Expert participation
              </div>
              <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_10px_35px_rgba(8,15,28,0.24)] sm:text-5xl">
                Review your invitation
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-100/82 sm:text-lg">
                Confirm your availability or let the HEPA team know if you are unable to participate.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="section-container">
            <div
              className={cn(
                "mx-auto grid gap-6 lg:items-start",
                isLoading || invitation ? "max-w-5xl lg:grid-cols-[0.88fr_1.12fr]" : "max-w-2xl",
              )}
            >
              <div className="rounded-lg border border-border/70 bg-card p-6 shadow-[0_18px_44px_rgba(15,23,42,0.07)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-blue">Invitation</p>

                {isLoading ? (
                  <div className="mt-6 flex min-h-[14rem] items-center justify-center rounded-lg border border-border/70 bg-background/70">
                    <Loader2 className="animate-spin text-accent-blue" size={22} />
                  </div>
                ) : invitation ? (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-lg border border-border/70 bg-background/70 p-4">
                      <div className="flex items-start gap-3">
                        <UserRound size={18} className="mt-1 shrink-0 text-accent-blue" />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Name</p>
                          <p className="mt-1 text-sm font-semibold leading-6 text-foreground">{invitation.name || "Expert"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border/70 bg-background/70 p-4">
                      <div className="flex items-start gap-3">
                        <Building2 size={18} className="mt-1 shrink-0 text-accent-blue" />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Center</p>
                          <p className="mt-1 text-sm font-semibold leading-6 text-foreground">{invitation.center || "Not listed"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border/70 bg-background/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Project</p>
                      <p className="mt-2 text-sm font-semibold leading-7 text-foreground">{invitation.project}</p>
                    </div>
                    <div className="rounded-lg border border-border/70 bg-background/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Response</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-foreground">
                        {invitation.responseStatus || "Pending"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-lg border border-rose-300/60 bg-rose-50/80 p-4 text-sm leading-7 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={18} className="mt-1 shrink-0" />
                      <span>{errorMessage || "Unable to load this invitation."}</span>
                    </div>
                  </div>
                )}
              </div>

              {isLoading || invitation ? (
              <div className="rounded-lg border border-border/70 bg-card p-6 shadow-[0_18px_44px_rgba(15,23,42,0.07)]">
                {errorMessage && invitation ? (
                  <div className="mb-5 rounded-lg border border-rose-300/60 bg-rose-50/80 p-4 text-sm leading-7 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={18} className="mt-1 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                ) : null}

                {isLoading ? (
                  <div className="flex min-h-[24rem] items-center justify-center rounded-lg border border-border/70 bg-background/70">
                    <Loader2 className="animate-spin text-accent-blue" size={22} />
                  </div>
                ) : invitation && responseIsRecorded ? (
                  renderStatusPanel()
                ) : invitation ? (
                  <form onSubmit={(event) => event.preventDefault()} className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-blue">Interview format</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {interviewFormatOptions.map(({ label, icon: Icon }) => {
                          const selected = interviewFormat === label;

                          return (
                            <button
                              key={label}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => setInterviewFormat(label)}
                              className={cn(
                                "flex min-h-24 flex-col items-start justify-between rounded-lg border p-4 text-left text-sm font-semibold transition-colors",
                                selected
                                  ? "border-accent-blue bg-accent-blue/10 text-foreground"
                                  : "border-border bg-background/70 text-muted-foreground hover:border-accent-blue/60 hover:text-foreground",
                              )}
                            >
                              <Icon size={18} className="text-accent-blue" />
                              <span>{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground" htmlFor="preferred-date-time">
                        <CalendarClock size={16} className="text-accent-blue" />
                        Preferred date and time
                      </label>
                      <Input
                        id="preferred-date-time"
                        type="datetime-local"
                        value={preferredDateTime}
                        onChange={(event) => setPreferredDateTime(event.target.value)}
                      />
                    </div>

                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground" htmlFor="expert-comments">
                        <MessageSquareText size={16} className="text-accent-blue" />
                        Comments
                      </label>
                      <Textarea
                        id="expert-comments"
                        value={comments}
                        onChange={(event) => setComments(event.target.value)}
                        rows={5}
                        maxLength={2000}
                        placeholder="Share scheduling constraints or context for the HEPA team."
                      />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        variant="hero"
                        disabled={Boolean(submittingStatus)}
                        onClick={() => void submitResponse("Confirmed")}
                        className="w-full rounded-full sm:w-auto"
                      >
                        {submittingStatus === "Confirmed" ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                        Confirm Participation
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={Boolean(submittingStatus)}
                        onClick={() => void submitResponse("Declined")}
                        className="w-full rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-200 dark:hover:bg-rose-500/10 sm:w-auto"
                      >
                        {submittingStatus === "Declined" ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                        Unable to Participate
                      </Button>
                    </div>
                  </form>
                ) : null}
              </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertConfirmationPage;
