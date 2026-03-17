"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AccountProfile } from "@/types/account";

type AccountProfileFormProps = {
  profile: AccountProfile;
};

export function AccountProfileForm({ profile }: AccountProfileFormProps) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/account/profile", {
        body: JSON.stringify({
          avatar,
          fullName,
          phone,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Failed to update profile.");
      }

      setSuccess("Profile updated successfully.");
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to update profile.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Profile
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Personal information
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Email is managed by Clerk authentication. Name, phone, and avatar here are
          your storefront profile details.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium" htmlFor="accountFullName">
            Full name
          </label>
          <Input
            id="accountFullName"
            onChange={(event) => setFullName(event.target.value)}
            value={fullName}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="accountEmail">
            Email
          </label>
          <Input disabled id="accountEmail" value={profile.email} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="accountPhone">
            Phone
          </label>
          <Input
            id="accountPhone"
            onChange={(event) => setPhone(event.target.value)}
            value={phone}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium" htmlFor="accountAvatar">
            Avatar URL
          </label>
          <Input
            id="accountAvatar"
            onChange={(event) => setAvatar(event.target.value)}
            placeholder="https://..."
            value={avatar}
          />
        </div>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {success ? <p className="text-sm text-success">{success}</p> : null}

      <Button disabled={isSaving} onClick={handleSave}>
        {isSaving ? "Saving..." : "Save profile"}
      </Button>
    </Card>
  );
}
