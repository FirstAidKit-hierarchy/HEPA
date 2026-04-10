import { ProductPreviewCard, Reveal, SectionHeading } from "@/components/common";
import { useSiteContent } from "@/components/providers";

const ProductProofSection = () => {
  const {
    siteContent: {
      home: { productProof },
    },
  } = useSiteContent();

  return (
    <section className="py-16 sm:py-20">
      <div className="section-container">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(280px,0.48fr)] lg:items-end">
          <Reveal>
            <SectionHeading align="left" eyebrow={productProof.eyebrow} title={productProof.title} description={productProof.description} />
          </Reveal>
        <Reveal delay={140}>
          <div className="rounded-[1.8rem] border border-border/70 bg-background/85 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-blue">{productProof.supportingPanelEyebrow}</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              {productProof.supportingPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {productProof.items.map((item, index) => (
          <Reveal key={item.title} delay={index * 90}>
            <ProductPreviewCard
              eyebrow={item.eyebrow}
              title={item.title}
              description={item.description}
              previewType={item.type}
              tags={item.tags}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              isPlaceholder={item.isPlaceholder}
              className="h-full"
            />
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
};

export default ProductProofSection;
