const booleanFields = ["smoking", "alcohol"];
const smokingHabitOptions = new Set(["never", "occasional", "daily"]);
const alcoholFrequencyOptions = new Set([
  "never",
  "weekly",
  "several_times_week",
  "daily",
]);
const highFeverOptions = new Set([
  "none",
  "more_than_3_months",
  "less_than_3_months",
]);

const toNumber = (value) => Number(value);

const ensureRange = (label, value, min, max) => {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${label} must be between ${min} and ${max}.`);
  }
};

export const normalizePayload = (input) => {
  if (!input || typeof input !== "object") {
    throw new Error("Request body must be a JSON object.");
  }

  const payload = {
    age: toNumber(input.age),
    heightCm: toNumber(input.heightCm),
    weightKg: toNumber(input.weightKg),
    smoking: Boolean(input.smoking),
    alcohol: Boolean(input.alcohol),
    exerciseLevel: toNumber(input.exerciseLevel),
    stressLevel: toNumber(input.stressLevel),
    sleepHours: toNumber(input.sleepHours),
    gender: String(input.gender || "").toLowerCase(),
  };

  ensureRange("Age", payload.age, 18, 55);
  ensureRange("Height", payload.heightCm, 120, 220);
  ensureRange("Weight", payload.weightKg, 35, 200);
  ensureRange("Exercise level", payload.exerciseLevel, 0, 5);
  ensureRange("Stress level", payload.stressLevel, 1, 10);
  ensureRange("Sleep hours", payload.sleepHours, 3, 12);

  if (!["male", "female"].includes(payload.gender)) {
    throw new Error("Gender must be either 'male' or 'female'.");
  }

  for (const field of booleanFields) {
    if (typeof input[field] !== "boolean") {
      throw new Error(`${field} must be true or false.`);
    }
  }

  if (payload.gender === "female") {
    if (typeof input.menstrualRegularity !== "boolean") {
      throw new Error("menstrualRegularity must be true or false for female users.");
    }

    if (
      typeof input.pcos !== "undefined" &&
      typeof input.pcos !== "boolean"
    ) {
      throw new Error("pcos must be true or false when provided.");
    }

    payload.menstrualRegularity = input.menstrualRegularity;
    payload.pcos = typeof input.pcos === "boolean" ? input.pcos : false;
    payload.smokingHabit = null;
    payload.alcoholFrequency = null;
    payload.hoursSitting = null;
    payload.childDiseases = null;
    payload.accidentTrauma = null;
    payload.surgicalIntervention = null;
    payload.highFeversLastYear = null;
    payload.maleReferenceCoverage = null;
  } else {
    payload.menstrualRegularity = false;
    payload.pcos = false;

    const smokingHabit =
      typeof input.smokingHabit === "string"
        ? input.smokingHabit
        : payload.smoking
          ? "occasional"
          : "never";
    const alcoholFrequency =
      typeof input.alcoholFrequency === "string"
        ? input.alcoholFrequency
        : payload.alcohol
          ? "weekly"
          : "never";
    const hoursSitting =
      typeof input.hoursSitting !== "undefined"
        ? toNumber(input.hoursSitting)
        : Number(Math.max(1, Math.min(16, (11 - payload.exerciseLevel * 1.2).toFixed(1))));
    const childDiseases =
      typeof input.childDiseases === "boolean" ? input.childDiseases : false;
    const accidentTrauma =
      typeof input.accidentTrauma === "boolean" ? input.accidentTrauma : false;
    const surgicalIntervention =
      typeof input.surgicalIntervention === "boolean"
        ? input.surgicalIntervention
        : false;
    const highFeversLastYear =
      typeof input.highFeversLastYear === "string"
        ? input.highFeversLastYear
        : "none";

    if (!smokingHabitOptions.has(smokingHabit)) {
      throw new Error("smokingHabit must be one of never, occasional, or daily.");
    }

    if (!alcoholFrequencyOptions.has(alcoholFrequency)) {
      throw new Error(
        "alcoholFrequency must be one of never, weekly, several_times_week, or daily."
      );
    }

    if (!highFeverOptions.has(highFeversLastYear)) {
      throw new Error(
        "highFeversLastYear must be one of none, more_than_3_months, or less_than_3_months."
      );
    }

    ensureRange("Hours sitting", hoursSitting, 1, 16);

    payload.smokingHabit = smokingHabit;
    payload.alcoholFrequency = alcoholFrequency;
    payload.hoursSitting = hoursSitting;
    payload.childDiseases = childDiseases;
    payload.accidentTrauma = accidentTrauma;
    payload.surgicalIntervention = surgicalIntervention;
    payload.highFeversLastYear = highFeversLastYear;
    payload.smoking = smokingHabit !== "never";
    payload.alcohol = alcoholFrequency !== "never";

    const maleReferenceFields = [
      "smokingHabit",
      "alcoholFrequency",
      "hoursSitting",
      "childDiseases",
      "accidentTrauma",
      "surgicalIntervention",
      "highFeversLastYear",
    ];
    payload.maleReferenceCoverage = maleReferenceFields.every((field) =>
      Object.prototype.hasOwnProperty.call(input, field)
    )
      ? "direct"
      : "derived";
  }

  const heightMeters = payload.heightCm / 100;
  payload.bmi = Number((payload.weightKg / (heightMeters * heightMeters)).toFixed(2));

  return payload;
};
