import { useEffect } from "react";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function useGA4() {
  useEffect(() => {
    if (!GA_ID) return;

    // Load gtag script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize
    const initScript = document.createElement("script");
    initScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    `;
    document.head.appendChild(initScript);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(initScript);
    };
  }, []);
}
