export default function ChartCard({ title, subtitle, children, chartHeight = 'h-64 md:h-72 lg:h-80' }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 border-b border-slate-100 pb-2.5">
        <h3 className="text-base font-semibold tracking-tight text-slate-800 md:text-lg">{title}</h3>
        {subtitle ? <p className="mt-1 text-xs leading-relaxed text-slate-500 md:text-sm">{subtitle}</p> : null}
      </div>
      <div className={chartHeight}>{children}</div>
    </section>
  );
}
