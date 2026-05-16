export const Field = ({ label, children, hint }) => (
  <label className="block space-y-3">
    <span className="text-sm font-bold tracking-[0.01em] text-neutral-200">
      {label}
    </span>

    {children}

    {hint ? (
      <span className="block text-xs font-medium text-neutral-400">
        {hint}
      </span>
    ) : null}
  </label>
);

export const Input = (props) => (
  <input
    className="
      field
      w-full
      rounded-xl
      border
      border-white/10
      bg-white/5
      px-4
      py-3
      text-sm
      font-medium
      text-white
      placeholder:text-neutral-500
      backdrop-blur-md
      transition-all
      duration-300
      outline-none
      hover:border-indigo-400/30
      focus:border-indigo-400
      focus:ring-4
      focus:ring-indigo-500/15
    "
    {...props}
  />
);

export const Textarea = (props) => (
  <textarea
    className="
      field
      min-h-32
      w-full
      resize-y
      rounded-xl
      border
      border-white/10
      bg-white/5
      px-4
      py-3
      text-sm
      font-medium
      text-white
      placeholder:text-neutral-500
      backdrop-blur-md
      transition-all
      duration-300
      outline-none
      hover:border-indigo-400/30
      focus:border-indigo-400
      focus:ring-4
      focus:ring-indigo-500/15
    "
    {...props}
  />
);

export const Select = ({ children, ...props }) => (
  <select
    className="
      field
      w-full
      rounded-xl
      border
      border-white/10
      bg-white/5
      px-4
      py-3
      text-sm
      font-medium
      text-white
      backdrop-blur-md
      transition-all
      duration-300
      outline-none
      hover:border-indigo-400/30
      focus:border-indigo-400
      focus:ring-4
      focus:ring-indigo-500/15
    "
    {...props}
  >
    {children}
  </select>
);