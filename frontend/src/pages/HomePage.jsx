import { Link } from "react-router-dom";
import Disclaimer from "../components/Disclaimer";

const highlights = [
  {
    title: "Predictive insight",
    text: "Lifestyle-based fertility wellness scoring from 0 to 100 with fast, understandable outputs.",
  },
  {
    title: "Transparent reasoning",
    text: "Every result is paired with SHAP factor contributions so users can see what moved the score.",
  },
  {
    title: "Action-oriented guidance",
    text: "Recommendations translate raw model output into habits and next steps that feel useful.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <div className="grid items-center gap-10 xl:grid-cols-[1.03fr_0.97fr]">
        <section className="animate-rise py-8">
          <span className="section-badge">Healthcare Startup Dashboard</span>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-tight text-white sm:text-6xl xl:text-7xl">
            Fertility insight software with a <span className="gradient-text">calm, modern care experience</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-sky-50/80">
            A polished AI workflow for collecting health inputs, estimating a fertility wellness
            score, visualizing contributing factors, and surfacing lifestyle recommendations in a
            dashboard that feels ready for a healthcare startup demo.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/assessment"
              className="rounded-full bg-gradient-to-r from-aqua to-teal px-6 py-3 text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
            >
              Launch Assessment
            </Link>
            <a
              href="#platform-highlights"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-sky-50/85 transition duration-300 hover:bg-white/10"
            >
              Explore Platform
            </a>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="glass panel-outline rounded-[1.6rem] p-5 shadow-panel">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">Score Range</p>
              <p className="mt-3 font-display text-4xl text-white">0-100</p>
              <p className="mt-2 text-sm text-sky-100/70">Clear wellness-style output for demos.</p>
            </div>
            <div className="glass panel-outline rounded-[1.6rem] p-5 shadow-panel">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">Explainability</p>
              <p className="mt-3 font-display text-4xl text-white">Top 6</p>
              <p className="mt-2 text-sm text-sky-100/70">Most influential factors highlighted.</p>
            </div>
            <div className="glass panel-outline rounded-[1.6rem] p-5 shadow-panel">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">Architecture</p>
              <p className="mt-3 font-display text-4xl text-white">3-Layer</p>
              <p className="mt-2 text-sm text-sky-100/70">React, Express, FastAPI working together.</p>
            </div>
          </div>
          <Disclaimer className="mt-8 max-w-2xl" />
        </section>

        <section className="animate-rise [animation-delay:120ms]">
          <div className="glass panel-outline relative overflow-hidden rounded-[2.2rem] p-6 shadow-panel">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-300/10 via-transparent to-teal/10" />
            <div className="relative grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[1.9rem] bg-gradient-to-br from-sky-300/20 via-white/10 to-teal/20 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-sky-100/65">Live Preview</p>
                    <h2 className="mt-2 font-display text-3xl text-white">Care Dashboard</h2>
                  </div>
                  <div className="metric-pill text-xs">Explainable AI</div>
                </div>
                <div className="mt-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-sky-100/60">Sample score</p>
                    <p className="mt-2 font-display text-7xl text-white">82</p>
                  </div>
                  <div className="rounded-[1.3rem] border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">Band</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-50">Favorable</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="soft-card rounded-[1.3rem] p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-sky-100/55">BMI</p>
                    <p className="mt-2 text-2xl font-semibold text-white">22.6</p>
                  </div>
                  <div className="soft-card rounded-[1.3rem] p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-sky-100/55">Sleep</p>
                    <p className="mt-2 text-2xl font-semibold text-white">7.5h</p>
                  </div>
                  <div className="soft-card rounded-[1.3rem] p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-sky-100/55">Stress</p>
                    <p className="mt-2 text-2xl font-semibold text-white">Low</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="soft-card rounded-[1.75rem] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">Top Drivers</p>
                  <div className="mt-5 space-y-4">
                    {[
                      ["Exercise", "84%", "bg-gradient-to-r from-teal to-aqua"],
                      ["Sleep", "71%", "bg-gradient-to-r from-sky-300 to-cyan-200"],
                      ["Stress", "36%", "bg-gradient-to-r from-rose-300 to-coral"],
                    ].map(([label, width, barClass]) => (
                      <div key={label}>
                        <div className="mb-2 flex items-center justify-between text-sm text-sky-100/75">
                          <span>{label}</span>
                          <span>{width}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-white/10">
                          <div className={`h-full rounded-full ${barClass}`} style={{ width }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="soft-card rounded-[1.75rem] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">Care Priorities</p>
                  <div className="mt-4 space-y-3">
                    {[
                      "Maintain regular sleep and moderate movement",
                      "Monitor stress load and recovery habits",
                      "Translate insights into personalized guidance",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-[1.2rem] bg-white/5 px-3 py-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-aqua to-teal shadow-float" />
                        <p className="text-sm leading-6 text-slate-100">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="platform-highlights" className="grid gap-4 lg:grid-cols-3">
        {highlights.map((item, index) => (
          <div
            key={item.title}
            className="glass panel-outline animate-rise rounded-[1.8rem] p-6 shadow-panel"
            style={{ animationDelay: `${index * 0.12 + 0.1}s` }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">{item.title}</p>
            <p className="mt-4 font-display text-3xl text-white">{item.title}</p>
            <p className="mt-4 text-sm leading-7 text-sky-100/72">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
