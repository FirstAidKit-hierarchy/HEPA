import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultEmailTemplates,
  emailTemplateEditorConfig,
  emailTemplatePlaceholderHelp,
  getEmailTemplatePreviewHtml,
  type EmailTemplateKey,
} from "@/lib/emailTemplates";

type EmailTemplatesEditorProps = {
  value: Record<EmailTemplateKey, string>;
  onChange: (nextValue: Record<EmailTemplateKey, string>) => void;
};

const EmailTemplatesEditor = ({ value, onChange }: EmailTemplatesEditorProps) => {
  const [activeTemplateKey, setActiveTemplateKey] = useState<EmailTemplateKey>("passwordReset");
  const activeTemplateConfig =
    emailTemplateEditorConfig.find((template) => template.key === activeTemplateKey) ?? emailTemplateEditorConfig[0];
  const activeTemplateHtml = value[activeTemplateKey] || defaultEmailTemplates[activeTemplateKey];
  const previewHtml = useMemo(
    () => getEmailTemplatePreviewHtml(activeTemplateKey, activeTemplateHtml),
    [activeTemplateHtml, activeTemplateKey],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
        <p className="text-sm font-semibold text-white">Email template types</p>
        <p className="mt-1 text-xs leading-6 text-slate-300/72">
          Edit the HTML stored in Firebase. The Cloudflare Worker reads this HTML when it sends each outbound email.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {emailTemplateEditorConfig.map((template) => {
            const isActive = template.key === activeTemplateKey;

            return (
              <button
                key={template.key}
                type="button"
                onClick={() => setActiveTemplateKey(template.key)}
                className={
                  isActive
                    ? "rounded-full border border-[#79D3FF]/55 bg-[#79D3FF]/12 px-4 py-2 text-sm font-medium text-white"
                    : "rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.06]"
                }
              >
                {template.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)]">
        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{activeTemplateConfig.label}</p>
                <p className="mt-1 text-xs leading-6 text-slate-300/72">{activeTemplateConfig.description}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onChange({
                    ...value,
                    [activeTemplateKey]: defaultEmailTemplates[activeTemplateKey],
                  })
                }
                className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
              >
                <RotateCcw size={16} />
                Restore default
              </Button>
            </div>

            <Textarea
              rows={24}
              value={activeTemplateHtml}
              onChange={(event) =>
                onChange({
                  ...value,
                  [activeTemplateKey]: event.target.value,
                })
              }
              spellCheck={false}
              className="mt-5 min-h-[34rem] border-white/12 bg-[#07111f]/80 font-mono text-[12px] leading-6 text-slate-100 placeholder:text-slate-300/55"
            />
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
            <p className="text-sm font-semibold text-white">Available placeholders</p>
            <p className="mt-1 text-xs leading-6 text-slate-300/72">
              Keep the placeholders you need in the HTML. The app fills them with live values before the email is sent.
            </p>
            <div className="mt-5 grid gap-3">
              {emailTemplatePlaceholderHelp.map((placeholder) => (
                <div key={placeholder.token} className="rounded-[1.1rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="font-mono text-xs text-[#79D3FF]">{placeholder.token}</p>
                  <p className="mt-2 text-xs leading-6 text-slate-300/76">{placeholder.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <p className="text-sm font-semibold text-white">Live preview</p>
          <p className="mt-1 text-xs leading-6 text-slate-300/72">
            This preview uses sample data for the selected template and updates as you type.
          </p>
          <iframe
            title={`${activeTemplateConfig.label} email preview`}
            srcDoc={previewHtml}
            className="mt-5 h-[1080px] w-full rounded-[1.25rem] border border-white/10 bg-background"
          />
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatesEditor;
