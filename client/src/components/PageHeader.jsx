export const PageHeader = ({ eyebrow, title, description, action }) => (
  <div className="animate-rise mb-6 flex flex-col gap-4 border-b border-neutral-200 pb-5 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow ? <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-500">{eyebrow}</p> : null}
      <h1 className="text-2xl font-black text-black md:text-4xl">{title}</h1>
      {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">{description}</p> : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);
