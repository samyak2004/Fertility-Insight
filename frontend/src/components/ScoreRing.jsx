export default function ScoreRing({ score, riskBand }) {
  const gradient = `conic-gradient(#38bdf8 0deg, #2dd4bf ${score * 3.6}deg, rgba(255,255,255,0.08) ${score * 3.6}deg 360deg)`;
  const bandTone =
    riskBand === "Favorable"
      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
      : riskBand === "Moderate"
        ? "border-sky-300/30 bg-sky-300/10 text-sky-100"
        : "border-rose-300/30 bg-rose-300/10 text-rose-100";

  return (
    <div className="glass panel-outline relative overflow-hidden rounded-[2rem] p-8 shadow-panel">
      <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-sky-300/10 blur-3xl" />
      <div className="absolute bottom-0 right-8 h-28 w-28 rounded-full bg-teal/10 blur-3xl" />
      <div className="relative flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="relative flex h-56 w-56 items-center justify-center rounded-full shadow-float"
          style={{ background: gradient }}
        >
          <div className="absolute inset-4 rounded-full border border-white/10" />
          <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full border border-white/10 bg-ink">
            <span className="text-xs uppercase tracking-[0.35em] text-sky-100/65">
              Wellness Score
            </span>
            <span className="font-display text-6xl text-white">{score}</span>
          </div>
        </div>
        <div className="max-w-md text-center lg:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-100/60">
            Fertility wellness band
          </p>
          <div className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${bandTone}`}>
            {riskBand}
          </div>
          <p className="mt-5 text-sm leading-7 text-sky-100/72">
            This score reflects a lifestyle-oriented wellness estimate based on the submitted
            profile. Review the top factors and recommendations to understand what influenced
            the outcome the most.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="soft-card rounded-[1.4rem] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">Explainability</p>
              <p className="mt-2 text-sm text-white">Top SHAP drivers surfaced instantly</p>
            </div>
            <div className="soft-card rounded-[1.4rem] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">Guidance</p>
              <p className="mt-2 text-sm text-white">Rule-based recommendations for follow-up</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
