
import { useState } from "react";
import SettingsPanel from "../AccountSetting/SettingsPanel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReminderSetting() {
  const [dueDate, setDueDate] = useState(true);
  const [startDate, setStartDate] = useState(false);
  const [advancedReminder, setAdvancedReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState(15); // minutes

  const handleSave = () => {
    console.log({
      dueDate,
      startDate,
      advancedReminder,
      reminderTime
    });
  };

  return (
    <div className="space-y-8 w-full">
      <SettingsPanel
        title="Task Reminder Settings"
        description="Configure when and how you receive task reminders."
        onSave={handleSave}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="due-date" className="text-base">Due Date Reminders</Label>
              <p className="text-sm text-muted-foreground">Notify me when a task is due</p>
            </div>
            <Switch
              id="due-date"
              checked={dueDate}
              onCheckedChange={setDueDate}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="start-date" className="text-base">Start Date Reminders</Label>
              <p className="text-sm text-muted-foreground">Notify me when a task's start date arrives</p>
            </div>
            <Switch
              id="start-date"
              checked={startDate}
              onCheckedChange={setStartDate}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="advanced-reminder" className="text-base">Advanced Reminder</Label>
              <p className="text-sm text-muted-foreground">Notify me in advance of due dates</p>
            </div>
            <Switch
              id="advanced-reminder"
              checked={advancedReminder}
              onCheckedChange={setAdvancedReminder}
            />
          </div>
          
          {advancedReminder && (
            <div className="space-y-4 mt-4 pl-4 border-l-2 border-border">
              <Label htmlFor="reminder-time">Remind me before (minutes)</Label>
              <div className="flex gap-4 items-center">
                <Slider 
                  id="reminder-time"
                  value={[reminderTime]} 
                  min={5} 
                  max={120} 
                  step={5}
                  onValueChange={(value) => setReminderTime(value[0])}
                  className="w-full max-w-sm" 
                />
                <span className="w-12 text-center">{reminderTime}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="default-priority">Default Priority</Label>
            <Select defaultValue="medium">
              <SelectTrigger id="default-priority" className="w-full max-w-xs">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsPanel>
    </div>
  );
}
