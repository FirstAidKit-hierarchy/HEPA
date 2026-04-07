import { AnimatedHepaLogo } from "@/components/brand";
import { useAppTheme } from "@/components/providers";

type PageLoaderProps = {
  visible: boolean;
  fading: boolean;
};

const PageLoader = ({ visible, fading }: PageLoaderProps) => {
  const { isDark } = useAppTheme();

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-background transition-all duration-500 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(126,217,87,0.14),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(43,138,191,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)] dark:bg-[radial-gradient(circle_at_20%_18%,rgba(126,217,87,0.12),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(43,138,191,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />
      <div className="relative flex items-center justify-center px-6">
        <AnimatedHepaLogo
          dark={isDark}
          autoPlay
          className="w-[min(52vw,19rem)] sm:w-[min(34vw,22rem)]"
          imageClassName="h-auto w-full"
        />
      </div>
    </div>
  );
};

export default PageLoader;
