"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createCatalogSearchParams } from "@/lib/catalog/catalog-query-state";
import type { CatalogListingQuery, CatalogListingResponse } from "@/types/catalog";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/catalog",
  }),
  endpoints: (builder) => ({
    getProductListing: builder.query<CatalogListingResponse, CatalogListingQuery>({
      query: (params) => ({
        url: "/products",
        params: createCatalogSearchParams(params),
      }),
    }),
  }),
});

export const { useGetProductListingQuery } = catalogApi;
