
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

interface SettingsPanelProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave?: () => void;
}

export default function SettingsPanel({
  title,
  description,
  children,
  onSave = () => {},
}: SettingsPanelProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm p-6 mb-6 w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
      <div className="mt-8 flex justify-end">
        <Button 
          onClick={onSave}
          className="flex items-center gap-2"
        >
          <Save size={18} />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
