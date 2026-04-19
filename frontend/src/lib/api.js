const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function submitAssessment(payload, options = {}) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: options.signal,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to generate fertility insight.");
  }

  return data;
}
