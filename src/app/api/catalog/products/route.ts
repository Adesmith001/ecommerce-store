import { NextResponse } from "next/server";
import { getCatalogListing, parseCatalogListingRequest } from "@/lib/catalog/catalog-listing";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = parseCatalogListingRequest(searchParams);
  const listing = await getCatalogListing(query);

  return NextResponse.json(listing);
}
