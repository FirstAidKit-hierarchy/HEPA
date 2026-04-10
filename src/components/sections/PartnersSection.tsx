import { Reveal, SectionHeading } from "@/components/common";
import { useSiteContent } from "@/components/providers";

interface PartnersSectionProps {
  embedded?: boolean;
}

type PartnerItem = {
  name: string;
  lightLogo?: string;
  logoClassName?: string;
  logoFitClassName?: string;
  embeddedFrameClassName?: string;
  mainFrameClassName?: string;
};

const renderPartnerLogo = (partner: PartnerItem, frameClassName: string, baseClassName: string) => {
  const logoClassName = `${baseClassName} ${partner.logoFitClassName ?? "object-contain"} ${partner.logoClassName ?? ""}`;

  return (
    <div className={frameClassName}>
      {partner.lightLogo ? <img src={partner.lightLogo} alt={partner.name} className={logoClassName} /> : null}
    </div>
  );
};

const PartnersSection = ({ embedded = false }: PartnersSectionProps) => {
  const {
    siteContent: {
      home: { partnersSection },
    },
  } = useSiteContent();
  const marqueePartners = [...partnersSection.items, ...partnersSection.items];

  if (embedded) {
    return (
      <Reveal className="w-full">
        <div className="section-container pb-4">
          <div className="text-center">
            <p className="partner-marquee-overline text-[0.68rem] font-semibold uppercase tracking-[0.34em] sm:text-[0.72rem]">
              {partnersSection.embeddedEyebrow}
            </p>
          </div>
        </div>
        <div className="w-full overflow-hidden border-0 bg-transparent shadow-none">
          <div className="w-full overflow-hidden">
            <div className="partner-marquee">
              <div className="partner-marquee-track">
                {marqueePartners.map((partner, index) => {
                  const hasLogo = Boolean(partner.lightLogo);

                  return (
                    <div
                      key={`${partner.name}-${index}`}
                      className={`partner-marquee-item group flex items-center justify-center rounded-2xl transition-all duration-500 ${
                        hasLogo
                          ? "partner-marquee-logo-item h-16 min-w-[11rem] px-3 sm:h-[5rem] sm:min-w-[12rem] sm:px-4"
                          : "h-18 min-w-[13rem] px-7 sm:h-[5.5rem] sm:min-w-[15rem]"
                      }`}
                    >
                      {hasLogo ? (
                        renderPartnerLogo(
                          partner,
                          partner.embeddedFrameClassName ??
                            "flex h-10 w-[9.5rem] items-center justify-center sm:h-12 sm:w-[10.5rem]",
                          "partner-marquee-logo h-full w-full origin-center object-center transition-transform duration-500",
                        )
                      ) : (
                        <span className="partner-marquee-label text-[0.7rem] font-semibold uppercase tracking-[0.3em] transition-colors duration-500 sm:text-[0.72rem]">
                          {partner.name}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <section className="pb-14 sm:pb-18">
      <Reveal className="section-container">
        <SectionHeading
          className="mb-7 sm:mb-8"
          eyebrow={partnersSection.eyebrow}
          title={partnersSection.title}
          description={partnersSection.description}
        />
      </Reveal>
      <div className="w-full overflow-hidden border-0 bg-transparent shadow-none">
        <div className="w-full overflow-hidden">
          <div className="partner-marquee">
            <div className="partner-marquee-track">
              {marqueePartners.map((partner, index) => {
                const hasLogo = Boolean(partner.lightLogo);

                return (
                  <div
                    key={`${partner.name}-${index}`}
                    className={`partner-marquee-item group flex items-center justify-center rounded-2xl transition-all duration-500 ${
                      hasLogo
                        ? "partner-marquee-logo-item h-20 min-w-[12rem] px-4 sm:h-[5.75rem] sm:min-w-[13rem] sm:px-5"
                        : "h-24 min-w-[15rem] px-8 sm:h-[6.5rem] sm:min-w-[18rem]"
                    }`}
                  >
                    {hasLogo ? (
                      renderPartnerLogo(
                        partner,
                        partner.mainFrameClassName ??
                          "flex h-14 w-[10.5rem] items-center justify-center sm:h-16 sm:w-[11.5rem]",
                        "partner-marquee-logo h-full w-full origin-center object-center transition-transform duration-500",
                      )
                    ) : (
                      <span className="partner-marquee-label text-[0.72rem] font-semibold uppercase tracking-[0.32em] transition-colors duration-500 sm:text-xs">
                        {partner.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
