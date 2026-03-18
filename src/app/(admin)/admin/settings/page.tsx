import { AdminStoreSettingsManager } from "@/components/admin/admin-store-settings-manager";
import {
  getStoreSettings,
  listStoreContentPages,
} from "@/lib/settings/store-settings-service";

export default async function AdminSettingsPage() {
  const [settings, contentPages] = await Promise.all([
    getStoreSettings(),
    listStoreContentPages(),
  ]);

  return (
    <AdminStoreSettingsManager
      contentPages={contentPages}
      settings={settings}
    />
  );
}
