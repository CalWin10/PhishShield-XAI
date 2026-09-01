import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  History,
  BarChart3,
  Scan,
  Home,
  User,
  LogOut,
  ChevronRight,
  X,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { GlassIcon } from '@/components/react-bits/GlassIcons';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      tagline: 'Main Scanner Overview',
      path: '/',
      icon: <Home className="h-5 w-5 text-[#E1D4C2]" />,
      color: 'rgba(225, 212, 194, 0.4)',
      exact: true,
    },
    {
      id: 'scan',
      label: 'Scan & Triage Console',
      tagline: 'Scan Emails, URLs & EML Files',
      path: '/scan',
      icon: <Scan className="h-5 w-5 text-[#E1D4C2]" />,
      color: 'rgba(167, 141, 120, 0.45)',
      exact: false,
    },
    {
      id: 'prevention',
      label: 'Threat Prevention',
      tagline: 'Defense Framework & Detection Rules',
      path: '/prevention',
      icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
      color: 'rgba(52, 211, 153, 0.4)',
      exact: false,
    },
    {
      id: 'history',
      label: 'Scan History',
      tagline: 'Forensic Reports & Investigation Log',
      path: '/history',
      icon: <History className="h-5 w-5 text-[#E1D4C2]" />,
      color: 'rgba(190, 181, 169, 0.4)',
      exact: false,
    },
    {
      id: 'dashboard',
      label: 'Security Dashboard',
      tagline: 'Threat Metrics & Analytics',
      path: '/dashboard',
      icon: <BarChart3 className="h-5 w-5 text-[#E1D4C2]" />,
      color: 'rgba(110, 71, 59, 0.5)',
      exact: false,
    },
  ];

  // Close menu when route changes or ESC key is pressed
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-brand-light/30 bg-[#ded0bd]/95 backdrop-blur-md shadow-xs select-none">
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Hamburger Icon & Brand Name */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Hamburger Button with spring animation */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex items-center justify-center h-11 w-11 rounded-xl bg-brand-dark text-brand-bg shadow-md hover:bg-brand-dark-hover transition-colors duration-200 focus:outline-hidden cursor-pointer"
                aria-label="Toggle navigation menu"
                id="hamburger-menu-btn"
              >
                <div className="flex flex-col items-center justify-center space-y-1 w-5">
                  <motion.span
                    animate={{
                      rotate: isOpen ? 45 : 0,
                      y: isOpen ? 6 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="block h-0.5 w-5 bg-[#E1D4C2] rounded-full origin-center"
                  />
                  <motion.span
                    animate={{
                      opacity: isOpen ? 0 : 1,
                      x: isOpen ? -8 : 0,
                    }}
                    transition={{ duration: 0.15 }}
                    className="block h-0.5 w-5 bg-[#E1D4C2] rounded-full"
                  />
                  <motion.span
                    animate={{
                      rotate: isOpen ? -45 : 0,
                      y: isOpen ? -6 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="block h-0.5 w-5 bg-[#E1D4C2] rounded-full origin-center"
                  />
                </div>
              </motion.button>

              {/* Logo Link */}
              <Link to="/" className="flex items-center space-x-2.5 no-underline hover:no-underline group">
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.05 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-medium text-white shadow-xs transition-colors"
                >
                  <Shield className="h-5 w-5 text-[#E1D4C2]" />
                </motion.div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg font-black tracking-tight text-brand-dark group-hover:text-brand-medium transition-colors font-flaviotte no-underline">
                      PhishShield
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-secondary/60 text-brand-dark font-mono no-underline">
                      XAI
                    </span>
                  </div>
                  <p className="text-[10px] text-brand-dark font-flaviotte font-bold -mt-0.5 hidden sm:block no-underline">
                    Explainable Forensic Engine
                  </p>
                </div>
              </Link>
            </div>

            {/* Middle: Active route indicator badge (Desktop) */}
            <div className="hidden md:flex items-center space-x-1 bg-[#d4c3ae]/70 p-1 rounded-xl border border-brand-light/30">
              {navItems.slice(0, 4).map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.path
                  : item.path === '/scan'
                  ? location.pathname === '/scan' || location.pathname.startsWith('/analyses/')
                  : location.pathname.startsWith(item.path);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.path)}
                    className={cn(
                      'relative px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer select-none font-flaviotte no-underline',
                      isActive ? 'text-brand-bg' : 'text-brand-dark/75 hover:text-brand-dark'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="desktop-nav-indicator"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute inset-0 bg-brand-dark rounded-lg shadow-xs"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {item.id === 'home' && <Home className="h-3.5 w-3.5" />}
                      {item.id === 'scan' && <Scan className="h-3.5 w-3.5" />}
                      {item.id === 'prevention' && <ShieldCheck className="h-3.5 w-3.5" />}
                      {item.id === 'history' && <History className="h-3.5 w-3.5" />}
                      <span>{item.label.split(' ')[0]}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: User Profile Component */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {isAuthenticated && user ? (
                <Link
                  to="/login"
                  className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl border border-brand-light/40 bg-brand-secondary/40 hover:bg-brand-secondary/70 hover:border-brand-medium/50 transition-all cursor-pointer group no-underline hover:no-underline"
                  title="View Profile / Switch Analyst Role"
                  id="user-profile-btn"
                >
                  <div className="h-8 w-8 rounded-lg bg-brand-dark text-[#E1D4C2] flex items-center justify-center font-bold text-xs group-hover:bg-brand-medium transition-colors font-flaviotte">
                    {user.avatarInitials}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black text-brand-dark line-clamp-1 leading-tight group-hover:text-brand-medium transition-colors font-flaviotte no-underline">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-brand-dark/80 font-mono font-bold leading-tight no-underline">
                      {user.roleTitle}
                    </div>
                  </div>
                </Link>
              ) : (
                <Link to="/login" className="no-underline hover:no-underline">
                  <Button variant="primary" size="sm" className="gap-1.5 font-bold text-xs no-underline">
                    <User className="h-3.5 w-3.5" />
                    <span>Mihil Shantha Nivash</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Animated Sliding Side Navigation Drawer with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop Overlay with smooth fade animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-0 bg-brand-dark/70 backdrop-blur-xs cursor-pointer"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Panel: Spring slide-in and slide-out from left */}
            <div className="fixed inset-y-0 left-0 z-50 flex max-w-full">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="w-[85vw] sm:w-[360px] md:w-[320px] lg:w-[28vw] max-w-[420px] min-w-[280px] bg-brand-dark text-brand-bg shadow-2xl border-r border-brand-light/30 flex flex-col justify-between p-5 sm:p-6"
              >
                {/* Drawer Header */}
                <div>
                  <div className="flex items-center justify-between border-b border-brand-light/20 pb-4 mb-6">
                    <div className="flex items-center space-x-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-medium text-white shadow-md">
                        <Shield className="h-5 w-5 text-[#E1D4C2]" />
                      </div>
                      <div>
                        <h2 className="text-base font-black text-white tracking-tight font-flaviotte">PhishShield</h2>
                        <p className="text-[11px] text-[#BEB5A9] font-subtext font-medium">Navigation Menu</p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-bg/15 hover:bg-brand-bg/30 text-[#E1D4C2] transition-colors cursor-pointer"
                      aria-label="Close navigation"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>

                  {/* Navigation Options with Staggered Animation */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#BEB5A9]/80 px-1 mb-2">
                      Quick Navigation
                    </div>

                    {navItems.map((item, index) => {
                      const isActive = item.exact
                        ? location.pathname === item.path
                        : item.path === '/scan'
                        ? location.pathname === '/scan' || location.pathname.startsWith('/analyses/')
                        : location.pathname.startsWith(item.path);

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.08, duration: 0.2 }}
                          whileHover={{ scale: 1.02, x: 3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleNavigate(item.path)}
                          className={cn(
                            'group relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none no-underline',
                            isActive
                              ? 'bg-brand-medium/55 border-brand-light/70 shadow-lg'
                              : 'bg-[#1a1209]/60 border-brand-light/15 hover:bg-brand-medium/30 hover:border-brand-light/35'
                          )}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="active-drawer-glow"
                              className="absolute inset-0 rounded-xl bg-brand-medium/20 pointer-events-none"
                            />
                          )}

                          <div className="flex items-center space-x-3 min-w-0 relative z-10">
                            <GlassIcon
                              icon={item.icon}
                              color={item.color}
                              isActive={isActive}
                              size="sm"
                            />

                            <div className="min-w-0">
                              <div className="text-sm font-bold text-white group-hover:text-[#E1D4C2] transition-colors truncate font-flaviotte">
                                {item.label}
                              </div>
                              <div className="text-[11px] text-[#BEB5A9] font-subtext font-medium truncate">
                                {item.tagline}
                              </div>
                            </div>
                          </div>

                          <ChevronRight
                            className={cn(
                              'h-4 w-4 text-brand-light transition-transform duration-200 shrink-0 ml-2 relative z-10',
                              isActive ? 'translate-x-0.5 text-[#E1D4C2]' : 'group-hover:translate-x-0.5 text-brand-light/50'
                            )}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Drawer Footer: User Profile & Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                  className="border-t border-brand-light/20 pt-4 mt-6 space-y-3"
                >
                  <div
                    onClick={() => handleNavigate('/login')}
                    className="flex items-center space-x-3 p-2.5 rounded-xl bg-brand-bg/10 hover:bg-brand-bg/20 border border-brand-light/20 cursor-pointer transition-colors"
                  >
                    <div className="h-8 w-8 rounded-lg bg-brand-medium flex items-center justify-center font-bold text-[#E1D4C2] text-xs shrink-0">
                      {user?.avatarInitials || 'AS'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-xs truncate font-flaviotte">{user?.name || 'Mihil Shantha Nivash'}</div>
                      <div className="text-[10px] text-[#BEB5A9] font-mono truncate">{user?.roleTitle || 'Security Analyst'}</div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-brand-light/60 shrink-0" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNavigate('/login')}
                      className="flex-1 border-brand-light/30 text-[#E1D4C2] hover:bg-brand-medium/40 font-semibold gap-1 text-[11px] h-8 no-underline"
                    >
                      <Lock className="h-3 w-3" />
                      <span>Clearance</span>
                    </Button>

                    {isAuthenticated && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                          navigate('/login');
                        }}
                        className="border-red-500/30 text-red-300 hover:bg-red-900/30 font-semibold gap-1 text-[11px] h-8 px-2.5 no-underline"
                        title="Sign Out"
                      >
                        <LogOut className="h-3 w-3" />
                        <span>Exit</span>
                      </Button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
