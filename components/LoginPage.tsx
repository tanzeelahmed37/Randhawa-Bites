import React, { useState, FormEvent } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

type Mode = 'LOGIN' | 'SIGNUP' | 'VERIFY';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<Mode>('LOGIN');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const MOCK_PASSWORD = '1234';
  const MOCK_OTP = '000000';

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password === MOCK_PASSWORD) {
      onLogin();
    } else {
      setError('Invalid password.');
    }
  };
  
  const handleSignup = (e: FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      // Simulate sending OTP email
      setTimeout(() => {
          setIsLoading(false);
          setMode('VERIFY');
      }, 1000);
  };
  
  const handleVerify = (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      if (otp === MOCK_OTP) {
          onLogin();
      } else {
          setError('Invalid verification code.');
      }
  };

  const renderContent = () => {
    switch(mode) {
        case 'SIGNUP':
            return (
                <>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Sign Up</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Enter your email to get a verification code.</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSignup}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Email address
                            </label>
                            <div className="mt-1">
                              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                        </div>
                        {error && <p className="text-center text-red-500 text-sm">{error}</p>}
                        <div>
                            <button
                              type="submit"
                              disabled={isLoading}
                              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-800"
                            >
                              {isLoading ? 'Sending...' : 'Send Code'}
                            </button>
                        </div>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                          Already a user?{' '}
                          <button type="button" onClick={() => setMode('LOGIN')} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Sign In
                          </button>
                        </p>
                    </form>
                </>
            );
        case 'VERIFY':
            return (
                <>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Verify Email</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">A mock verification code was sent to {email}. Enter '{MOCK_OTP}'.</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleVerify}>
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
                        {error && <p className="text-center text-red-500 text-sm">{error}</p>}
                        <div>
                            <button
                              type="submit"
                              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Verify & Login
                            </button>
                        </div>
                    </form>
                </>
            );
        case 'LOGIN':
        default:
            return (
                <>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">RANDHAWA'S</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Enter password '{MOCK_PASSWORD}' to continue</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                          <div className="mt-1">
                              <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                          </div>
                        </div>
                        {error && <p className="text-center text-red-500 text-sm">{error}</p>}
                        <div>
                            <button
                              type="submit"
                              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Sign In
                            </button>
                        </div>
                         <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                          New user?{' '}
                          <button type="button" onClick={() => setMode('SIGNUP')} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Sign Up
                          </button>
                        </p>
                    </form>
                </>
            );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default LoginPage;