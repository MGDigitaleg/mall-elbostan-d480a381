import { useEffect } from "react";
import { captureUtmFromUrl } from "@/lib/utm";

const GA_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? "").trim();
const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID ?? "").trim();

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    dataLayer?: unknown[];
  }
}

/**
 * Bootstraps GA4, Meta Pixel, and captures UTMs once per session.
 * IDs are read from build-time env vars (set in project env):
 *   VITE_GA_MEASUREMENT_ID   e.g. "G-XXXXXXXXXX"
 *   VITE_META_PIXEL_ID       e.g. "1234567890123456"
 */
export function useGA4() {
  useEffect(() => {
    // Capture UTM params from URL on every initial mount.
    captureUtmFromUrl();

    // ── GA4 ──
    if (GA_ID && !document.getElementById("ga4-loader")) {
      const s = document.createElement("script");
      s.id = "ga4-loader";
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      s.async = true;
      document.head.appendChild(s);

      const init = document.createElement("script");
      init.id = "ga4-init";
      init.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { anonymize_ip: true });
      `;
      document.head.appendChild(init);
    }

    // ── Meta Pixel ──
    if (META_PIXEL_ID && !document.getElementById("meta-pixel-init")) {
      const init = document.createElement("script");
      init.id = "meta-pixel-init";
      init.textContent = `
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(init);

      const noscript = document.createElement("noscript");
      const img = document.createElement("img");
      img.height = 1; img.width = 1; img.style.display = "none";
      img.src = `https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    }
  }, []);
}
