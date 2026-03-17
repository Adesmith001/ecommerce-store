import { Card } from "@/components/ui/card";

export default function AccountSettingsPage() {
  return (
    <Card className="space-y-4 p-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Account settings</h1>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">
        Notification preferences and advanced account settings will plug in here in a
        later chunk.
      </p>
    </Card>
  );
}
