import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { cloneValue, siteContentSelectOptions } from "@/content/site/defaults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import AssetUploadButton from "./AssetUploadButton";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isRoutePathField = (fieldPath: string) => /(?:^|\.)(path|aliasPath)$/i.test(fieldPath);

const isImageAssetField = (fieldPath: string) => /(previewImage|imageSrc|lightLogo|logo|src)$/i.test(fieldPath);

const supportsAssetUpload = (fieldPath: string) =>
  !isRoutePathField(fieldPath) && (isImageAssetField(fieldPath) || /(href|url|file)/i.test(fieldPath));

const formatLabel = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\bcta\b/gi, "CTA")
    .replace(/\burl\b/gi, "URL")
    .replace(/\bid\b/gi, "ID")
    .replace(/\s+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());

const isMultilineField = (fieldPath: string, value: string) =>
  !supportsAssetUpload(fieldPath) &&
  (value.length > 80 ||
    /(description|note|quote|message|help|who|outcome|challenge|solution|result|title|location|copyrightLabel)/i.test(
      fieldPath,
    ));

const isLinkField = (fieldPath: string) => /(href|url|path)/i.test(fieldPath);

const getArrayAddSample = (fieldPath: string, arrayTemplate: unknown[], value: unknown[]) => {
  if (fieldPath === "home.partnersSection.items") {
    return {
      name: "New partner",
      lightLogo: "",
      darkLogo: "",
    };
  }

  return arrayTemplate[0] ?? value[0] ?? "";
};

const getSelectOptions = (fieldPath: string) => {
  if (fieldPath.includes("home.audiences") && fieldPath.endsWith("iconKey")) {
    return siteContentSelectOptions.audienceIconKey;
  }

  if (fieldPath.includes("home.solutions") && fieldPath.endsWith("iconKey")) {
    return siteContentSelectOptions.solutionIconKey;
  }

  if (fieldPath.includes("home.trust") && fieldPath.endsWith("iconKey")) {
    return siteContentSelectOptions.trustIconKey;
  }

  if (fieldPath.includes("home.contact") && fieldPath.endsWith("iconKey")) {
    return siteContentSelectOptions.contactIconKey;
  }

  if (fieldPath.endsWith(".type")) {
    return siteContentSelectOptions.proofType;
  }

  if (fieldPath.endsWith(".accent")) {
    return siteContentSelectOptions.accent;
  }

  return null;
};

type SiteContentEditorProps = {
  label: string;
  value: unknown;
  template: unknown;
  path: string[];
  onChange: (nextValue: unknown) => void;
  depth?: number;
};

const SiteContentEditor = ({
  label,
  value,
  template,
  path,
  onChange,
  depth = 0,
}: SiteContentEditorProps) => {
  const fieldPath = path.join(".");
  const selectOptions = getSelectOptions(fieldPath);

  if (Array.isArray(value)) {
    const arrayTemplate = Array.isArray(template) ? template : [];
    const addItem = () => {
      const sample = getArrayAddSample(fieldPath, arrayTemplate, value);
      onChange([...value, cloneValue(sample)]);
    };
    const moveItem = (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= value.length) {
        return;
      }

      const nextItems = [...value];
      const [movedItem] = nextItems.splice(fromIndex, 1);
      nextItems.splice(toIndex, 0, movedItem);
      onChange(nextItems);
    };

    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Label className="text-sm text-white">{label}</Label>
            <p className="mt-1 text-xs leading-6 text-slate-300/66">
              Add, remove, and reorder content blocks by editing this list.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
          >
            <Plus size={16} />
            Add item
          </Button>
        </div>

        <div className="mt-4 space-y-4">
          {value.map((item, index) => {
            const itemTemplate = arrayTemplate[index] ?? arrayTemplate[arrayTemplate.length - 1] ?? item;

            return (
              <div key={`${fieldPath}-${index}`} className="rounded-[1.3rem] border border-white/10 bg-white/[0.05] p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">
                    {label} {index + 1}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveItem(index, index - 1)}
                      disabled={index === 0}
                      className="h-9 w-9 text-slate-200 hover:bg-white/10 hover:text-white disabled:opacity-40"
                    >
                      <ArrowUp size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveItem(index, index + 1)}
                      disabled={index === value.length - 1}
                      className="h-9 w-9 text-slate-200 hover:bg-white/10 hover:text-white disabled:opacity-40"
                    >
                      <ArrowDown size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                      className="text-slate-200 hover:bg-white/10 hover:text-white"
                    >
                      <Trash2 size={16} />
                      Remove
                    </Button>
                  </div>
                </div>
                <SiteContentEditor
                  label={`${label} ${index + 1}`}
                  value={item}
                  template={itemTemplate}
                  path={[...path, String(index)]}
                  onChange={(nextValue) => onChange(value.map((entry, itemIndex) => (itemIndex === index ? nextValue : entry)))}
                  depth={depth + 1}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (isPlainObject(value)) {
    return (
      <div
        className={cn(
          "space-y-4",
          depth === 0 ? "" : "rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5",
        )}
      >
        {depth > 0 ? (
          <div>
            <Label className="text-sm text-white">{label}</Label>
          </div>
        ) : null}
        {Object.entries(value).map(([key, childValue]) => (
          <SiteContentEditor
            key={`${fieldPath}-${key}`}
            label={formatLabel(key)}
            value={childValue}
            template={isPlainObject(template) ? template[key] : undefined}
            path={[...path, key]}
            onChange={(nextValue) =>
              onChange({
                ...(isPlainObject(value) ? value : {}),
                [key]: nextValue,
              })
            }
            depth={depth + 1}
          />
        ))}
      </div>
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-white/10 bg-white/[0.05] px-4 py-3">
        <span className="text-sm font-medium text-white">{label}</span>
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-[#79D3FF]"
        />
      </label>
    );
  }

  const stringValue = typeof value === "string" ? value : String(value ?? "");
  const canUploadAsset = supportsAssetUpload(fieldPath);
  const uploadButtonLabel = isImageAssetField(fieldPath) ? "Upload image" : "Upload file";
  const uploadAccept = isImageAssetField(fieldPath) ? "image/*" : undefined;
  const uploadHint = stringValue.startsWith("data:")
    ? `Inline ${isImageAssetField(fieldPath) ? "image" : "file"} uploaded. Save changes to publish it.`
    : null;

  if (selectOptions) {
    return (
      <div className="space-y-2">
        <Label className="text-sm text-white">{label}</Label>
        <Select value={stringValue} onValueChange={onChange}>
          <SelectTrigger className="border-white/12 bg-white/10 text-white">
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {formatLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (isMultilineField(fieldPath, stringValue)) {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Label className="text-sm text-white">{label}</Label>
          {canUploadAsset ? (
            <AssetUploadButton accept={uploadAccept} label={uploadButtonLabel} onValueChange={(nextValue) => onChange(nextValue)} />
          ) : null}
        </div>
        <Textarea
          rows={4}
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
        />
        {uploadHint ? <p className="text-xs leading-6 text-slate-300/72">{uploadHint}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Label className="text-sm text-white">{label}</Label>
        {canUploadAsset ? (
          <AssetUploadButton accept={uploadAccept} label={uploadButtonLabel} onValueChange={(nextValue) => onChange(nextValue)} />
        ) : null}
      </div>
      <Input
        value={stringValue}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={isLinkField(fieldPath) ? false : undefined}
        placeholder={isLinkField(fieldPath) ? "/page-path, #section, or https://example.com" : undefined}
        className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
      />
      {uploadHint ? <p className="text-xs leading-6 text-slate-300/72">{uploadHint}</p> : null}
    </div>
  );
};

export default SiteContentEditor;
