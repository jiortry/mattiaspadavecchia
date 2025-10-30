import { useEffect, useState } from "react";

const MobileScrim = () => {
  const [pageHeight, setPageHeight] = useState<number>(0);

  useEffect(() => {
    const update = () => setPageHeight(document.documentElement.scrollHeight);
    update();

    const onResize = () => update();
    window.addEventListener("resize", onResize);

    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });

    return () => {
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 md:hidden"
      style={{ zIndex: 5, top: 0, height: pageHeight ? `${pageHeight}px` : undefined, backgroundColor: "rgba(0,0,0,0.55)" }}
      aria-hidden
    />
  );
};

export default MobileScrim;


