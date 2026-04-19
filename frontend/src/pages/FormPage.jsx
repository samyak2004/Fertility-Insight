import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Disclaimer from "../components/Disclaimer";
import { submitAssessment } from "../lib/api";
import {
  alcoholFrequencyOptions,
  fillMaleReferenceFields,
  highFeversLastYearOptions,
  smokingHabitOptions,
} from "../lib/maleReference";

const defaultForm = fillMaleReferenceFields({
  age: 29,
  heightCm: 165,
  weightKg: 68,
  smoking: false,
  alcohol: false,
  exerciseLevel: 3,
  stressLevel: 5,
  sleepHours: 7,
  gender: "female",
  menstrualRegularity: true,
  pcos: false,
});

const readinessCards = [
  {
    title: "Profile inputs",
    text: "Collect demographic, lifestyle, and optional female-specific health signals in one flow.",
  },
  {
    title: "AI assessment",
    text: "The backend calculates BMI, forwards the request, and retrieves score plus SHAP impacts.",
  },
  {
    title: "Actionable output",
    text: "Users receive a clean dashboard with factors, wellness band, and tailored recommendations.",
  },
];

function Field({ label, children, hint, className = "" }) {
  return (
    <label className={`soft-card block rounded-[1.5rem] p-4 transition duration-300 hover:border-sky-200/20 ${className}`}>
      <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em] text-sky-100/60">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-sky-100/55">{hint}</span> : null}
    </label>
  );
}

function baseInputClass() {
  return "w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-slate-50 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/20";
}

export default function FormPage() {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const heightMeters = Number(form.heightCm) / 100;
  const bmi =
    heightMeters && Number(form.weightKg)
      ? Number((Number(form.weightKg) / (heightMeters * heightMeters)).toFixed(2))
      : 0;

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const maleAwareForm = fillMaleReferenceFields(form);
      const payload = {
        ...maleAwareForm,
        age: Number(maleAwareForm.age),
        heightCm: Number(maleAwareForm.heightCm),
        weightKg: Number(maleAwareForm.weightKg),
        exerciseLevel: Number(maleAwareForm.exerciseLevel),
        stressLevel: Number(maleAwareForm.stressLevel),
        sleepHours: Number(maleAwareForm.sleepHours),
        hoursSitting: Number(maleAwareForm.hoursSitting),
        smoking:
          maleAwareForm.gender === "male"
            ? maleAwareForm.smokingHabit !== "never"
            : maleAwareForm.smoking,
        alcohol:
          maleAwareForm.gender === "male"
            ? maleAwareForm.alcoholFrequency !== "never"
            : maleAwareForm.alcohol,
      };

      const result = await submitAssessment(payload);
      localStorage.setItem("fertilityInsightResult", JSON.stringify({ result, payload }));
      navigate("/results", { state: { result, payload } });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="glass panel-outline rounded-[2rem] p-6 shadow-panel sm:p-8">
        <div className="mb-8">
          <span className="section-badge">Assessment Workspace</span>
          <h1 className="mt-4 font-display text-4xl text-white">Create a health profile snapshot</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-sky-100/72">
            Capture the key lifestyle and wellness signals used by the model. The interface is
            designed like a startup intake dashboard so the experience feels structured and calm.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="soft-card rounded-[1.4rem] p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-sky-100/55">Current BMI</p>
              <p className="mt-2 font-display text-4xl text-white">{bmi}</p>
            </div>
            <div className="soft-card rounded-[1.4rem] p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-sky-100/55">Profile</p>
              <p className="mt-2 font-display text-4xl text-white capitalize">{form.gender}</p>
            </div>
            <div className="soft-card rounded-[1.4rem] p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-sky-100/55">Output</p>
              <p className="mt-2 font-display text-4xl text-white">Instant</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <Field label="Age">
            <input
              className={baseInputClass()}
              type="number"
              min="18"
              max="55"
              value={form.age}
              onChange={(event) => updateField("age", event.target.value)}
              required
            />
          </Field>
          <Field label="Gender">
            <select
              className={baseInputClass()}
              value={form.gender}
              onChange={(event) => updateField("gender", event.target.value)}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </Field>
          <Field label="Height (cm)">
            <input
              className={baseInputClass()}
              type="number"
              min="120"
              max="220"
              value={form.heightCm}
              onChange={(event) => updateField("heightCm", event.target.value)}
              required
            />
          </Field>
          <Field label="Weight (kg)">
            <input
              className={baseInputClass()}
              type="number"
              min="35"
              max="200"
              value={form.weightKg}
              onChange={(event) => updateField("weightKg", event.target.value)}
              required
            />
          </Field>
          <Field label="Exercise Level" hint="0 = none, 5 = very active">
            <input
              className="dashboard-slider"
              type="range"
              min="0"
              max="5"
              step="1"
              value={form.exerciseLevel}
              onChange={(event) => updateField("exerciseLevel", event.target.value)}
            />
            <div className="mt-4 flex items-center justify-between text-sm text-slate-200">
              <span>Low</span>
              <span>{form.exerciseLevel} / 5</span>
              <span>High</span>
            </div>
          </Field>
          <Field label="Stress Level" hint="1 = low, 10 = high">
            <input
              className="dashboard-slider"
              type="range"
              min="1"
              max="10"
              step="1"
              value={form.stressLevel}
              onChange={(event) => updateField("stressLevel", event.target.value)}
            />
            <div className="mt-4 flex items-center justify-between text-sm text-slate-200">
              <span>Low</span>
              <span>{form.stressLevel} / 10</span>
              <span>High</span>
            </div>
          </Field>
          <Field label="Sleep Hours">
            <input
              className={baseInputClass()}
              type="number"
              min="3"
              max="12"
              step="0.5"
              value={form.sleepHours}
              onChange={(event) => updateField("sleepHours", event.target.value)}
              required
            />
          </Field>
          {form.gender !== "male" ? (
            <>
              <Field label="Smoking">
                <select
                  className={baseInputClass()}
                  value={String(form.smoking)}
                  onChange={(event) => updateField("smoking", event.target.value === "true")}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </Field>
              <Field label="Alcohol">
                <select
                  className={baseInputClass()}
                  value={String(form.alcohol)}
                  onChange={(event) => updateField("alcohol", event.target.value === "true")}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </Field>
            </>
          ) : null}
          <Field label="Calculated BMI">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 to-sky-300/10 px-4 py-3 text-lg text-white">
              {bmi}
            </div>
          </Field>

          {form.gender === "female" ? (
            <div className="glass panel-outline md:col-span-2 rounded-[1.75rem] p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">Female-Specific Inputs</p>
                  <h2 className="mt-2 font-display text-2xl text-white">Cycle and hormonal context</h2>
                </div>
                <div className="metric-pill text-xs">Optional context supported</div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Menstrual Cycle Regularity">
                  <select
                    className={baseInputClass()}
                    value={String(form.menstrualRegularity)}
                    onChange={(event) =>
                      updateField("menstrualRegularity", event.target.value === "true")
                    }
                  >
                    <option value="true">Regular</option>
                    <option value="false">Irregular</option>
                  </select>
                </Field>
                <Field label="PCOS">
                  <select
                    className={baseInputClass()}
                    value={String(form.pcos)}
                    onChange={(event) => updateField("pcos", event.target.value === "true")}
                  >
                    <option value="false">No / Not known</option>
                    <option value="true">Yes</option>
                  </select>
                </Field>
              </div>
            </div>
          ) : null}

          {form.gender === "male" ? (
            <div className="glass panel-outline md:col-span-2 rounded-[1.75rem] p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">Dataset-Aligned Male Context</p>
                  <h2 className="mt-2 font-display text-2xl text-white">UCI/Kaggle reference fields</h2>
                </div>
                <div className="metric-pill text-xs">Used for local male reference training</div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Smoking Habit">
                  <select
                    className={baseInputClass()}
                    value={form.smokingHabit}
                    onChange={(event) => updateField("smokingHabit", event.target.value)}
                  >
                    {smokingHabitOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Alcohol Frequency">
                  <select
                    className={baseInputClass()}
                    value={form.alcoholFrequency}
                    onChange={(event) => updateField("alcoholFrequency", event.target.value)}
                  >
                    {alcoholFrequencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Hours Sitting Per Day">
                  <input
                    className={baseInputClass()}
                    type="number"
                    min="1"
                    max="16"
                    step="0.5"
                    value={form.hoursSitting}
                    onChange={(event) => updateField("hoursSitting", event.target.value)}
                  />
                </Field>
                <Field label="High Fevers In Last Year">
                  <select
                    className={baseInputClass()}
                    value={form.highFeversLastYear}
                    onChange={(event) => updateField("highFeversLastYear", event.target.value)}
                  >
                    {highFeversLastYearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Child Diseases">
                  <select
                    className={baseInputClass()}
                    value={String(form.childDiseases)}
                    onChange={(event) => updateField("childDiseases", event.target.value === "true")}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </Field>
                <Field label="Accident Or Serious Trauma">
                  <select
                    className={baseInputClass()}
                    value={String(form.accidentTrauma)}
                    onChange={(event) => updateField("accidentTrauma", event.target.value === "true")}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </Field>
                <Field label="Surgical Intervention" className="md:col-span-2">
                  <select
                    className={baseInputClass()}
                    value={String(form.surgicalIntervention)}
                    onChange={(event) =>
                      updateField("surgicalIntervention", event.target.value === "true")
                    }
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </Field>
              </div>
            </div>
          ) : null}

          <div className="soft-card md:col-span-2 rounded-[1.75rem] p-5">
            {error ? (
              <div className="mb-4 rounded-2xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">Ready to score</p>
                <p className="mt-2 text-sm text-sky-100/72">
                  Submit this profile to generate the explainable dashboard and recommendations.
                </p>
              </div>
              <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-sky-100/65 sm:block">
                FastAPI + Express
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-aqua to-teal px-5 py-4 text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:shadow-float disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/40 border-t-ink" />
                  Analyzing profile...
                </>
              ) : (
                "Generate AI Insight"
              )}
            </button>
          </div>
        </form>
      </section>

      <aside className="space-y-6">
        <div className="glass panel-outline rounded-[2rem] p-6 shadow-panel">
          <div className="section-badge">Care Workflow</div>
          <div className="mt-5 space-y-4">
            {readinessCards.map((card, index) => (
              <div key={card.title} className="soft-card flex items-start gap-4 rounded-[1.5rem] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/25 to-teal/20 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="mt-2 text-sm leading-6 text-sky-100/70">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass panel-outline rounded-[2rem] p-6 shadow-panel">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">Signals Analyzed</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              "Age",
              "BMI",
              "Smoking",
              "Alcohol",
              "Exercise",
              "Stress",
              "Sleep",
              "Hours Sitting",
              "Fevers",
              "Cycle",
              "PCOS",
            ].map((item) => (
              <span key={item} className="metric-pill text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
        <Disclaimer />
      </aside>
    </div>
  );
}
