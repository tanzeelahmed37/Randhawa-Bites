import React, { useState, FormEvent } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

type AuthMode = 'SIGN_IN' | 'SIGN_UP' | 'VERIFY_OTP';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('SIGN_IN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (!supabase) {
      setError("Supabase client is not configured.");
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'SIGN_IN') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // The onAuthStateChange listener in App.tsx will handle the redirect
      } else if (mode === 'SIGN_UP') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // For both new users and existing unconfirmed users, Supabase sends a confirmation email.
        // The user is then prompted to enter the verification code from the email.
        setMessage('Please check your email for a verification code.');
        setMode('VERIFY_OTP');
      } else if (mode === 'VERIFY_OTP') {
        const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'signup' });
        if (error) throw error;
        // The onAuthStateChange listener in App.tsx will handle the redirect
      }
    } catch (error: any) {
        if (error.message.includes("User already registered")) {
            setError("This email is already registered. Please sign in.");
        } else {
           setError(error.message || 'An unexpected error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (mode) {
      case 'VERIFY_OTP':
        return {
          title: 'Verify Your Email',
          description: `A verification code has been sent to ${email}`,
          buttonText: 'Verify Email',
          formFields: (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Verification Code
              </label>
              <div className="mt-1">
                <input id="otp" name="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          ),
          footer: null
        };
      case 'SIGN_UP':
        return {
          title: 'Create an Account',
          description: "Get started with RANDHAWA Bites",
          buttonText: 'Sign Up',
          formFields: (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
            </>
          ),
          footer: (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button onClick={() => { setMode('SIGN_IN'); setError(null); }} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Sign In
              </button>
            </p>
          )
        };
      case 'SIGN_IN':
      default:
        return {
          title: 'Sign In',
          description: "Welcome back to RANDHAWA Bites",
          buttonText: 'Sign In',
          formFields: (
             <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
            </>
          ),
          footer: (
             <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button onClick={() => { setMode('SIGN_UP'); setError(null); }} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Sign Up
              </button>
            </p>
          )
        };
    }
  };

  // FIX: Refactored to handle the unconfigured state with an early return, which resolves the type errors.
  if (!isSupabaseConfigured) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                 <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">RANDHAWA Bites</h1>
                     <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 rounded-r-lg">
                        <p className="font-bold">Configuration Needed</p>
                        <p className="text-sm">Supabase has not been configured. Please add your anon public key in <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">services/supabaseClient.ts</code> to enable authentication.</p>
                    </div>
                 </div>
            </div>
        </div>
    );
  }
  
  const { title, description, buttonText, formFields, footer } = renderContent();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
        </div>

        <form className="space-y-6" onSubmit={handleAuthAction}>
          {formFields}
          
          {error && <p className="text-center text-red-500 text-sm">{error}</p>}
          {message && <p className="text-center text-green-500 text-sm">{message}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-800"
            >
              {isLoading ? 'Processing...' : buttonText}
            </button>
          </div>
          {footer}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;