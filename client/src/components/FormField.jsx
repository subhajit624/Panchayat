export const Field = ({ label, children, hint }) => (
  <label className="block space-y-2">
    <span className="text-sm font-semibold text-neutral-800">{label}</span>
    {children}
    {hint ? <span className="block text-xs text-neutral-500">{hint}</span> : null}
  </label>
);

export const Input = (props) => <input className="field" {...props} />;

export const Textarea = (props) => <textarea className="field min-h-28 resize-y" {...props} />;

export const Select = ({ children, ...props }) => (
  <select className="field" {...props}>
    {children}
  </select>
);
