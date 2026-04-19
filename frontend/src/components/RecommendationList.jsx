export default function RecommendationList({ items }) {
  return (
    <div className="glass panel-outline relative overflow-hidden rounded-[2rem] p-6 shadow-panel">
      <div className="absolute left-8 top-8 h-20 w-20 rounded-full bg-teal/10 blur-3xl" />
      <div className="relative mb-5">
        <div className="section-badge">Recommendations</div>
        <h3 className="mt-4 font-display text-2xl text-white">Personalized Recommendations</h3>
        <p className="text-sm text-sky-100/70">
          Practical, non-diagnostic guidance based on the current input profile.
        </p>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item}
            className="soft-card flex items-start gap-4 rounded-[1.5rem] px-4 py-4 text-sm leading-6 text-slate-100 transition duration-300 hover:-translate-y-1"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/25 to-teal/20 text-sm font-semibold text-white">
              {index + 1}
            </div>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
