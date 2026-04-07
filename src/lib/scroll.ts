export function scrollToSection(selector: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.querySelector(selector)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function resetHorizontalScrollPosition() {
  if (typeof window === "undefined" || window.scrollX === 0) {
    return;
  }

  window.scrollTo({ left: 0, top: window.scrollY, behavior: "auto" });
}
