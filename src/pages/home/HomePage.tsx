import { Fragment } from "react";
import { Footer, Navbar, PageLoader } from "@/components/layout";
import { homePageSections } from "./homeSections";
import { useHomePageLoader } from "./useHomePageLoader";

const HomePage = () => {
  const { showLoader, hideLoader } = useHomePageLoader();

  return (
    <div className="min-h-screen bg-background">
      <PageLoader visible={showLoader} fading={hideLoader} />
      <Navbar />
      <main className="overflow-x-clip">
        {homePageSections.map(({ id, render }) => (
          <Fragment key={id}>{render()}</Fragment>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
