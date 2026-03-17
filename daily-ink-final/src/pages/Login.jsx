import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplet, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    // Save user info to localStorage
    const userName = isSignUp ? name : (localStorage.getItem('inkwell_user_name') || 'Reader');
    localStorage.setItem('inkwell_user_name', userName || 'Reader');
    localStorage.setItem('inkwell_user_email', email);
    localStorage.setItem('inkwell_logged_in', 'true');
    navigate(isSignUp ? '/onboarding' : '/feed');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-1/2 flex-col items-center justify-center border-r border-border bg-secondary/30 px-12 lg:flex">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-6">
            <Droplet className="h-12 w-12 text-primary fill-primary/30" />
            <h1 className="font-serif text-6xl font-bold text-primary ink-glow">Inkwell</h1>
          </div>
          <p className="font-serif text-2xl text-foreground leading-relaxed">Read What Matters.<br />Every Single Day.</p>
          <p className="mt-4 text-text-secondary max-w-sm">Join thousands of curious readers discovering personalized articles across 50+ topics, delivered fresh daily.</p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[{ value: '50+', label: 'Categories' }, { value: '10K+', label: 'Daily Articles' }, { value: '100K+', label: 'Readers' }, { value: '0', label: 'Paywalls' }].map(s => (
              <div key={s.label} className="rounded-lg border border-border bg-card p-3">
                <p className="font-serif text-xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <Droplet className="h-8 w-8 text-primary fill-primary/30" />
            <span className="font-serif text-3xl font-bold text-primary ink-glow">Inkwell</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">{isSignUp ? 'Create your account' : 'Welcome back'}</h2>
          <p className="mt-1 text-sm text-text-secondary">{isSignUp ? 'Start your personalized reading journey' : 'Sign in to continue reading'}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {!isSignUp && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary hover:text-primary/80">Forgot password?</button>
              </div>
            )}
            <button type="submit" className="flex w-full items-center justify-center gap-2 gold-gradient rounded-lg py-2.5 font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
              {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-primary hover:text-primary/80">
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
