import clsx from "../utils/clsx";

const variants = {
  primary:
    "bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent hover:brightness-110 hover:shadow-[0_10px_30px_rgba(99,102,241,0.45)] disabled:from-neutral-500 disabled:to-neutral-600 disabled:shadow-none",

  secondary:
    "bg-white/5 text-white border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-indigo-400/40 hover:shadow-[0_8px_24px_rgba(99,102,241,0.18)]",

  ghost:
    "bg-transparent text-neutral-200 border-transparent hover:bg-white/8 hover:text-white",

  danger:
    "bg-gradient-to-r from-rose-500 to-red-600 text-white border-transparent hover:brightness-110 hover:shadow-[0_10px_28px_rgba(239,68,68,0.35)]",
};

export const Button = ({
  children,
  className = "",
  variant = "primary",
  type = "button",
  icon: Icon,
  ...props
}) => (
  <button
    type={type}
    className={clsx(
      `
      focus-ring
      inline-flex
      min-h-11
      items-center
      justify-center
      gap-2.5
      rounded-xl
      border
      px-5
      py-2.5
      text-sm
      font-bold
      tracking-[0.01em]
      shadow-lg
      transition-all
      duration-300
      hover:-translate-y-1
      active:translate-y-0
      disabled:cursor-not-allowed
      disabled:opacity-60
      disabled:hover:translate-y-0
      `,
      variants[variant],
      className
    )}
    {...props}
  >
    {Icon ? (
      <Icon
        size={17}
        aria-hidden="true"
        className="shrink-0"
      />
    ) : null}

    <span>{children}</span>
  </button>
);