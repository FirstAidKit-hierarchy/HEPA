import { withBasePath } from "@/lib/site-pages";

export type Partner = {
  name: string;
  lightLogo?: string;
  darkLogo?: string;
  logoClassName?: string;
  logoFitClassName?: string;
  embeddedFrameClassName?: string;
  mainFrameClassName?: string;
};

export const partners: Partner[] = [
  { name: "AFMC", lightLogo: withBasePath("/icons/AFMC-prt.svg") },
  { name: "Amgen", lightLogo: withBasePath("/icons/AMGEN-prt.svg") },
  { name: "Bayer", lightLogo: withBasePath("/icons/BAYER-prt.svg") },
  { name: "Biogen", lightLogo: withBasePath("/icons/Biogen-prt.svg") },
  { name: "Eli Lilly", lightLogo: withBasePath("/icons/Eill lilly-prt.svg") },
  { name: "GSK", lightLogo: withBasePath("/icons/GSK-prt.svg") },
  { name: "HMC", lightLogo: withBasePath("/icons/HMC-prt.svg") },
  { name: "Horizon", lightLogo: withBasePath("/icons/HORIZON-prt.svg") },
  { name: "Ipsen", lightLogo: withBasePath("/icons/IPSEN-prt.svg") },
  { name: "JNJ", lightLogo: withBasePath("/icons/JNJ-prt.svg") },
  { name: "KAMC", lightLogo: withBasePath("/icons/KAMC-prt.svg") },
  { name: "KFMC", lightLogo: withBasePath("/icons/KFMC-prt.svg") },
  { name: "KFSH&RC", lightLogo: withBasePath("/icons/KFSH&RC-prt.svg") },
  { name: "Kite", lightLogo: withBasePath("/icons/KITE-prt (2).svg") },
  { name: "KSU", lightLogo: withBasePath("/icons/KSU-prt.svg") },
  { name: "LC&GPA", lightLogo: withBasePath("/icons/LC&GPA-prt.svg") },
  { name: "MNGHA", lightLogo: withBasePath("/icons/MNGHA-prt.svg") },
  { name: "Novartis", lightLogo: withBasePath("/icons/NOVARTIS-prt.svg") },
  { name: "NUPCO", lightLogo: withBasePath("/icons/NUPCO-prt.svg") },
  { name: "Pfizer", lightLogo: withBasePath("/icons/Pfizer-prt.svg") },
  { name: "Roche", lightLogo: withBasePath("/icons/Roche-prt.svg") },
  { name: "Sanofi", lightLogo: withBasePath("/icons/Sanofi-dark-prt.svg") },
  { name: "SFDA", lightLogo: withBasePath("/icons/SFDA-prt.svg") },
  { name: "SFH", lightLogo: withBasePath("/icons/SFH-prt.svg") },
  { name: "SSMC", lightLogo: withBasePath("/icons/SSMC-prt.svg") },
];
