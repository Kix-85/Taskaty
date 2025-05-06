
import { useState } from "react";
import SettingsPanel from "../AccountSetting/SettingsPanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "@/hooks/use-toast";

export default function MainSettings() {
  const { theme, setTheme } = useTheme();
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");

  const handleSave = () => {
    console.log({
      theme,
      autoSave,
      compactMode,
      language,
      dateFormat,
    });
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <div className="space-y-8 w-full">
      <SettingsPanel
        title="General Settings"
        description="Customize your application experience."
        onSave={handleSave}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select 
              value={theme} 
              onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
            >
              <SelectTrigger id="theme" className="w-full max-w-xs">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select 
              value={language} 
              onValueChange={setLanguage}
            >
              <SelectTrigger id="language" className="w-full max-w-xs">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <Select 
              value={dateFormat} 
              onValueChange={setDateFormat}
            >
              <SelectTrigger id="date-format" className="w-full max-w-xs">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-save" className="text-base">Auto Save</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save changes as you make them
              </p>
            </div>
            <Switch
              id="auto-save"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="compact-mode" className="text-base">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use a more compact layout for the interface
              </p>
            </div>
            <Switch
              id="compact-mode"
              checked={compactMode}
              onCheckedChange={setCompactMode}
            />
          </div>
        </div>
      </SettingsPanel>
    </div>
  );
}
