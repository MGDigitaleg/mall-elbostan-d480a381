import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";

type Props = {
  value: string;
  claimCode: string;
  size?: number;
};

/**
 * QR code for the claim — staff scans on redemption.
 * Encodes qr_data (signed payload) so the claim verification endpoint can validate it.
 */
export function ClaimQRCode({ value, claimCode, size = 144 }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const downloadPng = () => {
    const svg = wrapperRef.current?.querySelector("svg");
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const scale = 4;
      const canvas = document.createElement("canvas");
      canvas.width = size * scale;
      canvas.height = size * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const a = document.createElement("a");
      a.download = `claim-${claimCode}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={wrapperRef}
        className="rounded-xl border border-border bg-white p-3"
        style={{ boxShadow: "0 4px 12px hsl(222 36% 6% / 0.08)" }}
      >
        <QRCodeSVG
          value={value}
          size={size}
          level="M"
          marginSize={0}
          fgColor="#0B1220"
          bgColor="#ffffff"
        />
      </div>
      <button
        type="button"
        onClick={downloadPng}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <Download className="h-3.5 w-3.5" />
        تحميل QR كصورة
      </button>
    </div>
  );
}
