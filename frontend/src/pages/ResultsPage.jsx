import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Disclaimer from "../components/Disclaimer";
import FactorBarChart from "../components/FactorBarChart";
import RecommendationList from "../components/RecommendationList";
import ScoreRing from "../components/ScoreRing";
import StatCard from "../components/StatCard";
import WhatIfSimulator from "../components/WhatIfSimulator";
import { submitAssessment } from "../lib/api";
import { fillMaleReferenceFields } from "../lib/maleReference";

const numericFieldRanges = {
  age: [18, 55],
  heightCm: [120, 220],
  weightKg: [35, 200],
  exerciseLevel: [0, 5],
  stressLevel: [1, 10],
  sleepHours: [3, 12],
};

function hydratePayload(payload) {
  if (!payload) {
    return null;
  }

  return String(payload.gender || "").toLowerCase() === "male"
    ? fillMaleReferenceFields(payload)
    : payload;
}

function hydrateState(state) {
  if (!state?.payload) {
    return state;
  }

  return {
    ...state,
    payload: hydratePayload(state.payload),
  };
}

function normalizeSimulatorPayload(form) {
  if (!form) {
    return null;
  }

  const gender = String(form.gender || "").toLowerCase();
  const hydratedForm = gender === "male" ? fillMaleReferenceFields(form) : form;

  return {
    ...hydratedForm,
    age: Number(hydratedForm.age),
    heightCm: Number(hydratedForm.heightCm),
    weightKg: Number(hydratedForm.weightKg),
    exerciseLevel: Number(hydratedForm.exerciseLevel),
    stressLevel: Number(hydratedForm.stressLevel),
    sleepHours: Number(hydratedForm.sleepHours),
    hoursSitting: gender === "male" ? Number(hydratedForm.hoursSitting) : null,
    smoking:
      gender === "male"
        ? hydratedForm.smokingHabit !== "never"
        : Boolean(hydratedForm.smoking),
    alcohol:
      gender === "male"
        ? hydratedForm.alcoholFrequency !== "never"
        : Boolean(hydratedForm.alcohol),
    gender,
    menstrualRegularity: gender === "female" ? Boolean(hydratedForm.menstrualRegularity) : false,
    pcos: gender === "female" ? Boolean(hydratedForm.pcos) : false,
  };
}

function isValueInRange(value, min, max) {
  return value !== "" && Number.isFinite(Number(value)) && Number(value) >= min && Number(value) <= max;
}

function isSimulatorPayloadReady(form) {
  if (!form) {
    return false;
  }

  const payload = normalizeSimulatorPayload(form);

  if (!["male", "female"].includes(payload.gender)) {
    return false;
  }

  const baseReady = Object.entries(numericFieldRanges).every(([field, [min, max]]) =>
    isValueInRange(form[field], min, max)
  );

  if (!baseReady) {
    return false;
  }

  if (payload.gender === "male") {
    return isValueInRange(form.hoursSitting, 1, 16);
  }

  return true;
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [payloadState, setPayloadState] = useState(() => hydrateState(location.state || null));
  const [baselineState, setBaselineState] = useState(() => hydrateState(location.state || null));
  const [simulatorForm, setSimulatorForm] = useState(() => hydratePayload(location.state?.payload || null));
  const [hasSimulatorChanges, setHasSimulatorChanges] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatorError, setSimulatorError] = useState("");

  useEffect(() => {
    if (!payloadState) {
      const cached = localStorage.getItem("fertilityInsightResult");
      if (cached) {
        setPayloadState(hydrateState(JSON.parse(cached)));
      }
    }
  }, [payloadState]);

  useEffect(() => {
    if (!baselineState && payloadState?.result && payloadState?.payload) {
      setBaselineState(payloadState);
    }

    if (!simulatorForm && payloadState?.payload) {
      setSimulatorForm(payloadState.payload);
    }
  }, [baselineState, payloadState, simulatorForm]);

  const simulatorReady = isSimulatorPayloadReady(simulatorForm);

  useEffect(() => {
    if (!simulatorForm || !hasSimulatorChanges) {
      return undefined;
    }

    if (!simulatorReady) {
      setSimulatorError("Complete valid values within the supported ranges to refresh the scenario.");
      return undefined;
    }

    setSimulatorError("");

    let active = true;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSimulating(true);
        const nextPayload = normalizeSimulatorPayload(simulatorForm);
        const nextResult = await submitAssessment(nextPayload, {
          signal: controller.signal,
        });

        if (!active) {
          return;
        }

        const nextState = {
          result: nextResult,
          payload: nextPayload,
        };

        setPayloadState(nextState);
        localStorage.setItem("fertilityInsightResult", JSON.stringify(nextState));
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setSimulatorError(error.message);
        }
      } finally {
        if (active) {
          setIsSimulating(false);
        }
      }
    }, 350);

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [hasSimulatorChanges, simulatorForm, simulatorReady]);

  const chartData =
    payloadState?.result?.factors?.slice().sort((a, b) => a.impact - b.impact) || [];

  if (!payloadState?.result) {
    return (
      <div className="glass panel-outline mx-auto max-w-2xl rounded-[2rem] p-10 text-center shadow-panel">
        <h1 className="font-display text-4xl text-white">No result yet</h1>
        <p className="mt-4 text-sky-100/72">
          Complete the assessment first to generate your insight dashboard.
        </p>
        <button
          type="button"
          onClick={() => navigate("/assessment")}
          className="mt-8 rounded-full bg-gradient-to-r from-aqua to-teal px-6 py-3 text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
        >
          Go to Assessment
        </button>
      </div>
    );
  }

  const { result, payload } = payloadState;
  const topFactor = result.factors[0];
  const baselineScore = baselineState?.result?.score ?? result.score;
  const scoreDelta = Number((result.score - baselineScore).toFixed(1));
  const referenceInsight = result.referenceInsight || null;
  const profileItems = [
    { label: "Age", value: payload.age },
    { label: "BMI", value: result.bmi },
    { label: "Exercise", value: `${payload.exerciseLevel}/5` },
    { label: "Stress", value: `${payload.stressLevel}/10` },
    { label: "Sleep", value: `${payload.sleepHours} h` },
    { label: "Smoking", value: payload.smoking ? "Yes" : "No" },
    ...(payload.gender === "male"
      ? [{ label: "Hours Sitting", value: `${payload.hoursSitting} h` }]
      : []),
    ...(referenceInsight
      ? [
          {
            label: "Dataset Signal",
            value: `${Math.round(referenceInsight.probabilityNormal * 100)}% normal`,
          },
        ]
      : []),
  ];

  const handleSimulatorFieldChange = (field, value) => {
    setHasSimulatorChanges(true);
    setSimulatorError("");
    setSimulatorForm((current) => {
      if (!current) {
        return current;
      }

      const next = {
        ...current,
        [field]: value,
      };

      if (field === "gender" && value === "male") {
        return fillMaleReferenceFields({
          ...next,
          gender: value,
          menstrualRegularity: false,
          pcos: false,
        });
      }

      if (field === "gender" && value === "female") {
        next.menstrualRegularity = false;
        next.pcos = false;
      }

      if (field === "smokingHabit") {
        next.smoking = value !== "never";
      }

      if (field === "alcoholFrequency") {
        next.alcohol = value !== "never";
      }

      return next;
    });
  };

  const handleResetSimulator = () => {
    if (!baselineState?.payload || !baselineState?.result) {
      return;
    }

    setHasSimulatorChanges(false);
    setIsSimulating(false);
    setSimulatorError("");
    setSimulatorForm(baselineState.payload);
    setPayloadState(baselineState);
    localStorage.setItem("fertilityInsightResult", JSON.stringify(baselineState));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="section-badge">Results Dashboard</div>
          <h1 className="mt-3 font-display text-4xl text-white">AI Fertility Insight</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-sky-100/72">
            A score-based snapshot with explainable factor impacts and habit-focused recommendations.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="metric-pill text-sm">Wellness band: {result.riskBand}</div>
            <div className="metric-pill text-sm">Recommendations: {result.recommendations.length}</div>
            {topFactor ? <div className="metric-pill text-sm">Top factor: {topFactor.feature}</div> : null}
            {referenceInsight ? (
              <div className="metric-pill text-sm">
                Dataset model: {referenceInsight.coverage === "direct" ? "Direct" : "Derived"}
              </div>
            ) : null}
          </div>
        </div>
        <Link
          to="/assessment"
          className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-sky-50/85 transition duration-300 hover:bg-white/10"
        >
          Run Another Assessment
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <ScoreRing score={result.score} riskBand={result.riskBand} />
        <div className="grid gap-6 sm:grid-cols-2">
          <StatCard label="BMI" value={result.bmi} accent="text-sand" meta="Calculated from height and weight" />
          <StatCard
            label="Gender"
            value={`${payload.gender.charAt(0).toUpperCase()}${payload.gender.slice(1)}`}
            accent="text-glow"
            meta="Used to adapt optional profile inputs"
          />
          <StatCard label="Sleep" value={`${payload.sleepHours} h`} accent="text-leaf" meta="Daily recovery input" />
          <StatCard
            label="Top Factor"
            value={topFactor ? topFactor.feature : "N/A"}
            accent={topFactor?.direction === "negative" ? "text-rose-200" : "text-glow"}
            meta={topFactor ? `${topFactor.impact > 0 ? "+" : ""}${topFactor.impact} impact` : "No factors found"}
          />
          {referenceInsight ? (
            <StatCard
              label="Dataset Reference"
              value={`${Math.round(referenceInsight.probabilityNormal * 100)}%`}
              accent="text-aqua"
              meta={`Male ${referenceInsight.coverage} UCI/Kaggle normal-pattern signal`}
            />
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <WhatIfSimulator
          form={simulatorForm}
          currentScore={result.score}
          baselineScore={baselineScore}
          scoreDelta={scoreDelta}
          isSimulating={isSimulating}
          isReady={simulatorReady}
          error={simulatorError}
          onFieldChange={handleSimulatorFieldChange}
          onReset={handleResetSimulator}
        />
        <FactorBarChart data={chartData} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="glass panel-outline rounded-[2rem] p-6 shadow-panel">
          <div className="section-badge">Profile Snapshot</div>
          <div className="mt-5 grid gap-3">
            {profileItems.map((item) => (
              <div key={item.label} className="soft-card flex items-center justify-between rounded-[1.4rem] px-4 py-4">
                <span className="text-sm text-sky-100/70">{item.label}</span>
                <span className="text-sm font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
          {referenceInsight ? (
            <div className="soft-card mt-4 rounded-[1.5rem] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-100/55">Dataset Note</p>
              <p className="mt-3 text-sm leading-6 text-sky-100/74">{referenceInsight.note}</p>
            </div>
          ) : null}
        </div>
        <RecommendationList items={result.recommendations} />
      </div>

      <Disclaimer />
    </div>
  );
}
