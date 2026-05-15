import { useEffect } from "react";

/**
 * `.reveal` 요소를 자동으로 관찰하여 뷰포트에 들어오면 `.in` 클래스를 부여한다.
 * 별도 라이브러리 없이 IntersectionObserver만으로 페이드/슬라이드 인 효과 제공.
 */
export function useReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window) || els.length === 0) {
      els.forEach(el => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}
