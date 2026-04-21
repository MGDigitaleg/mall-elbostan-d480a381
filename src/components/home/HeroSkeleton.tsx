/**
 * Skeleton placeholder for the Hero section.
 * Mirrors the actual hero layout (text left, countdown right on desktop;
 * stacked on mobile) so the transition feels seamless.
 */
export function HeroSkeleton({ mobile = false }: { mobile?: boolean }) {
  const minH = mobile ? 520 : 580;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: "#0a1628",
        contain: "layout style",
      }}
    >
      {/* Ambient glow — matches real hero */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/4 left-[12%] w-[350px] h-[350px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }}
        />
      </div>

      {/* Content skeleton */}
      <div
        className={`relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-${mobile ? "end" : "center"} px-5 md:px-10`}
        style={{ minHeight: minH, paddingTop: mobile ? 80 : 76, paddingBottom: mobile ? 64 : 56 }}
      >
        <div className={`flex w-full flex-col ${mobile ? "items-center text-center" : "md:flex-row md:items-center md:justify-between"} gap-6`}>
          {/* Text block */}
          <div className={`space-y-4 ${mobile ? "w-full" : "max-w-[28rem]"}`}>
            {/* Kicker pill */}
            <div
              className="h-6 w-24 rounded-full mx-auto md:mx-0"
              style={{ background: "#CDBB9A12" }}
            />
            {/* Headline */}
            <div className="space-y-2">
              <div
                className="h-7 rounded-lg mx-auto md:mx-0"
                style={{ width: mobile ? "70%" : "80%", background: "#ffffff08" }}
              />
              <div
                className="h-7 rounded-lg mx-auto md:mx-0"
                style={{ width: mobile ? "50%" : "55%", background: "#ffffff06" }}
              />
            </div>
            {/* Subtitle */}
            <div
              className="h-4 rounded-md mx-auto md:mx-0"
              style={{ width: mobile ? "85%" : "75%", background: "#ffffff05" }}
            />
            {/* CTA buttons */}
            <div className={`flex ${mobile ? "justify-center" : "justify-start"} gap-2.5 pt-1`}>
              <div className="h-10 w-32 rounded-xl" style={{ background: "#2563EB18" }} />
              <div className="h-10 w-28 rounded-xl" style={{ background: "#ffffff06", border: "1px solid #ffffff10" }} />
            </div>
          </div>

          {/* Countdown skeleton (desktop only or mobile compact) */}
          <div
            className="rounded-2xl border px-5 py-4"
            style={{
              borderColor: "hsla(0, 0%, 100%, 0.08)",
              background: "hsla(220, 45%, 10%, 0.65)",
              width: mobile ? "auto" : 260,
            }}
          >
            <div className="h-3 w-20 rounded-md mx-auto mb-3" style={{ background: "#CDBB9A18" }} />
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="h-10 w-12 rounded-lg" style={{ background: "#ffffff06" }} />
                  <div className="h-2 w-8 rounded" style={{ background: "#ffffff05" }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar skeleton (desktop) */}
        {!mobile && (
          <div
            className="mt-auto rounded-2xl border px-6 py-3.5 flex items-center gap-6"
            style={{
              borderColor: "hsla(0, 0%, 100%, 0.08)",
              background: "hsla(220, 45%, 10%, 0.55)",
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className="h-8 w-8 rounded-lg" style={{ background: "#ffffff06" }} />
                <div className="space-y-1">
                  <div className="h-4 w-12 rounded" style={{ background: "#ffffff08" }} />
                  <div className="h-2.5 w-16 rounded" style={{ background: "#ffffff04" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shimmer animation */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background: "linear-gradient(100deg, transparent 30%, #ffffff04 50%, transparent 70%)",
          animation: "heroShimmer 2s ease-in-out infinite",
        }}
      />
      <style>{`@keyframes heroShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}
