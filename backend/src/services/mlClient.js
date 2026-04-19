import { config } from "../config.js";

export const requestPrediction = async (payload) => {
  const response = await fetch(`${config.mlServiceUrl}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `ML service error (${response.status}): ${errorText || "Unknown failure"}`
    );
  }

  return response.json();
};
