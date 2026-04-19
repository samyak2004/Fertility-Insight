export const maleReferenceDefaults = {
  smokingHabit: "never",
  alcoholFrequency: "never",
  hoursSitting: 6,
  childDiseases: false,
  accidentTrauma: false,
  surgicalIntervention: false,
  highFeversLastYear: "none",
};

export const smokingHabitOptions = [
  { value: "never", label: "Never" },
  { value: "occasional", label: "Occasional" },
  { value: "daily", label: "Daily" },
];

export const alcoholFrequencyOptions = [
  { value: "never", label: "Hardly ever / never" },
  { value: "weekly", label: "Once a week" },
  { value: "several_times_week", label: "Several times a week" },
  { value: "daily", label: "Every day" },
];

export const highFeversLastYearOptions = [
  { value: "none", label: "No" },
  { value: "more_than_3_months", label: "More than 3 months ago" },
  { value: "less_than_3_months", label: "Less than 3 months ago" },
];

export function fillMaleReferenceFields(payload = {}) {
  return {
    ...maleReferenceDefaults,
    ...payload,
    smokingHabit:
      payload.smokingHabit ?? (payload.smoking ? "occasional" : maleReferenceDefaults.smokingHabit),
    alcoholFrequency:
      payload.alcoholFrequency ??
      (payload.alcohol ? "weekly" : maleReferenceDefaults.alcoholFrequency),
    hoursSitting: payload.hoursSitting ?? maleReferenceDefaults.hoursSitting,
  };
}
