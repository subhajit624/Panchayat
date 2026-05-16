import clsx from "../utils/clsx";

const variants = {
  primary: "bg-black text-white border-black hover:bg-neutral-800 disabled:bg-neutral-400 disabled:border-neutral-400",
  secondary: "bg-white text-black border-neutral-300 hover:border-black hover:bg-neutral-50",
  ghost: "bg-transparent text-black border-transparent hover:bg-neutral-100",
  danger: "bg-white text-black border-black hover:bg-black hover:text-white",
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
      "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0",
      variants[variant],
      className
    )}
    {...props}
  >
    {Icon ? <Icon size={16} aria-hidden="true" /> : null}
    {children}
  </button>
);
