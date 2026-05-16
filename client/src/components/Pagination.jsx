import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export const Pagination = ({ pagination, onPage }) => {
  if (!pagination || pagination.pages <= 1) return null;

  return (
    <div className="mt-5 flex items-center justify-between">
      <p className="text-sm text-neutral-500">
        Page {pagination.page} of {pagination.pages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          icon={ChevronLeft}
          disabled={pagination.page <= 1}
          onClick={() => onPage(pagination.page - 1)}
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          icon={ChevronRight}
          disabled={pagination.page >= pagination.pages}
          onClick={() => onPage(pagination.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
