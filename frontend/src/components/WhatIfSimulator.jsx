import {
  alcoholFrequencyOptions,
  highFeversLastYearOptions,
  smokingHabitOptions,
} from "../lib/maleReference";

function ControlCard({ label, children, hint, className = "" }) {
  return (
    <label className={`soft-card block rounded-[1.35rem] p-4 ${className}`}>
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

export default function WhatIfSimulator({
  form,
  currentScore,
  baselineScore,
  scoreDelta,
  isSimulating,
  isReady,
  error,
  onFieldChange,
  onReset,
}) {
  if (!form) {
    return null;
  }

  const deltaTone =
    scoreDelta > 0
      ? "text-emerald-100 border-emerald-300/25 bg-emerald-300/10"
      : scoreDelta < 0
        ? "text-rose-100 border-rose-300/25 bg-rose-300/10"
        : "text-sky-100 border-sky-300/20 bg-sky-300/10";

  const heightMeters = Number(form.heightCm) / 100;
  const bmi =
    heightMeters && Number(form.weightKg)
      ? Number((Number(form.weightKg) / (heightMeters * heightMeters)).toFixed(2))
      : 0;

  return (
    <div className="glass panel-outline relative overflow-hidden rounded-[2rem] p-6 shadow-panel">
      <div className="absolute left-6 top-8 h-24 w-24 rounded-full bg-sky-300/10 blur-3xl" />
      <div className="absolute bottom-0 right-8 h-28 w-28 rounded-full bg-teal/10 blur-3xl" />
      <div className="relative">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="section-badge">What-If Simulator</div>
            <h2 className="mt-4 font-display text-3xl text-white">Try alternative scenarios live</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-sky-100/72">
              Adjust inputs below and the score, factor chart, and recommendations will refresh
              automatically using the same backend prediction pipeline.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row lg:flex-col lg:items-end">
            <div className="metric-pill text-xs">
              {isSimulating ? "Refreshing prediction..." : "Live update enabled"}
            </div>
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-50/85 transition duration-300 hover:bg-white/10"
            >
              Reset Baseline
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="soft-card rounded-[1.4rem] p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-sky-100/55">Current Score</p>
            <p className="mt-2 font-display text-5xl text-white">{currentScore}</p>
          </div>
          <div className="soft-card rounded-[1.4rem] p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-sky-100/55">Baseline Score</p>
            <p className="mt-2 font-display text-5xl text-white">{baselineScore}</p>
          </div>
          <div className={`rounded-[1.4rem] border p-4 ${deltaTone}`}>
            <p className="text-xs uppercase tracking-[0.25em] opacity-75">Scenario Shift</p>
            <p className="mt-2 font-display text-5xl">
              {scoreDelta > 0 ? "+" : ""}
              {scoreDelta}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="metric-pill justify-between text-sm">
            <span>BMI</span>
            <span>{bmi}</span>
          </div>
          <div className="metric-pill justify-between text-sm">
            <span>Sleep</span>
            <span>{form.sleepHours} h</span>
          </div>
          <div className="metric-pill justify-between text-sm">
            <span>Stress</span>
            <span>{form.stressLevel}/10</span>
          </div>
          <div className="metric-pill justify-between text-sm">
            <span>Exercise</span>
            <span>{form.exerciseLevel}/5</span>
          </div>
          {form.gender === "male" ? (
            <div className="metric-pill justify-between text-sm">
              <span>Sitting</span>
              <span>{form.hoursSitting} h</span>
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ControlCard label="Age">
            <input
              className={baseInputClass()}
              type="number"
              min="18"
              max="55"
              value={form.age}
              onChange={(event) => onFieldChange("age", event.target.value === "" ? "" : Number(event.target.value))}
            />
          </ControlCard>
          <ControlCard label="Gender">
            <select
              className={baseInputClass()}
              value={form.gender}
              onChange={(event) => onFieldChange("gender", event.target.value)}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </ControlCard>
          <ControlCard label="Height (cm)">
            <input
              className={baseInputClass()}
              type="number"
              min="120"
              max="220"
              value={form.heightCm}
              onChange={(event) =>
                onFieldChange("heightCm", event.target.value === "" ? "" : Number(event.target.value))
              }
            />
          </ControlCard>
          <ControlCard label="Weight (kg)">
            <input
              className={baseInputClass()}
              type="number"
              min="35"
              max="200"
              value={form.weightKg}
              onChange={(event) =>
                onFieldChange("weightKg", event.target.value === "" ? "" : Number(event.target.value))
              }
            />
          </ControlCard>
          <ControlCard label="Exercise Level" hint="0 = none, 5 = very active">
            <input
              className="dashboard-slider"
              type="range"
              min="0"
              max="5"
              step="1"
              value={form.exerciseLevel}
              onChange={(event) => onFieldChange("exerciseLevel", Number(event.target.value))}
            />
            <div className="mt-4 flex items-center justify-between text-sm text-slate-200">
              <span>Low</span>
              <span>{form.exerciseLevel} / 5</span>
              <span>High</span>
            </div>
          </ControlCard>
          <ControlCard label="Stress Level" hint="1 = low, 10 = high">
            <input
              className="dashboard-slider"
              type="range"
              min="1"
              max="10"
              step="1"
              value={form.stressLevel}
              onChange={(event) => onFieldChange("stressLevel", Number(event.target.value))}
            />
            <div className="mt-4 flex items-center justify-between text-sm text-slate-200">
              <span>Low</span>
              <span>{form.stressLevel} / 10</span>
              <span>High</span>
            </div>
          </ControlCard>
          <ControlCard label="Sleep Hours">
            <input
              className={baseInputClass()}
              type="number"
              min="3"
              max="12"
              step="0.5"
              value={form.sleepHours}
              onChange={(event) =>
                onFieldChange("sleepHours", event.target.value === "" ? "" : Number(event.target.value))
              }
            />
          </ControlCard>
          {form.gender !== "male" ? (
            <>
              <ControlCard label="Smoking">
                <select
                  className={baseInputClass()}
                  value={String(form.smoking)}
                  onChange={(event) => onFieldChange("smoking", event.target.value === "true")}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </ControlCard>
              <ControlCard label="Alcohol">
                <select
                  className={baseInputClass()}
                  value={String(form.alcohol)}
                  onChange={(event) => onFieldChange("alcohol", event.target.value === "true")}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </ControlCard>
            </>
          ) : null}
        </div>

        {form.gender === "female" ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ControlCard label="Menstrual Cycle Regularity">
              <select
                className={baseInputClass()}
                value={String(form.menstrualRegularity)}
                onChange={(event) => onFieldChange("menstrualRegularity", event.target.value === "true")}
              >
                <option value="true">Regular</option>
                <option value="false">Irregular</option>
              </select>
            </ControlCard>
            <ControlCard label="PCOS">
              <select
                className={baseInputClass()}
                value={String(form.pcos)}
                onChange={(event) => onFieldChange("pcos", event.target.value === "true")}
              >
                <option value="false">No / Not known</option>
                <option value="true">Yes</option>
              </select>
            </ControlCard>
          </div>
        ) : null}

        {form.gender === "male" ? (
          <div className="mt-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">Dataset-Aligned Male Context</p>
                <p className="mt-2 text-sm text-sky-100/72">
                  These inputs feed the local UCI/Kaggle male reference model used alongside the wellness score.
                </p>
              </div>
              <div className="metric-pill text-xs">Male reference enabled</div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <ControlCard label="Smoking Habit">
                <select
                  className={baseInputClass()}
                  value={form.smokingHabit}
                  onChange={(event) => onFieldChange("smokingHabit", event.target.value)}
                >
                  {smokingHabitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </ControlCard>
              <ControlCard label="Alcohol Frequency">
                <select
                  className={baseInputClass()}
                  value={form.alcoholFrequency}
                  onChange={(event) => onFieldChange("alcoholFrequency", event.target.value)}
                >
                  {alcoholFrequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </ControlCard>
              <ControlCard label="Hours Sitting Per Day">
                <input
                  className={baseInputClass()}
                  type="number"
                  min="1"
                  max="16"
                  step="0.5"
                  value={form.hoursSitting}
                  onChange={(event) =>
                    onFieldChange("hoursSitting", event.target.value === "" ? "" : Number(event.target.value))
                  }
                />
              </ControlCard>
              <ControlCard label="High Fevers In Last Year">
                <select
                  className={baseInputClass()}
                  value={form.highFeversLastYear}
                  onChange={(event) => onFieldChange("highFeversLastYear", event.target.value)}
                >
                  {highFeversLastYearOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </ControlCard>
              <ControlCard label="Child Diseases">
                <select
                  className={baseInputClass()}
                  value={String(form.childDiseases)}
                  onChange={(event) => onFieldChange("childDiseases", event.target.value === "true")}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </ControlCard>
              <ControlCard label="Accident Or Trauma">
                <select
                  className={baseInputClass()}
                  value={String(form.accidentTrauma)}
                  onChange={(event) => onFieldChange("accidentTrauma", event.target.value === "true")}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </ControlCard>
              <ControlCard label="Surgical Intervention" className="md:col-span-2 xl:col-span-3">
                <select
                  className={baseInputClass()}
                  value={String(form.surgicalIntervention)}
                  onChange={(event) =>
                    onFieldChange("surgicalIntervention", event.target.value === "true")
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </ControlCard>
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-sky-100/68">
            {isReady
              ? "Changes are valid. The dashboard refreshes automatically a moment after each edit."
              : "Complete valid values within the supported ranges to refresh the scenario."}
          </p>
          {isSimulating ? (
            <div className="flex items-center gap-2 text-sm text-sky-100/75">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-100/30 border-t-sky-100" />
              Updating score
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-[1.3rem] border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
