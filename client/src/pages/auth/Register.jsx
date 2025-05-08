import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import Logo from '../../components/common/Logo.jsx';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // ✅ New state for role
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      const result = await register(name, email, password, role); // ✅ Pass role

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Password strength indicators
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center mb-4">
              <Logo className="h-12 w-12" />
            </Link>
            <h1 className="text-2xl font-bold text-neutral-800">Create your account</h1>
            <p className="text-neutral-600 mt-2">Join the debate community today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error/10 rounded-lg flex items-start">
              <AlertCircle size={20} className="text-error mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="label">Full name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-12"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {password && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-neutral-700 font-medium">Password requirements:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <PasswordRequirement passed={hasMinLength} label="8+ characters" />
                    <PasswordRequirement passed={hasLowerCase} label="Lowercase (a-z)" />
                    <PasswordRequirement passed={hasUpperCase} label="Uppercase (A-Z)" />
                    <PasswordRequirement passed={hasNumber} label="Number (0-9)" />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">Confirm password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input pr-12 ${
                    confirmPassword && password !== confirmPassword ? 'border-error' : ''
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-error">Passwords do not match</p>
              )}
            </div>

            {/* ✅ Role Selection */}
            <div>
              <label htmlFor="role" className="label">Select Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input"
                required
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-neutral-600">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full py-3"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center mt-6">
            <div className="absolute inset-x-0 top-1/2 h-px bg-neutral-200"></div>
            <div className="relative bg-white px-4 text-sm text-neutral-500">
              Or sign up with
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              type="button"
              className="btn btn-ghost border border-neutral-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                {/* Google Icon Paths */}
                <path d="M22.56 12.25..." fill="#4285F4" />
                <path d="M12 23..." fill="#34A853" />
                <path d="M5.84 14.09..." fill="#FBBC05" />
                <path d="M12 5.38..." fill="#EA4335" />
              </svg>
              Sign up with Google
            </button>
          </div>

          <p className="text-center text-sm text-neutral-600 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// ✅ Component for password requirement item
const PasswordRequirement = ({ passed, label }) => (
  <div className="flex items-center text-xs">
    <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${passed ? 'bg-success text-white' : 'bg-neutral-200'}`}>
      {passed && <Check size={12} />}
    </span>
    <span className={passed ? 'text-success' : 'text-neutral-500'}>{label}</span>
  </div>
);

export default Register;
