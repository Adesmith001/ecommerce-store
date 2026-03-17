"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AccountAddress } from "@/types/account";

type AddressFormState = {
  addressLine: string;
  city: string;
  country: string;
  fullName: string;
  id: string | null;
  isDefault: boolean;
  label: string;
  landmark: string;
  phoneNumber: string;
  postalCode: string;
  state: string;
};

type AccountAddressesManagerProps = {
  initialAddresses: AccountAddress[];
};

const EMPTY_FORM: AddressFormState = {
  id: null,
  label: "",
  fullName: "",
  phoneNumber: "",
  country: "",
  state: "",
  city: "",
  addressLine: "",
  landmark: "",
  postalCode: "",
  isDefault: false,
};

export function AccountAddressesManager({
  initialAddresses,
}: AccountAddressesManagerProps) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [form, setForm] = useState<AddressFormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = <K extends keyof AddressFormState>(
    key: K,
    value: AddressFormState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const method = form.id ? "PATCH" : "POST";
      const endpoint = form.id
        ? `/api/account/addresses/${form.id}`
        : "/api/account/addresses";

      const response = await fetch(endpoint, {
        body: JSON.stringify({
          addressLine: form.addressLine,
          city: form.city,
          country: form.country,
          fullName: form.fullName,
          isDefault: form.isDefault,
          label: form.label,
          landmark: form.landmark,
          phoneNumber: form.phoneNumber,
          postalCode: form.postalCode,
          state: form.state,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method,
      });

      const payload = (await response.json()) as {
        address?: AccountAddress;
        message?: string;
      };

      if (!response.ok || !payload.address) {
        throw new Error(payload.message ?? "Failed to save address.");
      }

      setAddresses((current) => {
        const next = current.filter((address) => address.id !== payload.address!.id);
        const normalizedAddress = payload.address!;
        const withDefault = normalizedAddress.isDefault
          ? next.map((address) => ({ ...address, isDefault: false }))
          : next;

        return [normalizedAddress, ...withDefault].sort(
          (left, right) => Number(right.isDefault) - Number(left.isDefault),
        );
      });

      setSuccess(form.id ? "Address updated." : "Address added.");
      resetForm();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save address.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (address: AccountAddress) => {
    setForm({
      id: address.id,
      label: address.label,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      country: address.country,
      state: address.state,
      city: address.city,
      addressLine: address.addressLine,
      landmark: address.landmark,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (addressId: string) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/account/addresses/${addressId}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Failed to delete address.");
      }

      setAddresses((current) => current.filter((address) => address.id !== addressId));
      if (form.id === addressId) {
        resetForm();
      }
      setSuccess("Address deleted.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Failed to delete address.",
      );
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-5">
        <Card className="space-y-5 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Addresses
            </p>
            <h1 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Saved addresses
            </h1>
          </div>

          {addresses.length === 0 ? (
            <EmptyState
              description="Save delivery addresses here so checkout can reuse them later."
              title="No addresses saved"
            />
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <Card key={address.id} className="space-y-4 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{address.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.isDefault ? "Default address" : "Saved address"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(address)}
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => void handleDelete(address.id)}
                        size="sm"
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm leading-7 text-muted-foreground">
                    <p className="font-medium text-foreground">{address.fullName}</p>
                    <p>{address.phoneNumber}</p>
                    <p>{address.addressLine}</p>
                    {address.landmark ? <p>{address.landmark}</p> : null}
                    <p>
                      {address.city}, {address.state}
                    </p>
                    <p>{address.country}</p>
                    {address.postalCode ? <p>{address.postalCode}</p> : null}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="space-y-5 p-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
            {form.id ? "Edit address" : "New address"}
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
            {form.id ? "Update saved address" : "Add a delivery address"}
          </h2>
        </div>

        <div className="grid gap-4">
          <Input
            onChange={(event) => handleChange("label", event.target.value)}
            placeholder="Label (Home, Office, etc.)"
            value={form.label}
          />
          <Input
            onChange={(event) => handleChange("fullName", event.target.value)}
            placeholder="Full name"
            value={form.fullName}
          />
          <Input
            onChange={(event) => handleChange("phoneNumber", event.target.value)}
            placeholder="Phone number"
            value={form.phoneNumber}
          />
          <Input
            onChange={(event) => handleChange("country", event.target.value)}
            placeholder="Country"
            value={form.country}
          />
          <Input
            onChange={(event) => handleChange("state", event.target.value)}
            placeholder="State"
            value={form.state}
          />
          <Input
            onChange={(event) => handleChange("city", event.target.value)}
            placeholder="City"
            value={form.city}
          />
          <Textarea
            onChange={(event) => handleChange("addressLine", event.target.value)}
            placeholder="Address line"
            rows={4}
            value={form.addressLine}
          />
          <Input
            onChange={(event) => handleChange("landmark", event.target.value)}
            placeholder="Landmark"
            value={form.landmark}
          />
          <Input
            onChange={(event) => handleChange("postalCode", event.target.value)}
            placeholder="Postal code"
            value={form.postalCode}
          />
          <label className="flex items-center gap-3 rounded-[1.4rem] border border-white/80 bg-white/72 px-4 py-3 text-sm font-medium">
            <input
              checked={form.isDefault}
              className="h-4 w-4 accent-primary"
              onChange={(event) => handleChange("isDefault", event.target.checked)}
              type="checkbox"
            />
            Make this my default address
          </label>
        </div>

        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {success ? <p className="text-sm text-success">{success}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Button disabled={isSaving} onClick={handleSubmit}>
            {isSaving ? "Saving..." : form.id ? "Update address" : "Add address"}
          </Button>
          {form.id ? (
            <Button onClick={resetForm} variant="outline">
              Cancel
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
