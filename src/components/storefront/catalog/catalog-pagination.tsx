"use client";

import { Button } from "@/components/ui/button";

type CatalogPaginationProps = {
  onPageChange: (page: number) => void;
  page: number;
  totalPages: number;
};

export function CatalogPagination({
  onPageChange,
  page,
  totalPages,
}: CatalogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-border bg-white p-4">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      <div className="flex gap-3">
        <Button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
