import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Logo from '../../components/common/Logo.jsx';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real app, this would make an API call
      // For now, we'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center mb-4">
              <Logo className="h-12 w-12" />
            </Link>
            <h1 className="text-2xl font-bold text-neutral-800">Reset your password</h1>
            <p className="text-neutral-600 mt-2">
              Enter your email address and we'll send you instructions to reset your password
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-error/10 rounded-lg flex items-start">
              <AlertCircle size={20} className="text-error mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-error text-sm">{error}</p>
            </div>
          )}
          
          {success ? (
            <div className="text-center">
              <div className="mb-6 p-4 bg-success/10 rounded-lg">
                <p className="text-success">
                  Password reset instructions have been sent to your email address.
                  Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>
              
              <Link
                to="/login"
                className="inline-flex items-center text-primary hover:underline"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="label">
                  Email address
                </label>
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
              
              <button
                type="submit"
                className="btn btn-primary w-full py-3"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Sending instructions...
                  </span>
                ) : (
                  'Send reset instructions'
                )}
              </button>
              
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-primary hover:underline text-sm"
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;