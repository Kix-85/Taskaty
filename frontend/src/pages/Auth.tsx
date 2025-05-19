import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { AxiosError, AxiosResponse } from "axios";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import Cookies from "js-cookie";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    birthDate: ""
  });

  // Get the redirect path from location state
  const from = location.state?.from?.pathname || '/dashboard';

  // Handle Google OAuth callback
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const error = params.get('error');

      if (error) {
        toast.error('Google authentication failed');
        return;
      }

      if (token) {
        try {
          // Verify the token with the backend
          const response = await authService.verifyToken(token);
          if (response.data.user) {
            // Store token in cookie
            Cookies.set('token', response.data.token, {
              expires: 1,
              secure: true,
              sameSite: 'strict'
            });
            
            // Update user state
            setUser(response.data.user);
            toast.success('Successfully logged in with Google!');
            
            // Clear URL parameters
            window.history.replaceState({}, document.title, '/auth');
            
            // Navigate to the intended destination or dashboard
            navigate(from);
          }
        } catch (error) {
          console.error('Error verifying Google token:', error);
          toast.error('Failed to complete Google authentication');
          // Clear URL parameters on error
          window.history.replaceState({}, document.title, '/auth');
        }
      }
    };

    handleGoogleCallback();
  }, [location.search, navigate, setUser, from]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      birthDate: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? 'login' : 'register';

      const res = await authService.sign(endpoint, {
        email: formData.email,
        password: formData.password,
        ...(isLogin ? {} : {
          name: formData.name,
          username: formData.username,
          birthDate: formData.birthDate,
          confirmPassword: formData.confirmPassword
        }),
      });
      
      if(res.status === 200) {
        const user = res.data.user;
        setUser(user);
        toast.success(`Welcome back, ${user.name}!`);
        // Redirect to the intended destination or dashboard
        navigate(from);
      } else if (res.status === 201) {
        toast.success("Registration successful!");
        toast.info("We have sent you email verification. Please verify your email before login.");
        setIsLogin(true);
      } else {
        const response: any = res as AxiosResponse;
        toast.error(response.response.data.message || "An error occurred");
      }
    } catch (error) {
      const err: any = error as AxiosError;
      if(err.response) {
        toast.error(err.response.data.message || "An error occurred");
      } else {
        toast.error("Something went wrong, please try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google') => {
    try {
      console.log(`Redirecting to ${provider} authentication...`);
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
      // toast.info(`${provider} authentication coming soon!`);
    } catch (error) {
      toast.error("Social authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create a new account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Login" : "Register"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialAuth('google')}
              disabled={loading}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <Button variant="link" onClick={toggleAuthMode} className="p-0" disabled={loading}>
                  Register here
                </Button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Button variant="link" onClick={toggleAuthMode} className="p-0" disabled={loading}>
                  Login here
                </Button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;