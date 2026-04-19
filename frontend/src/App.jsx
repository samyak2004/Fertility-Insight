import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

const HomePage = lazy(() => import("./pages/HomePage"));
const FormPage = lazy(() => import("./pages/FormPage"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));

export default function App() {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="glass panel-outline mx-auto max-w-2xl rounded-[2rem] p-10 text-center shadow-panel">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-100/55">Loading</p>
            <h1 className="mt-3 font-display text-4xl text-white">Preparing your experience</h1>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assessment" element={<FormPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
