from typing import List, Literal

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    age: float = Field(ge=18, le=55)
    heightCm: float = Field(ge=120, le=220)
    weightKg: float = Field(ge=35, le=200)
    bmi: float = Field(ge=10, le=60)
    smoking: bool
    alcohol: bool
    exerciseLevel: float = Field(ge=0, le=5)
    stressLevel: float = Field(ge=1, le=10)
    sleepHours: float = Field(ge=3, le=12)
    gender: Literal["male", "female"]
    menstrualRegularity: bool = False
    pcos: bool = False
    smokingHabit: Literal["never", "occasional", "daily"] | None = None
    alcoholFrequency: Literal["never", "weekly", "several_times_week", "daily"] | None = None
    hoursSitting: float | None = Field(default=None, ge=1, le=16)
    childDiseases: bool | None = None
    accidentTrauma: bool | None = None
    surgicalIntervention: bool | None = None
    highFeversLastYear: (
        Literal["none", "more_than_3_months", "less_than_3_months"] | None
    ) = None
    maleReferenceCoverage: Literal["direct", "derived"] | None = None


class FactorImpact(BaseModel):
    feature: str
    impact: float
    direction: Literal["positive", "negative", "neutral"]


class ReferenceInsight(BaseModel):
    source: str
    datasetRows: int
    probabilityNormal: float
    probabilityAltered: float
    coverage: Literal["direct", "derived"]
    note: str


class PredictionResponse(BaseModel):
    score: float
    bmi: float
    riskBand: str
    factors: List[FactorImpact]
    recommendations: List[str]
    disclaimer: str
    referenceInsight: ReferenceInsight | None = None
