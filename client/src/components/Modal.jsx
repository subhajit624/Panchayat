import { X } from "lucide-react";
import { Button } from "./Button";

export const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg border border-black bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-black text-black">{title}</h2>
          <Button variant="ghost" className="h-9 w-9 px-0" onClick={onClose} aria-label="Close" icon={X} />
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-5 app-scrollbar">{children}</div>
        {footer ? <div className="border-t border-neutral-200 p-5">{footer}</div> : null}
      </div>
    </div>
  );
};
