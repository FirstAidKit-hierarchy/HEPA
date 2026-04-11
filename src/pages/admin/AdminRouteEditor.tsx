import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeOptionalPagePath, normalizePagePath, pagePathsMatch } from "@/lib/site-pages";

type RouteAliasEditorProps = {
  aliasPath: string;
  customPagePaths: string[];
  description: string;
  emptyAliasLabel?: string;
  fixedPath: string;
  fixedPathLabel?: string;
  otherBuiltInPaths?: string[];
  placeholder: string;
  title: string;
  onChange: (nextAliasPath: string) => void;
};

const inputClassName = "border-white/12 bg-white/10 text-white placeholder:text-slate-300/55";
const RouteAliasEditor = ({
  aliasPath,
  customPagePaths,
  description,
  emptyAliasLabel = "Disabled",
  fixedPath,
  fixedPathLabel = "Fixed fallback",
  onChange,
  otherBuiltInPaths = [],
  placeholder,
  title,
}: RouteAliasEditorProps) => {
  const normalizedAliasPath = normalizeOptionalPagePath(aliasPath);
  const normalizedFixedPath = normalizePagePath(fixedPath);
  const aliasConflictsWithBuiltIn = normalizedAliasPath
    ? otherBuiltInPaths.some((path) => pagePathsMatch(path, normalizedAliasPath))
    : false;
  const aliasConflictsWithCustomPage = normalizedAliasPath
    ? customPagePaths.some((path) => pagePathsMatch(path, normalizedAliasPath))
    : false;
  const aliasMatchesFixedPath = normalizedAliasPath ? pagePathsMatch(normalizedAliasPath, normalizedFixedPath) : false;

  const applyAliasPath = () => {
    onChange(normalizeOptionalPagePath(aliasPath));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="mt-1 max-w-3xl text-xs leading-6 text-slate-300/72">{description}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
            className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
          >
            <a href={normalizedFixedPath} target="_blank" rel="noreferrer">
              Open fixed route
              <ArrowUpRight size={16} />
            </a>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="space-y-2">
            <Label className="text-sm text-white">Alias path</Label>
            <Input
              value={aliasPath}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyAliasPath();
                }
              }}
              placeholder={placeholder}
              spellCheck={false}
              className={inputClassName}
            />
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={applyAliasPath}
              className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
            >
              <Check size={16} />
              Apply alias
            </Button>
          </div>
        </div>

        <p className="mt-3 text-xs leading-6 text-slate-300/72">
          Apply alias normalizes the path. Leave it empty to disable the editable alias, then use{" "}
          <span className="font-semibold text-white">Save changes</span> to publish it.
        </p>

        <div className="mt-5 rounded-[1.3rem] border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/66">Live routes</p>
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.18em] text-slate-400/70">{fixedPathLabel}</p>
              <p className="mt-1 text-sm font-medium text-white">{normalizedFixedPath}</p>
            </div>
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.18em] text-slate-400/70">Editable alias</p>
              <p className="mt-1 text-sm font-medium text-white">{normalizedAliasPath || emptyAliasLabel}</p>
            </div>
          </div>

          {normalizedAliasPath ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="mt-4 rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
            >
              <a href={normalizedAliasPath} target="_blank" rel="noreferrer">
                Open alias
                <ArrowUpRight size={16} />
              </a>
            </Button>
          ) : null}

          {aliasMatchesFixedPath ? (
            <p className="mt-3 text-xs leading-6 text-amber-200/90">
              This alias matches the fixed admin route, so it does not create a new shortcut.
            </p>
          ) : null}
          {aliasConflictsWithBuiltIn ? (
            <p className="mt-3 text-xs leading-6 text-amber-200/90">
              This alias conflicts with another built-in route. Use a different path.
            </p>
          ) : null}
          {aliasConflictsWithCustomPage ? (
            <p className="mt-3 text-xs leading-6 text-amber-200/90">
              This alias is already used by a custom page. Choose a unique path before publishing.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RouteAliasEditor;
