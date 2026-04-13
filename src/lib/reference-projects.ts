type ReferenceProjectInput = {
  href: string;
  previewImage?: string;
  previewAlt?: string;
  title?: string;
};

const KNOWN_REFERENCE_PROJECT_PREVIEWS: Record<string, { imageSrc: string; alt: string }> = {
  "https://www.ispor.org/heor-resources/presentations-database/presentation/intl2024-3900/137608": {
    imageSrc: "/ted-uae-preview.svg",
    alt: "Preview slide for thyroid eye disease economic burden in the United Arab Emirates",
  },
};

export const resolveReferenceProjectPreview = (reference: ReferenceProjectInput) => {
  const explicitImage = reference.previewImage?.trim();

  if (explicitImage) {
    return {
      imageSrc: explicitImage,
      alt: reference.previewAlt?.trim() || reference.title || "Reference project preview",
      isFallback: false,
    };
  }

  const knownPreview = KNOWN_REFERENCE_PROJECT_PREVIEWS[reference.href];

  if (knownPreview) {
    return {
      ...knownPreview,
      isFallback: true,
    };
  }

  return {
    imageSrc: "",
    alt: reference.previewAlt?.trim() || reference.title || "Reference project preview",
    isFallback: false,
  };
};

export const hasReferenceProjectPreview = (reference: ReferenceProjectInput) =>
  Boolean(resolveReferenceProjectPreview(reference).imageSrc);
