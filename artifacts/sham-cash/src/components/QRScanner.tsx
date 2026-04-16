import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { X, QrCode } from "lucide-react";

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const reader = new BrowserQRCodeReader();
    let mounted = true;

    async function start() {
      try {
        const devices = await BrowserQRCodeReader.listVideoInputDevices();
        const backCamera = devices.find((d) =>
          /back|rear|environment/i.test(d.label)
        ) ?? devices[devices.length - 1];

        const deviceId = backCamera?.deviceId;

        if (!videoRef.current || !mounted) return;

        controlsRef.current = await reader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, err) => {
            if (result && mounted) {
              setScanning(false);
              onScan(result.getText());
            }
            if (err && !(err.message?.includes("NotFoundException"))) {
              // ignore "not found" errors (normal when no QR in frame)
            }
          }
        );
      } catch (e: any) {
        if (mounted) {
          setError(
            e?.message?.includes("Permission")
              ? "يرجى السماح بالوصول إلى الكاميرا"
              : "تعذّر تشغيل الكاميرا"
          );
        }
      }
    }

    start();

    return () => {
      mounted = false;
      controlsRef.current?.stop();
    };
  }, [onScan]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[360px] overflow-hidden rounded-[24px] bg-[#0b1120] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4 text-[#657bd8]" />
            <span className="text-[14px] font-bold text-white/80">مسح رمز QR</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Camera */}
        <div className="relative aspect-square w-full bg-black overflow-hidden">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
            muted
          />

          {/* Scan overlay */}
          {!error && scanning && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {/* Dimmed corners */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Scan window */}
              <div className="relative h-52 w-52">
                {/* Clear area */}
                <div className="absolute inset-0 rounded-[12px] border-2 border-[#657bd8]/60 bg-transparent" />

                {/* Corner accents */}
                {[
                  "top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-[10px]",
                  "top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-[10px]",
                  "bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-[10px]",
                  "bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-[10px]",
                ].map((cls, i) => (
                  <div key={i} className={`absolute h-7 w-7 border-[#657bd8] ${cls}`} />
                ))}

                {/* Scanning line */}
                <div className="absolute left-1 right-1 h-[2px] rounded-full bg-[#657bd8]/80 animate-[scan_2s_linear_infinite]" />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 px-6 text-center">
              <QrCode className="h-10 w-10 text-white/30" />
              <p className="text-[14px] font-semibold text-white/60">{error}</p>
            </div>
          )}

          {/* Success */}
          {!scanning && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1fc28a]/20">
                <QrCode className="h-7 w-7 text-[#1fc28a]" />
              </div>
              <p className="text-[14px] font-bold text-[#1fc28a]">تم المسح بنجاح</p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-3 text-center">
          <p className="text-[12px] text-white/35">وجّه الكاميرا نحو رمز QR</p>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%   { top: 8px; }
          50%  { top: calc(100% - 10px); }
          100% { top: 8px; }
        }
      `}</style>
    </div>
  );
}
