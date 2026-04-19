export default function Disclaimer({ className = "" }) {
  return (
    <div
      className={`panel-outline relative overflow-hidden rounded-[1.5rem] border border-amber-300/25 bg-gradient-to-r from-amber-300/10 via-white/5 to-amber-200/10 px-4 py-4 text-sm text-amber-50 ${className}`}
    >
      <div className="absolute inset-y-0 left-0 w-1 rounded-full bg-gradient-to-b from-amber-200 to-orange-300" />
      <div className="pl-3">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-100/70">Disclaimer</p>
        <p className="mt-2 leading-6">
          This is not a medical diagnosis. Consult a healthcare professional.
        </p>
      </div>
    </div>
  );
}
