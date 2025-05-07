
import { useState } from "react";
import SettingsPanel from "../AccountSetting/SettingsPanel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState("immediate");

  const handleSave = () => {
    console.log({
      emailNotifications,
      pushNotifications,
      soundAlerts,
      notificationFrequency,
    });
  };

  return (
    <div className="space-y-8 w-full">
      <SettingsPanel
        title="Notification Preferences"
        description="Control how and when you receive notifications."
        onSave={handleSave}
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Channels</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications in-app</p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound-alerts" className="text-base">Sound Alerts</Label>
                <p className="text-sm text-muted-foreground">Play sounds for important notifications</p>
              </div>
              <Switch
                id="sound-alerts"
                checked={soundAlerts}
                onCheckedChange={setSoundAlerts}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Frequency</h3>
            
            <RadioGroup 
              value={notificationFrequency} 
              onValueChange={setNotificationFrequency}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="immediate" id="notification-immediate" />
                <div>
                  <Label htmlFor="notification-immediate" className="text-base">Immediate</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications as events occur
                  </p>
                </div>
              </div>
                
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="digest" id="notification-digest" />
                <div>
                  <Label htmlFor="notification-digest" className="text-base">Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Group all notifications into a daily summary
                  </p>
                </div>
              </div>
                
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="minimal" id="notification-minimal" />
                <div>
                  <Label htmlFor="notification-minimal" className="text-base">Minimal</Label>
                  <p className="text-sm text-muted-foreground">
                    Only receive critical notifications
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </SettingsPanel>
    </div>
  );
}
