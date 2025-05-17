
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SettingsPanel from "./SettingsPanel";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { userService } from "@/services/userService";
import { toast } from "sonner";

interface FormData {
  name: string;
  username: string;
  email: string;
  bio?: string;
}

export default function AccountSetting() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [user, setUser] = useState<FormData | null>(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await userService.getUserProfile();
        console.log('User profile: ', response);
        const userData = response.data;
        setUser(userData);
        if (userData.profileImage) {
          setAvatar(userData.profileImage);
        }

        // Update form with user data
        form.reset({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          bio: userData.bio || ""
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    getUser();
  }, []);

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      bio: ""
    }
  });
  interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const onReset = async (data: PasswordFormData) => {
    try {
      if (!user?.email) {
        toast.error('User email not found');
        return;
      }

      const response = await userService.resetUserPassword({
        email: user.email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });

      if (response.success) {
        toast.success('Password updated successfully');
        passwordForm.reset(); // Clear the form
      } else {
        toast.error(response.message || 'Failed to update password');
      }
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'An error occurred while updating password');
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Add image if it exists and has changed from the default
      if (avatar && avatar !== user?.profileImage) {
        // If it's a base64 image, convert to blob
        if (avatar.startsWith('data:image')) {
          const response = await fetch(avatar);
          const blob = await response.blob();
          formData.append('profileImage', blob, 'profile.jpg');
        }
      }

      const response = await userService.updateUserProfile(formData);
      console.log('From Response: ', response)
      if (response.success) {
        // Update the user state with new data
        setUser(response.data);
        setAvatar(response.data.profileImage || null);
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile');
    }
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target?.result as string);
    };
    reader.onerror = () => {
      toast.error('Error reading image file');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 w-full">
      <SettingsPanel
        title="Profile Information"
        description="Update your account information and manage your profile."
        onSave={() => form.handleSubmit(onSubmit)()}
      >
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-border">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12" />
                    )}
                  </Avatar>
                </div>
                <div>
                  <Label
                    htmlFor="avatar-upload"
                    className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm inline-block transition-colors"
                  >
                    Change Avatar
                  </Label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your full name" />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your username" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your email" type="email" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </SettingsPanel>      <SettingsPanel
        title="Password"
        description="Update your password to keep your account secure."
        onSave={() => passwordForm.handleSubmit(onReset)()}
      >
        <Form {...passwordForm}>
          <form className="space-y-4" onSubmit={passwordForm.handleSubmit(onReset)}>
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </SettingsPanel>
    </div>
  );
}
