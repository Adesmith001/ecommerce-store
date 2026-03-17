"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminArchiveRecordButton } from "@/components/admin/admin-archive-record-button";
import { AdminMerchandisingStatusBadge } from "@/components/admin/admin-merchandising-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import type { AdminCategoryRecord } from "@/types/admin-merchandising";

type AdminCategoriesListProps = {
  categories: AdminCategoryRecord[];
};

export function AdminCategoriesList({ categories }: AdminCategoriesListProps) {
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return categories;
    }

    return categories.filter((category) =>
      [category.name, category.slug, category.description, category.parentCategory?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [categories, query]);

  if (categories.length === 0) {
    return (
      <EmptyState
        action={
          <Link href={`${ROUTES.admin.categories}/new`}>
            <Button>Create your first category</Button>
          </Link>
        }
        description="Categories help the storefront feel merchandised instead of flat."
        title="No categories yet"
      />
    );
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-4 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Category manager
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Collection categories
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, slug, parent..."
              value={query}
            />
            <Link href={`${ROUTES.admin.categories}/new`}>
              <Button>Create category</Button>
            </Link>
          </div>
        </div>
      </Card>

      {filteredCategories.length === 0 ? (
        <EmptyState description="Try another search term." title="No categories match this view" />
      ) : (
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="space-y-4 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminMerchandisingStatusBadge status={category.status} />
                    {category.featured ? (
                      <span className="rounded-full border border-accent/15 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{category.slug}</p>
                  </div>
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                    {category.description}
                  </p>
                  <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3 text-sm">
                    <p className="text-muted-foreground">Parent</p>
                    <p className="mt-1 font-medium">
                      {category.parentCategory?.name ?? "Top-level"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`${ROUTES.admin.categories}/${category.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  {category.status !== "archived" ? (
                    <AdminArchiveRecordButton
                      endpoint={`/api/admin/categories/${category.id}`}
                      label="Category"
                    />
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
