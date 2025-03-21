import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserContext } from '../contexts/UserContext';
import { Facebook, Twitter } from 'lucide-react';

// Define validation schema for login form
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});
type LoginFormInputs = z.infer<typeof loginSchema>;

// Define validation schema for registration form
const registerSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type RegisterFormInputs = z.infer<typeof registerSchema>;

const AuthPage: React.FC = () => {
  // State to toggle between 'login' and 'register' tabs
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { login: userLogin } = useUserContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // React Hook Form for login
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onLoginSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      await userLogin(data.email, data.password);
      // After successful login, you could redirect or show a success message
      alert('Login successful!');
    } catch (error: any) {
      setFormError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // React Hook Form for registration
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterForm,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onRegisterSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      // Simulate registration API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In a real application, registration logic would be implemented here.
      alert('Registration successful! Please login.');
      resetRegisterForm();
      setActiveTab('login');
    } catch (error: any) {
      setFormError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulated social login handler
  const handleSocialLogin = (provider: string): void => {
    alert(`Social login with ${provider} is not implemented.`);
  };

  // Simulated forgot password handler
  const handleForgotPassword = (): void => {
    alert('Password reset link has been sent to your email.');
  };

  return (
    <div className="min-h-screen bg-white text-[#333333]">
      {/* Mobile: Visual branding banner */}
      <div
        className="md:hidden h-40 bg-cover bg-center"
        style={{ backgroundImage: "url('https://picsum.photos/800/400')" }}
      ></div>
      <div className="flex flex-col md:flex-row">
        {/* Desktop/Tablet: Left-side branding (40%) */}
        <div
          className="hidden md:flex md:w-2/5 bg-cover bg-center"
          style={{ backgroundImage: "url('https://picsum.photos/800/1200')" }}
        ></div>
        {/* Right-side Form Container (60% on desktop) */}
        <div className="w-full md:w-3/5 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Tab Headers */}
            <div className="flex justify-center mb-6 border-b">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setFormError(null);
                }}
                className={`px-4 py-2 text-xl font-open-sans font-bold transition duration-300 ${
                  activeTab === 'login'
                    ? 'border-b-2 border-[#4A90E2] text-[#4A90E2]'
                    : 'text-gray-500'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setFormError(null);
                }}
                className={`px-4 py-2 text-xl font-open-sans font-bold transition duration-300 ${
                  activeTab === 'register'
                    ? 'border-b-2 border-[#4A90E2] text-[#4A90E2]'
                    : 'text-gray-500'
                }`}
              >
                Register
              </button>
            </div>
            {/* Tab Content */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="login-email" className="block mb-1 font-open-sans font-bold text-lg">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    {...loginRegister('email')}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#4A90E2] transition duration-300"
                  />
                  {loginErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{loginErrors.email.message}</p>
                  )}
                </div>
                {/* Password Field */}
                <div>
                  <label htmlFor="login-password" className="block mb-1 font-open-sans font-bold text-lg">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    {...loginRegister('password')}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#4A90E2] transition duration-300"
                  />
                  {loginErrors.password && (
                    <p className="mt-1 text-sm text-red-500">{loginErrors.password.message}</p>
                  )}
                </div>
                {/* Forgot Password */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-[#4A90E2] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                {/* Error Message */}
                {formError && <p className="text-center text-red-500">{formError}</p>}
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition duration-300"
                >
                  {isSubmitting ? 'Processing...' : 'Login'}
                </button>
                {/* Social Login Options */}
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Facebook')}
                    className="flex items-center space-x-2 border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition duration-300"
                  >
                    <Facebook size={20} />
                    <span className="text-sm">Facebook</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Twitter')}
                    className="flex items-center space-x-2 border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition duration-300"
                  >
                    <Twitter size={20} />
                    <span className="text-sm">Twitter</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="register-name" className="block mb-1 font-open-sans font-bold text-lg">
                    Name
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    placeholder="Enter your name"
                    {...registerRegister('name')}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#4A90E2] transition duration-300"
                  />
                  {registerErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{registerErrors.name.message}</p>
                  )}
                </div>
                {/* Email Field */}
                <div>
                  <label htmlFor="register-email" className="block mb-1 font-open-sans font-bold text-lg">
                    Email
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    {...registerRegister('email')}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#4A90E2] transition duration-300"
                  />
                  {registerErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{registerErrors.email.message}</p>
                  )}
                </div>
                {/* Password Field */}
                <div>
                  <label htmlFor="register-password" className="block mb-1 font-open-sans font-bold text-lg">
                    Password
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    placeholder="Enter your password"
                    {...registerRegister('password')}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#4A90E2] transition duration-300"
                  />
                  {registerErrors.password && (
                    <p className="mt-1 text-sm text-red-500">{registerErrors.password.message}</p>
                  )}
                </div>
                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="register-confirmPassword" className="block mb-1 font-open-sans font-bold text-lg">
                    Confirm Password
                  </label>
                  <input
                    id="register-confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    {...registerRegister('confirmPassword')}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#4A90E2] transition duration-300"
                  />
                  {registerErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {registerErrors.confirmPassword.message as string}
                    </p>
                  )}
                </div>
                {/* Error Message */}
                {formError && <p className="text-center text-red-500">{formError}</p>}
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] transition duration-300"
                >
                  {isSubmitting ? 'Processing...' : 'Register'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;