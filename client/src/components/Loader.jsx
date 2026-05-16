export const Loader = ({ label = "Loading" }) => (
  <div className="grid min-h-48 place-items-center">
    <div className="flex items-center gap-3 text-sm font-semibold text-neutral-600">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
      {label}
    </div>
  </div>
);

export const EmptyState = ({ title = "Nothing here yet", description }) => (
  <div className="surface grid min-h-40 place-items-center p-8 text-center">
    <div>
      <p className="font-bold text-black">{title}</p>
      {description ? <p className="mt-2 text-sm text-neutral-500">{description}</p> : null}
    </div>
  </div>
);
