"use client";

import { useMemo, useState } from "react";
import { AdminImageField } from "@/components/admin/admin-image-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  StoreContentPage,
  StoreContentPageFormValues,
  StoreSettings,
  StoreSettingsFormValues,
} from "@/types/store-settings";

type AdminStoreSettingsManagerProps = {
  contentPages: StoreContentPage[];
  settings: StoreSettings;
};

function validateSettings(values: StoreSettingsFormValues) {
  const errors: Partial<Record<keyof StoreSettingsFormValues, string>> = {};

  if (!values.storeName.trim()) {
    errors.storeName = "Store name is required.";
  }

  if (!values.contactEmail.trim()) {
    errors.contactEmail = "Contact email is required.";
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required.";
  }

  if (!values.heroTitle.trim()) {
    errors.heroTitle = "Hero title is required.";
  }

  if (!values.announcementBarText.trim()) {
    errors.announcementBarText = "Announcement text is required.";
  }

  return errors;
}

function validateContentPage(values: StoreContentPageFormValues) {
  const errors: Partial<Record<keyof StoreContentPageFormValues, string>> = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  }

  if (!values.body.trim()) {
    errors.body = "Body content is required.";
  }

  return errors;
}

export function AdminStoreSettingsManager({
  contentPages,
  settings: initialSettings,
}: AdminStoreSettingsManagerProps) {
  const [settings, setSettings] = useState<StoreSettingsFormValues>({
    aboutCardCtaLabel: initialSettings.aboutCardCtaLabel,
    aboutCardEyebrow: initialSettings.aboutCardEyebrow,
    announcementBarText: initialSettings.announcementBarText,
    campaignBannerEyebrow: initialSettings.campaignBannerEyebrow,
    campaignDescription: initialSettings.campaignDescription,
    campaignEyebrow: initialSettings.campaignEyebrow,
    campaignPrimaryCtaHref: initialSettings.campaignPrimaryCtaHref,
    campaignPrimaryCtaLabel: initialSettings.campaignPrimaryCtaLabel,
    campaignSecondaryCtaHref: initialSettings.campaignSecondaryCtaHref,
    campaignSecondaryCtaLabel: initialSettings.campaignSecondaryCtaLabel,
    campaignTitle: initialSettings.campaignTitle,
    contactEmail: initialSettings.contactEmail,
    currencyCode: "NGN",
    featuredCategoriesDescription: initialSettings.featuredCategoriesDescription,
    featuredCategoriesEyebrow: initialSettings.featuredCategoriesEyebrow,
    featuredCategoriesTitle: initialSettings.featuredCategoriesTitle,
    featuredProductsCtaLabel: initialSettings.featuredProductsCtaLabel,
    featuredProductsDescription: initialSettings.featuredProductsDescription,
    featuredProductsEyebrow: initialSettings.featuredProductsEyebrow,
    featuredProductsTitle: initialSettings.featuredProductsTitle,
    heroDescription: initialSettings.heroDescription,
    heroEyebrow: initialSettings.heroEyebrow,
    heroPrimaryCtaHref: initialSettings.heroPrimaryCtaHref,
    heroPrimaryCtaLabel: initialSettings.heroPrimaryCtaLabel,
    heroSecondaryCtaHref: initialSettings.heroSecondaryCtaHref,
    heroSecondaryCtaLabel: initialSettings.heroSecondaryCtaLabel,
    heroTitle: initialSettings.heroTitle,
    homepageMetricsCatalogDescription:
      initialSettings.homepageMetricsCatalogDescription,
    homepageMetricsCatalogEyebrow: initialSettings.homepageMetricsCatalogEyebrow,
    homeMetricsCollectionDesc: initialSettings.homeMetricsCollectionDesc,
    homepageMetricsCollectionsEyebrow:
      initialSettings.homepageMetricsCollectionsEyebrow,
    homepageMetricsCurrencyDescription:
      initialSettings.homepageMetricsCurrencyDescription,
    homepageMetricsCurrencyEyebrow:
      initialSettings.homepageMetricsCurrencyEyebrow,
    identityCtaHref: initialSettings.identityCtaHref,
    identityCtaLabel: initialSettings.identityCtaLabel,
    identityDescription: initialSettings.identityDescription,
    identityEyebrow: initialSettings.identityEyebrow,
    identityTitle: initialSettings.identityTitle,
    instagramUrl: initialSettings.instagramUrl,
    logo: initialSettings.logo,
    newsletterDescription: initialSettings.newsletterDescription,
    newsletterDisclaimer: initialSettings.newsletterDisclaimer,
    newsletterEyebrow: initialSettings.newsletterEyebrow,
    newsletterPlaceholder: initialSettings.newsletterPlaceholder,
    newsletterPrimaryCtaLabel: initialSettings.newsletterPrimaryCtaLabel,
    newsletterTitle: initialSettings.newsletterTitle,
    newArrivalsDescription: initialSettings.newArrivalsDescription,
    newArrivalsEyebrow: initialSettings.newArrivalsEyebrow,
    newArrivalsTitle: initialSettings.newArrivalsTitle,
    phoneNumber: initialSettings.phoneNumber,
    pinterestUrl: initialSettings.pinterestUrl,
    seoDescription: initialSettings.seoDescription,
    seoTitle: initialSettings.seoTitle,
    serviceDescription: initialSettings.serviceDescription,
    serviceEyebrow: initialSettings.serviceEyebrow,
    serviceSupportCardEyebrow: initialSettings.serviceSupportCardEyebrow,
    serviceSupportCardTitle: initialSettings.serviceSupportCardTitle,
    serviceTitle: initialSettings.serviceTitle,
    showBestSellers: initialSettings.showBestSellers,
    showFeaturedCategories: initialSettings.showFeaturedCategories,
    showNewArrivals: initialSettings.showNewArrivals,
    showNewsletter: initialSettings.showNewsletter,
    storeName: initialSettings.storeName,
    supportText: initialSettings.supportText,
    tagline: initialSettings.tagline,
    tiktokUrl: initialSettings.tiktokUrl,
  });
  const [pages, setPages] = useState<StoreContentPage[]>(contentPages);
  const [settingsErrors, setSettingsErrors] = useState<
    Partial<Record<keyof StoreSettingsFormValues, string>>
  >({});
  const [contentErrors, setContentErrors] = useState<
    Partial<Record<string, Partial<Record<keyof StoreContentPageFormValues, string>>>>
  >({});
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [contentMessage, setContentMessage] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const seoPreview = useMemo(
    () => `${settings.seoTitle.trim() || settings.storeName} | ${settings.tagline}`,
    [settings.seoTitle, settings.storeName, settings.tagline],
  );

  function updateSetting<Key extends keyof StoreSettingsFormValues>(
    key: Key,
    value: StoreSettingsFormValues[Key],
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function renderInput<Key extends keyof StoreSettingsFormValues>(
    key: Key,
    label: string,
    options?: {
      error?: string;
      helperText?: string;
      placeholder?: string;
      type?: "email" | "text" | "url";
    },
  ) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <Input
          onChange={(event) => updateSetting(key, event.target.value as StoreSettingsFormValues[Key])}
          placeholder={options?.placeholder}
          type={options?.type ?? "text"}
          value={String(settings[key] ?? "")}
        />
        {options?.helperText ? (
          <p className="text-xs text-muted-foreground">{options.helperText}</p>
        ) : null}
        {options?.error ? <p className="text-sm text-danger">{options.error}</p> : null}
      </div>
    );
  }

  function renderTextarea<Key extends keyof StoreSettingsFormValues>(
    key: Key,
    label: string,
    options?: {
      helperText?: string;
      rows?: number;
    },
  ) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <Textarea
          onChange={(event) => updateSetting(key, event.target.value as StoreSettingsFormValues[Key])}
          rows={options?.rows ?? 4}
          value={String(settings[key] ?? "")}
        />
        {options?.helperText ? (
          <p className="text-xs text-muted-foreground">{options.helperText}</p>
        ) : null}
      </div>
    );
  }

  async function saveSettings() {
    const nextErrors = validateSettings(settings);
    setSettingsErrors(nextErrors);
    setSettingsError(null);
    setSettingsMessage(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSavingSettings(true);

      const response = await fetch("/api/admin/settings", {
        body: JSON.stringify(settings),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Failed to save store settings.");
      }

      setSettingsMessage("Store settings saved.");
    } catch (error) {
      setSettingsError(
        error instanceof Error ? error.message : "Failed to save store settings.",
      );
    } finally {
      setIsSavingSettings(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-6">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Store configuration
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-[-0.06em]">
          Content and settings
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          Manage storefront identity, homepage storytelling, and editable policy
          copy without touching code. The storefront currency remains fixed to NGN.
        </p>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Brand settings
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Store identity
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {renderInput("storeName", "Store name", {
                error: settingsErrors.storeName,
              })}
              {renderInput("tagline", "Tagline")}
            </div>

            <AdminImageField
              helperText="Upload the primary logo shown in the storefront shell."
              image={settings.logo}
              label="Store logo"
              onChange={(image) => updateSetting("logo", image)}
            />

            <div className="grid gap-4 md:grid-cols-2">
              {renderInput("contactEmail", "Contact email", {
                error: settingsErrors.contactEmail,
                type: "email",
              })}
              {renderInput("phoneNumber", "Phone number", {
                error: settingsErrors.phoneNumber,
              })}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {renderInput("instagramUrl", "Instagram", { type: "url" })}
              {renderInput("tiktokUrl", "TikTok", { type: "url" })}
              {renderInput("pinterestUrl", "Pinterest", { type: "url" })}
            </div>

            {renderTextarea("supportText", "Support text", { rows: 4 })}
          </Card>

          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Hero settings
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Above-the-fold experience
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {renderInput("announcementBarText", "Announcement bar text", {
                error: settingsErrors.announcementBarText,
              })}
              {renderInput("heroEyebrow", "Hero eyebrow")}
            </div>

            {renderInput("heroTitle", "Hero title", {
              error: settingsErrors.heroTitle,
            })}
            {renderTextarea("heroDescription", "Hero description")}

            <div className="grid gap-4 md:grid-cols-2">
              {renderInput("heroPrimaryCtaLabel", "Primary CTA label")}
              {renderInput("heroPrimaryCtaHref", "Primary CTA href")}
              {renderInput("heroSecondaryCtaLabel", "Secondary CTA label")}
              {renderInput("heroSecondaryCtaHref", "Secondary CTA href")}
            </div>
          </Card>

          <Card className="space-y-6 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Homepage modules
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Section copy and toggles
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["showFeaturedCategories", "Show featured categories"],
                ["showBestSellers", "Show featured products"],
                ["showNewArrivals", "Show new arrivals"],
                ["showNewsletter", "Show newsletter"],
              ].map(([field, label]) => (
                <label
                  key={field}
                  className="flex items-center gap-3 rounded-[1.4rem] border border-white/80 bg-white/72 px-4 py-3 text-sm font-medium"
                >
                  <input
                    checked={Boolean(settings[field as keyof StoreSettingsFormValues])}
                    className="h-4 w-4 accent-primary"
                    onChange={(event) =>
                      updateSetting(
                        field as keyof StoreSettingsFormValues,
                        event.target.checked as StoreSettingsFormValues[keyof StoreSettingsFormValues],
                      )
                    }
                    type="checkbox"
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="space-y-5 rounded-[1.8rem] border border-white/75 bg-white/65 p-5">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                Identity card
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {renderInput("identityEyebrow", "Eyebrow")}
                {renderInput("identityTitle", "Title")}
              </div>
              {renderTextarea("identityDescription", "Description")}
              <div className="grid gap-4 md:grid-cols-2">
                {renderInput("identityCtaLabel", "CTA label")}
                {renderInput("identityCtaHref", "CTA href")}
              </div>
            </div>

            <div className="space-y-5 rounded-[1.8rem] border border-white/75 bg-white/65 p-5">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                Metrics strip
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {renderInput("homepageMetricsCatalogEyebrow", "Catalog card eyebrow")}
                {renderInput(
                  "homepageMetricsCatalogDescription",
                  "Catalog card description",
                )}
                {renderInput(
                  "homepageMetricsCollectionsEyebrow",
                  "Collections card eyebrow",
                )}
                {renderInput(
                  "homeMetricsCollectionDesc",
                  "Collections card description",
                )}
                {renderInput("homepageMetricsCurrencyEyebrow", "Currency card eyebrow")}
                {renderInput(
                  "homepageMetricsCurrencyDescription",
                  "Currency card description",
                )}
              </div>
            </div>

            <div className="space-y-5 rounded-[1.8rem] border border-white/75 bg-white/65 p-5">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                Catalog sections
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {renderInput(
                  "featuredCategoriesEyebrow",
                  "Featured categories eyebrow",
                )}
                {renderInput("featuredCategoriesTitle", "Featured categories title")}
              </div>
              {renderTextarea(
                "featuredCategoriesDescription",
                "Featured categories description",
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {renderInput("featuredProductsEyebrow", "Featured products eyebrow")}
                {renderInput("featuredProductsTitle", "Featured products title")}
              </div>
              {renderTextarea(
                "featuredProductsDescription",
                "Featured products description",
              )}
              <div className="grid gap-4 md:grid-cols-2">
                {renderInput("featuredProductsCtaLabel", "Featured products CTA label")}
                {renderInput("newArrivalsEyebrow", "New arrivals eyebrow")}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {renderInput("newArrivalsTitle", "New arrivals title")}
              </div>
              {renderTextarea("newArrivalsDescription", "New arrivals description")}
            </div>

            <div className="space-y-5 rounded-[1.8rem] border border-white/75 bg-white/65 p-5">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                Service and story
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {renderInput("serviceEyebrow", "Service eyebrow")}
                {renderInput("serviceTitle", "Service title")}
              </div>
              {renderTextarea("serviceDescription", "Service description")}
              <div className="grid gap-4 md:grid-cols-2">
                {renderInput(
                  "serviceSupportCardEyebrow",
                  "Support card eyebrow",
                )}
                {renderInput("serviceSupportCardTitle", "Support card title")}
                {renderInput("aboutCardEyebrow", "About card eyebrow")}
                {renderInput("aboutCardCtaLabel", "About card CTA label")}
              </div>
            </div>

            <div className="space-y-5 rounded-[1.8rem] border border-white/75 bg-white/65 p-5">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                Campaign and newsletter
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {renderInput("campaignEyebrow", "Campaign section eyebrow")}
                {renderInput("campaignTitle", "Campaign section title")}
              </div>
              {renderTextarea("campaignDescription", "Campaign section description")}
              <div className="grid gap-4 md:grid-cols-2">
                {renderInput("campaignBannerEyebrow", "Campaign banner eyebrow")}
                {renderInput("campaignPrimaryCtaLabel", "Campaign primary CTA label")}
                {renderInput("campaignPrimaryCtaHref", "Campaign primary CTA href")}
                {renderInput(
                  "campaignSecondaryCtaLabel",
                  "Campaign secondary CTA label",
                )}
                {renderInput(
                  "campaignSecondaryCtaHref",
                  "Campaign secondary CTA href",
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {renderInput("newsletterEyebrow", "Newsletter eyebrow")}
                {renderInput("newsletterTitle", "Newsletter title")}
              </div>
              {renderTextarea("newsletterDescription", "Newsletter description")}
              <div className="grid gap-4 md:grid-cols-2">
                {renderInput("newsletterPlaceholder", "Newsletter input placeholder")}
                {renderInput(
                  "newsletterPrimaryCtaLabel",
                  "Newsletter primary CTA label",
                )}
              </div>
              {renderTextarea("newsletterDisclaimer", "Newsletter disclaimer", {
                rows: 3,
              })}
            </div>

            <Button disabled={isSavingSettings} onClick={saveSettings} size="lg">
              {isSavingSettings ? "Saving..." : "Save store settings"}
            </Button>

            {settingsMessage ? <p className="text-sm text-success">{settingsMessage}</p> : null}
            {settingsError ? <p className="text-sm text-danger">{settingsError}</p> : null}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                SEO defaults
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Metadata defaults
              </h2>
            </div>

            {renderInput("seoTitle", "Default SEO title")}
            {renderTextarea("seoDescription", "Default SEO description")}

            <div className="rounded-[1.6rem] border border-white/80 bg-white/72 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Preview
              </p>
              <p className="mt-3 font-medium">{seoPreview}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {settings.seoDescription}
              </p>
              <p className="mt-3 text-sm font-medium text-primary">Currency: NGN</p>
            </div>
          </Card>

          {pages.map((page) => (
            <Card key={page.slug} className="space-y-5 p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Content page
                </p>
                <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                  {page.title}
                </h2>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Eyebrow</label>
                <Input
                  onChange={(event) =>
                    setPages((current) =>
                      current.map((entry) =>
                        entry.slug === page.slug
                          ? { ...entry, eyebrow: event.target.value }
                          : entry,
                      ),
                    )
                  }
                  value={page.eyebrow}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  onChange={(event) =>
                    setPages((current) =>
                      current.map((entry) =>
                        entry.slug === page.slug
                          ? { ...entry, description: event.target.value }
                          : entry,
                      ),
                    )
                  }
                  value={page.description}
                />
                {contentErrors[page.slug]?.description ? (
                  <p className="text-sm text-danger">
                    {contentErrors[page.slug]?.description}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Body</label>
                <Textarea
                  onChange={(event) =>
                    setPages((current) =>
                      current.map((entry) =>
                        entry.slug === page.slug
                          ? { ...entry, body: event.target.value }
                          : entry,
                      ),
                    )
                  }
                  rows={8}
                  value={page.body}
                />
                {contentErrors[page.slug]?.body ? (
                  <p className="text-sm text-danger">{contentErrors[page.slug]?.body}</p>
                ) : null}
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SEO title</label>
                  <Input
                    onChange={(event) =>
                      setPages((current) =>
                        current.map((entry) =>
                          entry.slug === page.slug
                            ? { ...entry, seoTitle: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    value={page.seoTitle}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SEO description</label>
                  <Textarea
                    onChange={(event) =>
                      setPages((current) =>
                        current.map((entry) =>
                          entry.slug === page.slug
                            ? { ...entry, seoDescription: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    rows={4}
                    value={page.seoDescription}
                  />
                </div>
              </div>

              <Button
                disabled={savingSlug === page.slug}
                onClick={async () => {
                  const nextErrors = validateContentPage(page);
                  setContentErrors((current) => ({
                    ...current,
                    [page.slug]: nextErrors,
                  }));
                  setContentError(null);
                  setContentMessage(null);

                  if (Object.keys(nextErrors).length > 0) {
                    return;
                  }

                  try {
                    setSavingSlug(page.slug);

                    const response = await fetch("/api/admin/settings/content", {
                      body: JSON.stringify(page),
                      headers: { "Content-Type": "application/json" },
                      method: "POST",
                    });
                    const payload = (await response.json()) as {
                      contentPage?: StoreContentPage;
                      message?: string;
                    };

                    if (!response.ok || !payload.contentPage) {
                      throw new Error(payload.message ?? "Failed to save content page.");
                    }

                    setPages((current) =>
                      current.map((entry) =>
                        entry.slug === payload.contentPage!.slug
                          ? payload.contentPage!
                          : entry,
                      ),
                    );
                    setContentMessage(`${payload.contentPage.title} saved.`);
                  } catch (error) {
                    setContentError(
                      error instanceof Error
                        ? error.message
                        : "Failed to save content page.",
                    );
                  } finally {
                    setSavingSlug(null);
                  }
                }}
                variant="outline"
              >
                {savingSlug === page.slug ? "Saving..." : "Save page content"}
              </Button>
            </Card>
          ))}

          {contentMessage ? <p className="text-sm text-success">{contentMessage}</p> : null}
          {contentError ? <p className="text-sm text-danger">{contentError}</p> : null}
        </div>
      </div>
    </div>
  );
}
