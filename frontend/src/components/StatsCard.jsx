export default function StatsCard({
  title,
  value,
  helper,
  accent = 'bg-emerald-500',
  icon = null,
  iconBg = 'bg-emerald-100',
  iconColor = 'text-emerald-700',
}) {
  return (
    <article className="h-full min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:min-h-32 md:px-5 md:py-4">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold tracking-wide text-slate-500 md:text-sm">{title}</p>
          <div className="flex items-center gap-2">
            {icon ? (
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
                {icon}
              </span>
            ) : null}
            <span className={`h-2 w-2 rounded-full ${accent}`} aria-hidden="true" />
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold leading-tight text-slate-800 md:text-4xl">{value}</p>
          {helper ? <p className="mt-1.5 text-xs text-slate-500">{helper}</p> : null}
        </div>
      </div>
    </article>
  );
}
