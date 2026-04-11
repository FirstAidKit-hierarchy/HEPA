import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { isHashHref, isInternalPathHref, normalizeAppHref } from "@/lib/site-pages";

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};

const SiteLink = forwardRef<HTMLAnchorElement, SiteLinkProps>(({ href, onClick, rel, target, ...props }, ref) => {
  const location = useLocation();
  const trimmedHref = href.trim();

  if (!trimmedHref) {
    const handleEmptyClick = (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onClick?.(event);
    };

    return <a {...props} ref={ref} href="#" onClick={handleEmptyClick} />;
  }

  if (isHashHref(trimmedHref)) {
    if (location.pathname === "/") {
      return <a {...props} ref={ref} href={trimmedHref} onClick={onClick} />;
    }

    return (
      <Link
        {...props}
        ref={ref}
        to={`/${trimmedHref}`}
        onClick={onClick}
      />
    );
  }

  if (isInternalPathHref(trimmedHref)) {
    return (
      <Link
        {...props}
        ref={ref}
        to={normalizeAppHref(trimmedHref)}
        onClick={onClick}
      />
    );
  }

  return (
    <a
      {...props}
      ref={ref}
      href={trimmedHref}
      target={target}
      rel={target === "_blank" ? rel ?? "noreferrer" : rel}
      onClick={onClick}
    />
  );
});

SiteLink.displayName = "SiteLink";

export default SiteLink;
