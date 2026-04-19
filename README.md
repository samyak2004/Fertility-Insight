# AI-Based Fertility Insight & Recommendation System

A full-stack demo application that estimates a fertility wellness score from lifestyle and health inputs, explains the main contributing factors, and generates personalized recommendations.

> Disclaimer: This is not a medical diagnosis. Consult a healthcare professional.

## Project Structure

```text
frontend/    React + Vite + Tailwind CSS + Recharts
backend/     Node.js + Express API gateway
ml-service/  Python + FastAPI + scikit-learn + SHAP
```

Bundled dataset assets:

```text
ml-service/data/uci_fertility.csv
ml-service/data/uci_fertility_metadata.json
```

## Prerequisites

- Node.js 18+ with npm
- Python 3.11+ installed and available as `python` or `py -3`

Tested locally with:

- Node.js `24.11.1`
- npm `11.6.4`
- Python `3.14.3`

## Features

- Responsive multi-page frontend
- Fertility assessment form with female-specific fields
- Optional dataset-aligned male context fields for a local reference model
- Automatic BMI calculation from height and weight
- RandomForestRegressor trained on synthetic data at startup
- RandomForestClassifier trained on the bundled UCI Fertility dataset for male reference insight
- SHAP-based factor explainability
- Rule-based recommendations
- Node backend that validates requests and proxies to the ML service

## Local Setup

### 1. Start the ML service

```bash
cd ml-service
py -3 -m venv .venv
.venv\Scripts\activate
py -3 -m pip install -r requirements.txt
py -3 -m uvicorn app.main:app --reload --port 8000
```

### 2. Start the backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

The backend runs on `http://localhost:5000`.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Environment Variables

### Backend

Create `backend/.env` from `backend/.env.example`.

```env
PORT=5000
ML_SERVICE_URL=http://localhost:8000
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend

Optional `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## API

### `POST /predict`

Request:

```json
{
  "age": 29,
  "heightCm": 165,
  "weightKg": 72,
  "smoking": false,
  "alcohol": true,
  "exerciseLevel": 3,
  "stressLevel": 7,
  "sleepHours": 6.5,
  "gender": "female",
  "menstrualRegularity": true,
  "pcos": false
}
```

Optional male-only dataset-aligned fields:

```json
{
  "smokingHabit": "daily",
  "alcoholFrequency": "several_times_week",
  "hoursSitting": 9,
  "childDiseases": false,
  "accidentTrauma": true,
  "surgicalIntervention": false,
  "highFeversLastYear": "none"
}
```

Response:

```json
{
  "score": 73.2,
  "bmi": 26.45,
  "riskBand": "Moderate",
  "factors": [
    {
      "feature": "Stress Level",
      "impact": -7.1,
      "direction": "negative"
    },
    {
      "feature": "Exercise Level",
      "impact": 5.4,
      "direction": "positive"
    }
  ],
  "recommendations": [
    "Aim for gradual weight management through balanced nutrition and regular activity.",
    "High stress can affect overall reproductive wellness, so add a daily recovery routine such as walking, breathing exercises, or mindfulness."
  ],
  "disclaimer": "This is not a medical diagnosis. Consult a healthcare professional.",
  "referenceInsight": null
}
```

## Notes

- The model is trained on synthetic data for demo and hackathon use.
- The score is a wellness-style indicator from `0` to `100`, not a medical diagnosis.
- Female-only inputs are ignored for male profiles.
- Male profiles can also use the bundled UCI Fertility dataset as a local reference signal.

## Verification

Recommended checks after installing dependencies:

```bash
cd ml-service && uvicorn app.main:app --reload --port 8000
cd backend && npm run dev
cd frontend && npm run dev
```

Verified in this workspace:

- ML service started successfully on `http://127.0.0.1:8000`
- Backend started successfully on `http://127.0.0.1:5000`
- Frontend Vite dev server started successfully on `http://127.0.0.1:5173`
- `POST /predict` through the backend returned a valid end-to-end response

# Fertility-Insight