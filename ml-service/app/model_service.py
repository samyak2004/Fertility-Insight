from __future__ import annotations

from datetime import datetime
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List

import numpy as np
import pandas as pd
import shap
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor


DISCLAIMER = "This is not a medical diagnosis. Consult a healthcare professional."
DATASET_SOURCE = (
    "UCI Fertility dataset (the same public dataset commonly reused in Kaggle fertility notebooks)."
)
REFERENCE_DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "uci_fertility.csv"


@dataclass
class FertilityModelArtifacts:
    model: RandomForestRegressor
    explainer: shap.TreeExplainer
    feature_columns: List[str]
    feature_labels: Dict[str, str]


@dataclass
class MaleReferenceArtifacts:
    model: RandomForestClassifier
    feature_columns: List[str]
    default_row: Dict[str, float]
    dataset_rows: int
    class_labels: List[str]


class FertilityModelService:
    def __init__(self, random_state: int = 42) -> None:
        self.random_state = random_state
        self.rng = np.random.default_rng(random_state)
        self.score_artifacts = self._train_score_model()
        self.reference_artifacts = self._train_reference_model()

    def _train_score_model(self) -> FertilityModelArtifacts:
        rows = 3500
        ages = self.rng.integers(18, 46, rows)
        heights = self.rng.normal(168, 10, rows).clip(145, 198)
        weights = self.rng.normal(72, 16, rows).clip(42, 135)
        bmi = weights / np.square(heights / 100)
        smoking = self.rng.binomial(1, 0.23, rows)
        alcohol = self.rng.binomial(1, 0.34, rows)
        exercise = self.rng.integers(0, 6, rows)
        stress = self.rng.integers(1, 11, rows)
        sleep = self.rng.normal(7.0, 1.2, rows).clip(3.5, 10.5)
        gender_male = self.rng.binomial(1, 0.48, rows)
        menstrual_regularity = np.where(
            gender_male == 1,
            0,
            self.rng.binomial(1, 0.76, rows),
        )
        pcos = np.where(
            gender_male == 1,
            0,
            self.rng.binomial(1, 0.14, rows),
        )

        score = (
            88
            - 0.85 * np.abs(ages - 29)
            - 0.95 * np.maximum(bmi - 25, 0)
            - 0.35 * np.maximum(19 - bmi, 0)
            - 7.5 * smoking
            - 2.5 * alcohol
            + 2.8 * exercise
            - 2.1 * np.maximum(stress - 5, 0)
            + 1.8 * np.clip(sleep - 6, -2, 2)
            + 1.2 * gender_male
            + 5.0 * menstrual_regularity
            - 8.0 * pcos
            + self.rng.normal(0, 3.5, rows)
        )
        score = np.clip(score, 5, 98)

        feature_columns = [
            "age",
            "bmi",
            "smoking",
            "alcohol",
            "exercise_level",
            "stress_level",
            "sleep_hours",
            "gender_male",
            "menstrual_regularity",
            "pcos",
        ]
        feature_labels = {
            "age": "Age",
            "bmi": "BMI",
            "smoking": "Smoking",
            "alcohol": "Alcohol",
            "exercise_level": "Exercise Level",
            "stress_level": "Stress Level",
            "sleep_hours": "Sleep Hours",
            "gender_male": "Gender",
            "menstrual_regularity": "Menstrual Regularity",
            "pcos": "PCOS",
        }

        frame = pd.DataFrame(
            {
                "age": ages,
                "bmi": bmi,
                "smoking": smoking,
                "alcohol": alcohol,
                "exercise_level": exercise,
                "stress_level": stress,
                "sleep_hours": sleep,
                "gender_male": gender_male,
                "menstrual_regularity": menstrual_regularity,
                "pcos": pcos,
                "target": score,
            }
        )

        model = RandomForestRegressor(
            n_estimators=240,
            max_depth=10,
            min_samples_leaf=3,
            random_state=self.random_state,
        )
        model.fit(frame[feature_columns], frame["target"])
        explainer = shap.TreeExplainer(model)

        return FertilityModelArtifacts(
            model=model,
            explainer=explainer,
            feature_columns=feature_columns,
            feature_labels=feature_labels,
        )

    def _train_reference_model(self) -> MaleReferenceArtifacts | None:
        if not REFERENCE_DATA_PATH.exists():
            return None

        frame = pd.read_csv(REFERENCE_DATA_PATH)
        feature_columns = [
            "season",
            "age",
            "child_diseases",
            "accident",
            "surgical_intervention",
            "high_fevers",
            "alcohol",
            "smoking",
            "hrs_sitting",
        ]
        classifier = RandomForestClassifier(
            n_estimators=220,
            max_depth=8,
            min_samples_leaf=2,
            random_state=self.random_state,
            class_weight="balanced",
        )
        classifier.fit(frame[feature_columns], frame["diagnosis"])

        default_row = {
            column: float(frame[column].median())
            for column in feature_columns
        }

        return MaleReferenceArtifacts(
            model=classifier,
            feature_columns=feature_columns,
            default_row=default_row,
            dataset_rows=len(frame),
            class_labels=list(classifier.classes_),
        )

    def _build_feature_frame(self, payload: Dict) -> pd.DataFrame:
        row = {
            "age": payload["age"],
            "bmi": payload["bmi"],
            "smoking": int(payload["smoking"]),
            "alcohol": int(payload["alcohol"]),
            "exercise_level": payload["exerciseLevel"],
            "stress_level": payload["stressLevel"],
            "sleep_hours": payload["sleepHours"],
            "gender_male": 1 if payload["gender"] == "male" else 0,
            "menstrual_regularity": int(
                payload["menstrualRegularity"] if payload["gender"] == "female" else False
            ),
            "pcos": int(payload["pcos"] if payload["gender"] == "female" else False),
        }
        return pd.DataFrame([row], columns=self.score_artifacts.feature_columns)

    def _encode_reference_age(self, age: float) -> float:
        return round(float(np.clip((age - 18) / 18, 0, 1)), 2)

    def _encode_reference_hours_sitting(self, hours: float) -> float:
        return round(float(np.clip((hours - 1) / 15, 0, 1)), 2)

    def _encode_reference_smoking(self, value: str) -> float:
        mapping = {
            "never": -1.0,
            "occasional": 0.0,
            "daily": 1.0,
        }
        return mapping.get(value, 0.0)

    def _encode_reference_alcohol(self, value: str) -> float:
        mapping = {
            "daily": 0.25,
            "several_times_week": 0.5,
            "weekly": 0.75,
            "never": 1.0,
        }
        return mapping.get(value, 0.75)

    def _encode_reference_high_fevers(self, value: str) -> float:
        mapping = {
            "less_than_3_months": -1.0,
            "more_than_3_months": 0.0,
            "none": 1.0,
        }
        return mapping.get(value, 1.0)

    def _encode_reference_season(self) -> float:
        month = datetime.now().month
        if month in {12, 1, 2}:
            return -1.0
        if month in {3, 4, 5}:
            return -0.33
        if month in {6, 7, 8}:
            return 0.33
        return 1.0

    def _build_reference_frame(self, payload: Dict) -> pd.DataFrame | None:
        if self.reference_artifacts is None:
            return None

        row = dict(self.reference_artifacts.default_row)
        row.update(
            {
                "season": self._encode_reference_season(),
                "age": self._encode_reference_age(payload["age"]),
                "child_diseases": int(bool(payload.get("childDiseases", False))),
                "accident": int(bool(payload.get("accidentTrauma", False))),
                "surgical_intervention": int(bool(payload.get("surgicalIntervention", False))),
                "high_fevers": self._encode_reference_high_fevers(
                    payload.get("highFeversLastYear", "none")
                ),
                "alcohol": self._encode_reference_alcohol(
                    payload.get("alcoholFrequency", "never")
                ),
                "smoking": self._encode_reference_smoking(
                    payload.get("smokingHabit", "never")
                ),
                "hrs_sitting": self._encode_reference_hours_sitting(
                    float(payload.get("hoursSitting", 6))
                ),
            }
        )

        return pd.DataFrame([row], columns=self.reference_artifacts.feature_columns)

    def _predict_reference_insight(self, payload: Dict) -> Dict | None:
        if self.reference_artifacts is None or payload["gender"] != "male":
            return None

        feature_frame = self._build_reference_frame(payload)
        if feature_frame is None:
            return None

        probabilities = self.reference_artifacts.model.predict_proba(feature_frame)[0]
        normal_index = self.reference_artifacts.class_labels.index("N")
        probability_normal = float(probabilities[normal_index])

        coverage = payload.get("maleReferenceCoverage") or "derived"
        note = (
            "Male-only reference model trained from the local UCI/Kaggle fertility dataset. "
            "It supplements the app score and should not be treated as a diagnosis."
        )
        if coverage == "derived":
            note += " Some reference fields were estimated from the broader wellness form."

        return {
            "source": DATASET_SOURCE,
            "datasetRows": self.reference_artifacts.dataset_rows,
            "probabilityNormal": round(probability_normal, 3),
            "probabilityAltered": round(1 - probability_normal, 3),
            "coverage": coverage,
            "note": note,
        }

    def _risk_band(self, score: float) -> str:
        if score >= 80:
            return "Favorable"
        if score >= 60:
            return "Moderate"
        return "Needs Attention"

    def _recommendations(self, payload: Dict, reference_insight: Dict | None) -> List[str]:
        recommendations: List[str] = []
        bmi = payload["bmi"]

        if bmi >= 25:
            recommendations.append(
                "Aim for gradual weight management through balanced nutrition and regular activity."
            )
        elif bmi < 18.5:
            recommendations.append(
                "Consider a nutrition review to support a healthy BMI and energy balance."
            )

        if payload["smoking"]:
            recommendations.append(
                "Reducing or quitting smoking can improve overall reproductive wellness."
            )

        if payload["alcohol"]:
            recommendations.append(
                "Moderating alcohol intake may support hormone balance and general health."
            )

        if payload["stressLevel"] >= 7:
            recommendations.append(
                "High stress can affect overall reproductive wellness, so add a daily recovery routine such as walking, breathing exercises, or mindfulness."
            )

        if payload["exerciseLevel"] <= 1:
            recommendations.append(
                "Try building toward consistent moderate exercise, such as 30 minutes of movement on most days."
            )

        if payload["sleepHours"] < 7:
            recommendations.append(
                "Target 7 to 9 hours of sleep to support recovery, hormones, and energy."
            )

        if payload["gender"] == "female" and not payload["menstrualRegularity"]:
            recommendations.append(
                "Track cycle changes over time and discuss irregular patterns with a healthcare professional."
            )

        if payload["gender"] == "female" and payload["pcos"]:
            recommendations.append(
                "If PCOS is a concern, a clinician can help tailor nutrition, activity, and hormone-management strategies."
            )

        if payload["gender"] == "male" and float(payload.get("hoursSitting", 0) or 0) >= 8:
            recommendations.append(
                "Long sitting hours are part of the male reference dataset context, so add regular walking or standing breaks during the day."
            )

        if payload["gender"] == "male" and payload.get("highFeversLastYear") == "less_than_3_months":
            recommendations.append(
                "Recent high fever can temporarily affect semen quality patterns, so consider recovery time and clinical follow-up if fertility concerns persist."
            )

        if reference_insight and reference_insight["probabilityNormal"] < 0.55:
            recommendations.append(
                "The male dataset-backed reference model detected a lower seminal-quality pattern than average, so a clinician-guided fertility assessment may be a helpful next step if you are concerned."
            )

        if not recommendations:
            recommendations.append(
                "Maintain your current healthy habits and continue regular preventive healthcare check-ins."
            )

        return recommendations

    def predict(self, payload: Dict) -> Dict:
        feature_frame = self._build_feature_frame(payload)
        raw_score = float(self.score_artifacts.model.predict(feature_frame)[0])
        synthetic_score = round(float(np.clip(raw_score, 0, 100)), 1)

        shap_values = self.score_artifacts.explainer.shap_values(feature_frame)
        if isinstance(shap_values, list):
            shap_array = np.asarray(shap_values[0])[0]
        else:
            shap_array = np.asarray(shap_values)[0]

        impacts = []
        for feature_name, impact in zip(self.score_artifacts.feature_columns, shap_array):
            rounded_impact = round(float(impact), 1)
            if rounded_impact == 0:
                direction = "neutral"
            elif rounded_impact > 0:
                direction = "positive"
            else:
                direction = "negative"

            impacts.append(
                {
                    "feature": self.score_artifacts.feature_labels[feature_name],
                    "impact": rounded_impact,
                    "direction": direction,
                }
            )

        reference_insight = self._predict_reference_insight(payload)
        score = synthetic_score
        if reference_insight:
            reference_weight = 0.25 if reference_insight["coverage"] == "direct" else 0.15
            reference_score = reference_insight["probabilityNormal"] * 100
            score = round(
                float(
                    np.clip(
                        (synthetic_score * (1 - reference_weight))
                        + (reference_score * reference_weight),
                        0,
                        100,
                    )
                ),
                1,
            )
            reference_impact = round(score - synthetic_score, 1)
            if reference_impact != 0:
                impacts.append(
                    {
                        "feature": "Dataset Reference",
                        "impact": reference_impact,
                        "direction": "positive" if reference_impact > 0 else "negative",
                    }
                )

        top_factors = sorted(impacts, key=lambda item: abs(item["impact"]), reverse=True)[:6]

        return {
            "score": score,
            "bmi": round(float(payload["bmi"]), 2),
            "riskBand": self._risk_band(score),
            "factors": top_factors,
            "recommendations": self._recommendations(payload, reference_insight),
            "disclaimer": DISCLAIMER,
            "referenceInsight": reference_insight,
        }
