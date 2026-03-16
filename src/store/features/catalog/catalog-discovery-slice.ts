import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  getDefaultCatalogListingQuery,
  parseCatalogListingQuery,
} from "@/lib/catalog/catalog-query-state";
import type { CatalogListingQuery } from "@/types/catalog";

type CatalogDiscoveryState = CatalogListingQuery & {
  initialized: boolean;
};

const initialState: CatalogDiscoveryState = {
  ...getDefaultCatalogListingQuery(),
  initialized: false,
};

function resetPage(state: CatalogDiscoveryState) {
  state.page = 1;
}

const catalogDiscoverySlice = createSlice({
  name: "catalogDiscovery",
  initialState,
  reducers: {
    hydrateFromSearchParams: (
      state,
      action: PayloadAction<{
        lockedCategory?: string;
        queryString: string;
      }>,
    ) => {
      const nextState = parseCatalogListingQuery(
        new URLSearchParams(action.payload.queryString),
        {
          category: action.payload.lockedCategory ?? "",
        },
      );

      state.category = action.payload.lockedCategory ?? nextState.category;
      state.brand = nextState.brand;
      state.availability = nextState.availability;
      state.featured = nextState.featured;
      state.minPrice = nextState.minPrice;
      state.maxPrice = nextState.maxPrice;
      state.page = nextState.page;
      state.pageSize = nextState.pageSize;
      state.q = nextState.q;
      state.sort = nextState.sort;
      state.initialized = true;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      resetPage(state);
    },
    setBrand: (state, action: PayloadAction<string>) => {
      state.brand = action.payload;
      resetPage(state);
    },
    setAvailability: (
      state,
      action: PayloadAction<CatalogDiscoveryState["availability"]>,
    ) => {
      state.availability = action.payload;
      resetPage(state);
    },
    setFeatured: (state, action: PayloadAction<boolean>) => {
      state.featured = action.payload;
      resetPage(state);
    },
    setMinPrice: (state, action: PayloadAction<string>) => {
      state.minPrice = action.payload;
      resetPage(state);
    },
    setMaxPrice: (state, action: PayloadAction<string>) => {
      state.maxPrice = action.payload;
      resetPage(state);
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.q = action.payload;
      resetPage(state);
    },
    setSort: (state, action: PayloadAction<CatalogDiscoveryState["sort"]>) => {
      state.sort = action.payload;
      resetPage(state);
    },
    resetDiscoveryState: (state, action: PayloadAction<{ lockedCategory?: string }>) => {
      const nextState = getDefaultCatalogListingQuery({
        category: action.payload.lockedCategory ?? "",
      });

      state.category = nextState.category;
      state.brand = nextState.brand;
      state.availability = nextState.availability;
      state.featured = nextState.featured;
      state.minPrice = nextState.minPrice;
      state.maxPrice = nextState.maxPrice;
      state.page = nextState.page;
      state.pageSize = nextState.pageSize;
      state.q = nextState.q;
      state.sort = nextState.sort;
    },
  },
});

export const {
  hydrateFromSearchParams,
  resetDiscoveryState,
  setAvailability,
  setBrand,
  setCategory,
  setFeatured,
  setMaxPrice,
  setMinPrice,
  setPage,
  setQuery,
  setSort,
} = catalogDiscoverySlice.actions;

export const catalogDiscoveryReducer = catalogDiscoverySlice.reducer;
