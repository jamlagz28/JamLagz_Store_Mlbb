import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Mail, Lock, Eye, EyeOff, Shield, Gamepad2, Swords, Trophy, Users, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

// Simple Button component inline to avoid import errors
const Button = ({ children, onClick, type = 'button', disabled = false, className = '' }: any) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
};

// Simple Input component inline to avoid import errors
const Input = ({ label, value, onChange, type = 'text', placeholder, icon, required = false }: any) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-2.5 rounded-lg border border-yellow-500/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${icon ? 'pl-10' : ''}`}
        />
      </div>
    </div>
  );
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      await signIn(email, password);
      toast.success('Welcome back, Legend! 🎮');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setEmail('guest@mlbb.com');
    setPassword('guest123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* MLBB Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 opacity-90"></div>
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 max-w-md w-full space-y-8">
        
        {/* MLBB Logo & Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 p-4 rounded-2xl shadow-2xl">
              <Swords className="w-14 h-14 text-white drop-shadow-lg" />
            </div>
          </div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
            MOBILE LEGENDS
          </h2>
          <p className="text-lg font-semibold text-white/80 mt-2">BANG BANG</p>
          <p className="mt-3 text-blue-200 text-sm">
            Sign in to continue your epic journey
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            <Input
              label={<span className="text-yellow-300 font-semibold">EMAIL ADDRESS</span>}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-yellow-400" />}
              required
            />
            
            {/* Password Input */}
            <div className="relative">
              <Input
                label={<span className="text-yellow-300 font-semibold">PASSWORD</span>}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4 text-yellow-400" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-yellow-500 rounded border-yellow-500/30 bg-white/10 focus:ring-yellow-500 cursor-pointer"
              />
              <span className="text-sm text-white/80">
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 hover:from-yellow-600 hover:via-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg shadow-xl transform transition-all duration-300 hover:scale-105"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Swords className="w-5 h-5" />
                START BATTLE
              </>
            )}
          </Button>

          {/* Guest Login Button */}
          <Button
            type="button"
            onClick={handleGuestLogin}
            className="w-full border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 bg-transparent backdrop-blur-sm"
          >
            <Gamepad2 className="w-4 h-4" />
            Play as Guest
          </Button>
        </form>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-sm text-white/60">
          <Shield className="w-4 h-4 text-green-400" />
          <span>Secure like a Mythic rank • 256-bit encryption</span>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-white/80">
            New to the battlefield?{' '}
            <Link
              to="/register"
              className="font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* MLBB Features Grid */}
        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-yellow-500/30">
          <div className="text-center">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <div className="text-xs text-white/70 font-semibold">Mythic Rank</div>
          </div>
          <div className="text-center">
            <Users className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <div className="text-xs text-white/70 font-semibold">10k+ Users</div>
          </div>
          <div className="text-center">
            <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <div className="text-xs text-white/70 font-semibold">Instant Delivery</div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-4">
          <p className="text-[10px] text-white/40">
            © 2024 Mobile Legends Bang Bang Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}