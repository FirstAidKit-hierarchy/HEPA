import { useEffect, useState } from "react";
import { AlertCircle, Mail, MapPin, Send } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/common";
import { useSiteContent } from "@/components/providers";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  clearContactFormDraft,
  emptyContactFormValues,
  getContactFormEmailApiUrl,
  isValidEmailAddress,
  loadContactFormDraft,
  saveContactFormDraft,
  type ContactFormValues,
} from "@/lib/contact-form";

type FormErrors = Partial<Record<"firstName" | "lastName" | "email", string>>;
type SubmitState = "idle" | "sending" | "sent" | "failed";

const baseFieldClassName =
  "border-white/12 bg-white/10 text-white placeholder:text-slate-300/65 focus:border-accent-blue/40 focus-visible:ring-accent-blue/30";
const fieldLabelClassName = "mb-2 block text-sm font-medium text-slate-100";

const ContactSection = () => {
  const { toast } = useToast();
  const {
    siteContent: {
      home: { contact },
      siteShell: { navigation },
    },
  } = useSiteContent();
  const [formValues, setFormValues] = useState<ContactFormValues>(emptyContactFormValues);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const savedDraft = loadContactFormDraft();

    if (Object.values(savedDraft).some(Boolean)) {
      setFormValues(savedDraft);
    }
  }, []);

  const validateField = (name: keyof FormErrors, value: string) => {
    const trimmed = value.trim();

    if ((name === "firstName" || name === "lastName") && !trimmed) {
      return "This field is required.";
    }

    if (name === "email") {
      if (!trimmed) {
        return "Email is required.";
      }

      if (!isValidEmailAddress(trimmed)) {
        return "Please enter a valid email address.";
      }
    }

    return "";
  };

  const validateForm = (values: ContactFormValues) => {
    const nextErrors: FormErrors = {
      firstName: validateField("firstName", values.firstName),
      lastName: validateField("lastName", values.lastName),
      email: validateField("email", values.email),
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleFieldChange = (name: keyof FormErrors, value: string) => {
    if (submitState !== "idle") {
      setSubmitState("idle");
    }

    setFormValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      return { ...current, [name]: validateField(name, value) };
    });
  };

  const handleValueChange = (name: keyof ContactFormValues, value: string) => {
    if (submitState !== "idle") {
      setSubmitState("idle");
    }

    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm(formValues)) {
      return;
    }

    const requestEmailApiUrl = getContactFormEmailApiUrl();
    const recipientEmail = contact.submissionRecipientEmail.trim().toLowerCase();
    const selectedServiceLabel = contact.serviceOptions.find((option) => option.value === formValues.service)?.label ?? formValues.service;

    if (!requestEmailApiUrl || !isValidEmailAddress(recipientEmail)) {
      console.error("Contact form email delivery is not configured correctly.", {
        hasApiUrl: Boolean(requestEmailApiUrl),
        recipientEmail,
      });
      saveContactFormDraft(formValues);
      setSubmitState("failed");
      toast({
        variant: "destructive",
        title: contact.errorMessage.title,
        description: contact.errorMessage.description,
      });
      return;
    }

    try {
      setSubmitState("sending");

      const response = await fetch(`${requestEmailApiUrl}/send-contact-form-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formValues,
          service: selectedServiceLabel,
          recipientEmail,
          pageUrl: typeof window === "undefined" ? "/contact" : window.location.href,
        }),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || `Contact form request failed (${response.status}).`);
      }

      clearContactFormDraft();
      setFormValues(emptyContactFormValues);
      setErrors({});
      setSubmitState("sent");
      toast({
        title: contact.successMessage.title,
        description: contact.successMessage.description,
      });
    } catch (error) {
      console.error("Unable to send the contact request.", error);
      saveContactFormDraft(formValues);
      setSubmitState("failed");
      toast({
        variant: "destructive",
        title: contact.errorMessage.title,
        description: contact.errorMessage.description,
      });
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-16 sm:py-20"
      style={{
        backgroundColor: "#243042",
        backgroundImage: `
          linear-gradient(180deg, rgba(36, 48, 66, 0.34) 0%, rgba(24, 36, 52, 0.5) 100%),
          radial-gradient(circle at 78% 18%, rgba(43, 138, 191, 0.2) 0%, transparent 40%)
        `,
      }}
    >
      <div className="section-container">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow={contact.eyebrow}
              title={<span className="text-white">{contact.title}</span>}
              description={<span className="text-slate-200/80">{contact.description}</span>}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              {contact.engagementPrompts.map((prompt) => (
                <span
                  key={prompt}
                  className="rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-sm font-medium text-slate-100"
                >
                  {prompt}
                </span>
              ))}
            </div>
            <div className="mt-8 space-y-4">
              {contact.contactItems.map((item) => {
                const Icon = item.iconKey === "mapPin" ? MapPin : Mail;

                return (
                  <div key={item.label} className="flex items-center gap-3 text-sm text-slate-100/85">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-blue/10">
                      <Icon className="text-accent-blue" size={16} />
                    </div>
                    {item.label}
                  </div>
                );
              })}
            </div>
            <div className="mt-8 rounded-[1.9rem] border border-white/12 bg-white/[0.06] p-6 shadow-[0_20px_52px_rgba(8,15,28,0.14)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#79D3FF]">What to include in your brief</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-200/85">
                {contact.briefChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-6 text-slate-300/80">{contact.supportNote}</p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="rounded-[2rem] border border-[#2B8ABF]/20 bg-[rgba(8,15,28,0.55)] p-6 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-8">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#79D3FF]">{contact.formIntro.eyebrow}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{contact.formIntro.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200/80">{contact.formIntro.description}</p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="contact-first-name" className={fieldLabelClassName}>
                      First Name
                    </Label>
                    <Input
                      id="contact-first-name"
                      name="firstName"
                      value={formValues.firstName}
                      placeholder="First Name"
                      required
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? "contact-first-name-error" : undefined}
                      onChange={(event) => handleFieldChange("firstName", event.target.value)}
                      className={`${baseFieldClassName} ${errors.firstName ? "border-rose-400/70 focus-visible:ring-rose-400/40" : ""}`}
                    />
                    {errors.firstName ? (
                      <p id="contact-first-name-error" className="mt-2 text-xs text-rose-200">
                        {errors.firstName}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <Label htmlFor="contact-last-name" className={fieldLabelClassName}>
                      Last Name
                    </Label>
                    <Input
                      id="contact-last-name"
                      name="lastName"
                      value={formValues.lastName}
                      placeholder="Last Name"
                      required
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? "contact-last-name-error" : undefined}
                      onChange={(event) => handleFieldChange("lastName", event.target.value)}
                      className={`${baseFieldClassName} ${errors.lastName ? "border-rose-400/70 focus-visible:ring-rose-400/40" : ""}`}
                    />
                    {errors.lastName ? (
                      <p id="contact-last-name-error" className="mt-2 text-xs text-rose-200">
                        {errors.lastName}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact-company" className={fieldLabelClassName}>
                    Company
                  </Label>
                  <Input
                    id="contact-company"
                    name="company"
                    value={formValues.company}
                    onChange={(event) => handleValueChange("company", event.target.value)}
                    placeholder="Company"
                    className={baseFieldClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-email" className={fieldLabelClassName}>
                    Email
                  </Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formValues.email}
                    placeholder="Email"
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    onChange={(event) => handleFieldChange("email", event.target.value)}
                    className={`${baseFieldClassName} ${errors.email ? "border-amber-300/80 focus-visible:ring-amber-300/35" : ""}`}
                  />
                  {errors.email ? (
                    <div
                      id="contact-email-error"
                      className="mt-2 flex items-start gap-2 rounded-xl border border-amber-300/20 bg-amber-50/10 px-3 py-2 text-xs text-amber-100 backdrop-blur-sm"
                    >
                      <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-200" />
                      <span>{errors.email}</span>
                    </div>
                  ) : null}
                </div>

                <div>
                  <Label htmlFor="contact-phone" className={fieldLabelClassName}>
                    Phone Number
                  </Label>
                  <Input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={formValues.phone}
                    onChange={(event) => handleValueChange("phone", event.target.value)}
                    placeholder="Phone Number"
                    className={baseFieldClassName}
                  />
                </div>

                <div>
                  <Label className={fieldLabelClassName}>Project Need</Label>
                  <Select value={formValues.service} onValueChange={(value) => handleValueChange("service", value)}>
                    <SelectTrigger className={baseFieldClassName}>
                      <SelectValue placeholder="Select a service or request type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contact.serviceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contact-message" className={fieldLabelClassName}>
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={formValues.message}
                    onChange={(event) => handleValueChange("message", event.target.value)}
                    placeholder="Tell us about the team, market, decision, and deliverable you need."
                    className={baseFieldClassName}
                  />
                </div>

                <Button variant="hero" className="w-full" disabled={submitState === "sending"}>
                  {submitState === "sending" ? (
                    "Sending request..."
                  ) : (
                    <>
                      {navigation.primaryCta.label} <Send size={16} />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
