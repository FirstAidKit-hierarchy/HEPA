import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, GripVertical, LayoutTemplate, Plus, Trash2 } from "lucide-react";
import {
  createCustomPageBlockDraft,
  createCustomPageDraft,
  type CustomPage,
  type CustomPageBlock,
  type CustomPageBlockType,
} from "@/content/site/defaults";
import { normalizeOptionalPagePath, normalizePagePath } from "@/lib/site-pages";
import { cn } from "@/lib/utils";
import { ADMIN_PAGE_PATH } from "@/pages/admin/config";
import { NOT_FOUND_PREVIEW_PATH } from "@/pages/not-found/config";
import { REFERENCE_PROJECTS_PATH } from "@/pages/reference-projects/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AssetUploadButton from "./AssetUploadButton";

const inputClassName = "border-white/12 bg-white/10 text-white placeholder:text-slate-300/55";
const blockTypeLabels: Record<CustomPageBlockType, string> = {
  hero: "Hero",
  content: "Content",
  checklist: "Checklist",
  cta: "CTA",
};

const reorderById = <T extends { id: string }>(items: T[], draggedId: string, targetId: string) => {
  if (draggedId === targetId) {
    return items;
  }

  const sourceIndex = items.findIndex((item) => item.id === draggedId);
  const targetIndex = items.findIndex((item) => item.id === targetId);

  if (sourceIndex === -1 || targetIndex === -1) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(sourceIndex, 1);
  nextItems.splice(targetIndex, 0, movedItem);
  return nextItems;
};

const StringListEditor = ({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (nextItems: string[]) => void;
}) => (
  <div className="space-y-3 md:col-span-2">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Label className="text-sm text-white">{label}</Label>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, ""])}
        className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
      >
        <Plus size={14} />
        Add item
      </Button>
    </div>

    {items.length ? (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex items-center gap-3">
            <Input
              value={item}
              onChange={(event) =>
                onChange(items.map((entry, itemIndex) => (itemIndex === index ? event.target.value : entry)))
              }
              placeholder="List item"
              className={inputClassName}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              className="h-10 w-10 shrink-0 text-slate-200 hover:bg-white/10 hover:text-white"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    ) : (
      <div className="rounded-[1.2rem] border border-dashed border-white/12 bg-white/[0.03] px-4 py-3 text-xs leading-6 text-slate-300/72">
        No list items yet.
      </div>
    )}
  </div>
);

type CustomPagesEditorProps = {
  notFoundAliasPath: string;
  value: CustomPage[];
  onChange: (nextValue: CustomPage[]) => void;
  selectedPageId: string | null;
  onSelectedPageIdChange: (pageId: string | null) => void;
};

const CustomPagesEditor = ({
  notFoundAliasPath,
  value,
  onChange,
  selectedPageId,
  onSelectedPageIdChange,
}: CustomPagesEditorProps) => {
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const normalizedNotFoundAliasPath = normalizeOptionalPagePath(notFoundAliasPath);
  const reservedPaths = new Set(
    [
      normalizePagePath("/"),
      normalizePagePath(ADMIN_PAGE_PATH),
      normalizePagePath(NOT_FOUND_PREVIEW_PATH),
      normalizePagePath(REFERENCE_PROJECTS_PATH),
      normalizedNotFoundAliasPath,
    ].filter(Boolean),
  );

  useEffect(() => {
    if (!value.length) {
      if (selectedPageId !== null) {
        onSelectedPageIdChange(null);
      }

      return;
    }

    if (!selectedPageId || !value.some((page) => page.id === selectedPageId)) {
      onSelectedPageIdChange(value[0].id);
    }
  }, [onSelectedPageIdChange, selectedPageId, value]);

  const selectedPage = value.find((page) => page.id === selectedPageId) ?? value[0] ?? null;
  const duplicatePathCount = useMemo(() => {
    const pathCounts = new Map<string, number>();

    value.forEach((page) => {
      const normalizedPath = normalizePagePath(page.path);
      pathCounts.set(normalizedPath, (pathCounts.get(normalizedPath) ?? 0) + 1);
    });

    return pathCounts;
  }, [value]);

  const commitPages = (nextPages: CustomPage[], nextSelectedPageId: string | null = selectedPageId) => {
    onChange(nextPages);
    onSelectedPageIdChange(nextSelectedPageId ?? nextPages[0]?.id ?? null);
  };

  const addNewPage = () => {
    const nextPage = createCustomPageDraft();
    commitPages([...value, nextPage], nextPage.id);
  };

  const updateSelectedPage = (updater: (page: CustomPage) => CustomPage) => {
    if (!selectedPage) {
      return;
    }

    commitPages(
      value.map((page) => (page.id === selectedPage.id ? updater(page) : page)),
      selectedPage.id,
    );
  };

  const updateSelectedPageBlock = (blockId: string, updater: (block: CustomPageBlock) => CustomPageBlock) => {
    updateSelectedPage((page) => ({
      ...page,
      blocks: page.blocks.map((block) => (block.id === blockId ? updater(block) : block)),
    }));
  };

  const selectedPath = selectedPage ? normalizePagePath(selectedPage.path) : "/";
  const selectedPathIsDuplicate = selectedPage ? (duplicatePathCount.get(selectedPath) ?? 0) > 1 : false;
  const selectedPathIsReserved = reservedPaths.has(selectedPath);
  const applySelectedPagePath = () => {
    if (!selectedPage) {
      return;
    }

    updateSelectedPage((page) => ({
      ...page,
      path: normalizePagePath(page.path),
    }));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Page list</p>
              <p className="mt-1 text-xs leading-6 text-slate-300/72">
                Add, edit, preview, and reorder your custom pages here.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addNewPage}
              className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
            >
              <Plus size={16} />
              Add page
            </Button>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Custom pages</p>
              <p className="mt-1 text-xs leading-6 text-slate-300/72">
                Drag these cards to reorder them, then edit the selected page on the right.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addNewPage}
              className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
            >
              <Plus size={16} />
              Add page
            </Button>
          </div>
        </div>

        {value.length ? (
          <div className="space-y-3">
            {value.map((page) => {
              const pagePath = normalizePagePath(page.path);
              const pathIsDuplicate = (duplicatePathCount.get(pagePath) ?? 0) > 1;
              const pathIsReserved = reservedPaths.has(pagePath);

              return (
                <button
                  key={page.id}
                  type="button"
                  draggable
                  onClick={() => onSelectedPageIdChange(page.id)}
                  onDragStart={() => setDraggedPageId(page.id)}
                  onDragEnd={() => setDraggedPageId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();

                    if (!draggedPageId) {
                      return;
                    }

                    commitPages(reorderById(value, draggedPageId, page.id), page.id);
                    setDraggedPageId(null);
                  }}
                  className={cn(
                    "w-full rounded-[1.4rem] border p-4 text-left transition-all duration-300",
                    selectedPage?.id === page.id
                      ? "border-[#79D3FF]/35 bg-white/[0.1] shadow-[0_16px_38px_rgba(8,15,28,0.18)]"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full border border-white/10 bg-white/10 p-2 text-slate-200">
                        <GripVertical size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{page.title || "Untitled page"}</p>
                        <p className="mt-1 text-xs leading-6 text-slate-300/70">{pagePath}</p>
                        <p className="mt-1 text-[0.72rem] uppercase tracking-[0.18em] text-slate-400/70">
                          {page.blocks.length} block{page.blocks.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={pagePath}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[#79D3FF] transition-transform hover:scale-105"
                        aria-label={`Preview ${page.title || "custom page"}`}
                      >
                        <ArrowUpRight size={16} />
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(event) => {
                          event.stopPropagation();

                          const nextPages = value.filter((entry) => entry.id !== page.id);
                          const nextSelectedPageId =
                            selectedPageId === page.id ? (nextPages[0]?.id ?? null) : selectedPageId;

                          commitPages(nextPages, nextSelectedPageId);
                        }}
                        className="h-9 w-9 text-slate-200 hover:bg-white/10 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  {pathIsDuplicate || pathIsReserved ? (
                    <p className="mt-3 text-xs leading-6 text-amber-200/90">
                      {pathIsDuplicate
                        ? "This URL is already used by another custom page."
                        : "This URL conflicts with an existing site route."}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-white/12 bg-white/[0.03] p-5 text-sm leading-7 text-slate-100/72">
            No custom pages yet. Add the first page to start the drag-and-drop builder.
          </div>
        )}
      </div>

      <div className="space-y-6">
        {selectedPage ? (
          <>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Page settings</p>
                  <p className="mt-1 text-xs leading-6 text-slate-300/72">Edit the page title, description, and public URL address.</p>
                </div>
                <a
                  href={selectedPath}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/14"
                >
                  Preview page
                  <ArrowUpRight size={16} />
                </a>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm text-white">Page title</Label>
                  <Input
                    value={selectedPage.title}
                    onChange={(event) => updateSelectedPage((page) => ({ ...page, title: event.target.value }))}
                    placeholder="About HEPA"
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-white">Navigation label</Label>
                  <Input
                    value={selectedPage.navigationLabel}
                    onChange={(event) =>
                      updateSelectedPage((page) => ({
                        ...page,
                        navigationLabel: event.target.value,
                      }))
                    }
                    placeholder="About"
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-white">URL address</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      value={selectedPage.path}
                      onChange={(event) => updateSelectedPage((page) => ({ ...page, path: event.target.value }))}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          applySelectedPagePath();
                        }
                      }}
                      placeholder="/about-hepa"
                      spellCheck={false}
                      className={inputClassName}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={applySelectedPagePath}
                      className="shrink-0 rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
                    >
                      <Check size={16} />
                      Apply URL
                    </Button>
                  </div>
                  <p className="text-xs leading-6 text-slate-300/72">
                    Apply URL normalizes the path. Then use <span className="font-semibold text-white">Save changes</span> on the left to publish it.
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm text-white">Page description</Label>
                  <Textarea
                    rows={4}
                    value={selectedPage.description}
                    onChange={(event) =>
                      updateSelectedPage((page) => ({
                        ...page,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Describe the purpose of this page."
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-[1.3rem] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/66">Preview URL</p>
                <p className="mt-3 text-sm font-medium text-white">{selectedPath}</p>
                <p className="mt-2 text-xs leading-6 text-slate-300/72">
                  Use internal paths like <code>/services/market-access</code>. Add this page to the public navigation or footer by editing those link lists separately.
                </p>
                {selectedPathIsDuplicate || selectedPathIsReserved ? (
                  <p className="mt-3 text-xs leading-6 text-amber-200/90">
                    {selectedPathIsDuplicate
                      ? "This URL is already used by another custom page. Keep each path unique."
                      : "This URL conflicts with a built-in route. Avoid using /, the admin path, the 404 preview path, or the reference projects path."}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 text-white">
                    <LayoutTemplate size={18} className="text-[#79D3FF]" />
                    <p className="text-sm font-semibold">Drag-and-drop builder</p>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-slate-300/72">Add blocks, then drag them up or down to change the flow of the page.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(blockTypeLabels) as CustomPageBlockType[]).map((blockType) => (
                    <Button
                      key={blockType}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateSelectedPage((page) => ({
                          ...page,
                          blocks: [...page.blocks, createCustomPageBlockDraft(blockType)],
                        }))
                      }
                      className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
                    >
                      <Plus size={14} />
                      {blockTypeLabels[blockType]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {selectedPage.blocks.length ? (
                  selectedPage.blocks.map((block, index) => (
                    <div
                      key={block.id}
                      draggable
                      onDragStart={() => setDraggedBlockId(block.id)}
                      onDragEnd={() => setDraggedBlockId(null)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();

                        if (!draggedBlockId) {
                          return;
                        }

                        updateSelectedPage((page) => ({
                          ...page,
                          blocks: reorderById(page.blocks, draggedBlockId, block.id),
                        }));
                        setDraggedBlockId(null);
                      }}
                      className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full border border-white/10 bg-white/10 p-2 text-slate-200">
                            <GripVertical size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {blockTypeLabels[block.type]} block {index + 1}
                            </p>
                            <p className="mt-1 text-xs leading-6 text-slate-300/72">Drag this card to reorder the page layout.</p>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateSelectedPage((page) => ({
                              ...page,
                              blocks: page.blocks.filter((entry) => entry.id !== block.id),
                            }))
                          }
                          className="text-slate-200 hover:bg-white/10 hover:text-white"
                        >
                          <Trash2 size={16} />
                          Remove block
                        </Button>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-sm text-white">Block type</Label>
                          <Select
                            value={block.type}
                            onValueChange={(nextValue) =>
                              updateSelectedPageBlock(block.id, (currentBlock) => {
                                const nextTemplate = createCustomPageBlockDraft(nextValue as CustomPageBlockType);

                                return {
                                  ...nextTemplate,
                                  ...currentBlock,
                                  id: currentBlock.id,
                                  type: nextValue as CustomPageBlockType,
                                  items: currentBlock.items.length ? currentBlock.items : nextTemplate.items,
                                  primaryAction: {
                                    ...nextTemplate.primaryAction,
                                    ...currentBlock.primaryAction,
                                  },
                                  secondaryAction: {
                                    ...nextTemplate.secondaryAction,
                                    ...currentBlock.secondaryAction,
                                  },
                                };
                              })
                            }
                          >
                            <SelectTrigger className={inputClassName}>
                              <SelectValue placeholder="Select a block type" />
                            </SelectTrigger>
                            <SelectContent>
                              {(Object.keys(blockTypeLabels) as CustomPageBlockType[]).map((blockType) => (
                                <SelectItem key={blockType} value={blockType}>
                                  {blockTypeLabels[blockType]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm text-white">Eyebrow</Label>
                          <Input
                            value={block.eyebrow}
                            onChange={(event) =>
                              updateSelectedPageBlock(block.id, (currentBlock) => ({
                                ...currentBlock,
                                eyebrow: event.target.value,
                              }))
                            }
                            placeholder="Section label"
                            className={inputClassName}
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-sm text-white">Title</Label>
                          <Input
                            value={block.title}
                            onChange={(event) =>
                              updateSelectedPageBlock(block.id, (currentBlock) => ({
                                ...currentBlock,
                                title: event.target.value,
                              }))
                            }
                            placeholder="Section title"
                            className={inputClassName}
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-sm text-white">Description</Label>
                          <Textarea
                            rows={4}
                            value={block.description}
                            onChange={(event) =>
                              updateSelectedPageBlock(block.id, (currentBlock) => ({
                                ...currentBlock,
                                description: event.target.value,
                              }))
                            }
                            placeholder="Short section summary"
                            className={inputClassName}
                          />
                        </div>

                        {block.type === "content" ? (
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-sm text-white">Body</Label>
                            <Textarea
                              rows={6}
                              value={block.body}
                              onChange={(event) =>
                                updateSelectedPageBlock(block.id, (currentBlock) => ({
                                  ...currentBlock,
                                  body: event.target.value,
                                }))
                              }
                              placeholder="Write the main body copy for this content block."
                              className={inputClassName}
                            />
                          </div>
                        ) : null}

                        {block.type === "hero" || block.type === "checklist" ? (
                          <StringListEditor
                            label={block.type === "hero" ? "Highlights" : "Checklist items"}
                            items={block.items}
                            onChange={(nextItems) =>
                              updateSelectedPageBlock(block.id, (currentBlock) => ({
                                ...currentBlock,
                                items: nextItems,
                              }))
                            }
                          />
                        ) : null}

                        {(block.type === "hero" || block.type === "checklist" || block.type === "cta") ? (
                          <>
                            <div className="space-y-2">
                              <Label className="text-sm text-white">Primary button label</Label>
                              <Input
                                value={block.primaryAction.label}
                                onChange={(event) =>
                                  updateSelectedPageBlock(block.id, (currentBlock) => ({
                                    ...currentBlock,
                                    primaryAction: {
                                      ...currentBlock.primaryAction,
                                      label: event.target.value,
                                    },
                                  }))
                                }
                                placeholder="Contact HEPA"
                                className={inputClassName}
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <Label className="text-sm text-white">Primary button URL</Label>
                                <AssetUploadButton
                                  label="Upload file"
                                  onValueChange={(nextValue) =>
                                    updateSelectedPageBlock(block.id, (currentBlock) => ({
                                      ...currentBlock,
                                      primaryAction: {
                                        ...currentBlock.primaryAction,
                                        href: nextValue,
                                      },
                                    }))
                                  }
                                />
                              </div>
                              <Input
                                value={block.primaryAction.href}
                                onChange={(event) =>
                                  updateSelectedPageBlock(block.id, (currentBlock) => ({
                                    ...currentBlock,
                                    primaryAction: {
                                      ...currentBlock.primaryAction,
                                      href: event.target.value,
                                    },
                                  }))
                                }
                                placeholder="#contact or /about"
                                spellCheck={false}
                                className={inputClassName}
                              />
                              {block.primaryAction.href.startsWith("data:") ? (
                                <p className="text-xs leading-6 text-slate-300/72">Inline file uploaded. Save changes to publish it.</p>
                              ) : null}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm text-white">Secondary button label</Label>
                              <Input
                                value={block.secondaryAction.label}
                                onChange={(event) =>
                                  updateSelectedPageBlock(block.id, (currentBlock) => ({
                                    ...currentBlock,
                                    secondaryAction: {
                                      ...currentBlock.secondaryAction,
                                      label: event.target.value,
                                    },
                                  }))
                                }
                                placeholder="Learn more"
                                className={inputClassName}
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <Label className="text-sm text-white">Secondary button URL</Label>
                                <AssetUploadButton
                                  label="Upload file"
                                  onValueChange={(nextValue) =>
                                    updateSelectedPageBlock(block.id, (currentBlock) => ({
                                      ...currentBlock,
                                      secondaryAction: {
                                        ...currentBlock.secondaryAction,
                                        href: nextValue,
                                      },
                                    }))
                                  }
                                />
                              </div>
                              <Input
                                value={block.secondaryAction.href}
                                onChange={(event) =>
                                  updateSelectedPageBlock(block.id, (currentBlock) => ({
                                    ...currentBlock,
                                    secondaryAction: {
                                      ...currentBlock.secondaryAction,
                                      href: event.target.value,
                                    },
                                  }))
                                }
                                placeholder="/services"
                                spellCheck={false}
                                className={inputClassName}
                              />
                              {block.secondaryAction.href.startsWith("data:") ? (
                                <p className="text-xs leading-6 text-slate-300/72">Inline file uploaded. Save changes to publish it.</p>
                              ) : null}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.35rem] border border-dashed border-white/12 bg-white/[0.03] p-4 text-sm leading-7 text-slate-100/72">
                    No blocks yet. Add the first block to start building this page.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-white/12 bg-white/[0.03] p-6 text-sm leading-7 text-slate-100/72">
            Select a page from the left column or add a new one to open the editor.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPagesEditor;
