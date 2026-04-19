export default function StatCard({ label, value, accent = "text-white", meta = "" }) {
  return (
    <div className="glass panel-outline group relative overflow-hidden rounded-[1.75rem] p-5 shadow-panel transition duration-300 hover:-translate-y-1">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-sky-300/10 blur-2xl transition duration-300 group-hover:bg-teal/20" />
      <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">{label}</p>
      <p className={`mt-3 font-display text-4xl ${accent}`}>{value}</p>
      {meta ? <p className="mt-2 text-sm text-sky-100/65">{meta}</p> : null}
    </div>
  );
}
